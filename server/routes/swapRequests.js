import express from 'express';
import SwapRequest from '../models/SwapRequest.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /api/swap-requests - Create a new swap request
router.post('/', async (req, res) => {
  try {
    const {
      providerId,
      skillRequested,
      skillCategory,
      message,
      priority,
      preferredMeetingType,
      timeline
    } = req.body;

    // Validation
    if (!providerId || !skillRequested || !skillCategory) {
      return res.status(400).json({
        message: 'Provider ID, skill requested, and skill category are required'
      });
    }

    // Validate provider ID format
    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({
        message: 'Invalid provider ID format'
      });
    }

    // Check if provider exists
    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(404).json({
        message: 'Provider not found'
      });
    }

    // Prevent users from requesting from themselves
    if (providerId === req.user._id.toString()) {
      return res.status(400).json({
        message: 'You cannot send a request to yourself'
      });
    }

    // Check if a pending request already exists between these users for this skill
    const existingRequest = await SwapRequest.findOne({
      requester: req.user._id,
      provider: providerId,
      skillRequested: skillRequested,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        message: 'You already have a pending request for this skill with this provider'
      });
    }

    // Create the swap request
    const swapRequest = new SwapRequest({
      requester: req.user._id,
      provider: providerId,
      skillRequested: skillRequested.trim(),
      skillCategory: skillCategory.trim(),
      message: message ? message.trim() : '',
      priority: priority || 'medium',
      preferredMeetingType: preferredMeetingType || 'either',
      timeline: timeline || 'flexible'
    });

    await swapRequest.save();

    // Populate the request with user details for response
    await swapRequest.populate('requester provider', 'name email avatar skills location bio');

    res.status(201).json({
      message: 'Swap request created successfully',
      swapRequest
    });

  } catch (error) {
    console.error('Error creating swap request:', error);
    res.status(500).json({
      message: 'Server error while creating swap request',
      error: error.message
    });
  }
});

// GET /api/swap-requests - Get swap requests for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { type = 'all', status } = req.query;

    let query = {};

    // Filter by type (sent, received, or all)
    switch (type) {
      case 'sent':
        query.requester = req.user._id;
        break;
      case 'received':
        query.provider = req.user._id;
        break;
      case 'all':
      default:
        query.$or = [
          { requester: req.user._id },
          { provider: req.user._id }
        ];
        break;
    }

    // Filter by status if provided
    if (status && ['pending', 'accepted', 'declined', 'completed'].includes(status)) {
      query.status = status;
    }

    const swapRequests = await SwapRequest.find(query)
      .populate('requester provider', 'name email avatar skills location bio')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Swap requests retrieved successfully',
      swapRequests,
      count: swapRequests.length
    });

  } catch (error) {
    console.error('Error fetching swap requests:', error);
    res.status(500).json({
      message: 'Server error while fetching swap requests',
      error: error.message
    });
  }
});

// GET /api/swap-requests/:id - Get a specific swap request
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid request ID format'
      });
    }

    const swapRequest = await SwapRequest.findById(id)
      .populate('requester provider', 'name email avatar skills location bio');

    if (!swapRequest) {
      return res.status(404).json({
        message: 'Swap request not found'
      });
    }

    // Check if user is involved in this request
    const userId = req.user._id.toString();
    if (
      swapRequest.requester._id.toString() !== userId &&
      swapRequest.provider._id.toString() !== userId
    ) {
      return res.status(403).json({
        message: 'Access denied. You are not involved in this request.'
      });
    }

    res.json({
      message: 'Swap request retrieved successfully',
      swapRequest
    });

  } catch (error) {
    console.error('Error fetching swap request:', error);
    res.status(500).json({
      message: 'Server error while fetching swap request',
      error: error.message
    });
  }
});

// PUT /api/swap-requests/:id/respond - Respond to a swap request (accept/decline)
router.put('/:id/respond', async (req, res) => {
  try {
    const { id } = req.params;
    const { action, responseMessage } = req.body;

    // Validation
    if (!action || !['accept', 'decline'].includes(action)) {
      return res.status(400).json({
        message: 'Action must be either "accept" or "decline"'
      });
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid request ID format'
      });
    }

    const swapRequest = await SwapRequest.findById(id);

    if (!swapRequest) {
      return res.status(404).json({
        message: 'Swap request not found'
      });
    }

    // Check if the authenticated user is the provider of this request
    if (swapRequest.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. Only the provider can respond to this request.'
      });
    }

    // Check if request can be modified
    if (!swapRequest.canBeModified()) {
      return res.status(400).json({
        message: 'This request has already been responded to'
      });
    }

    // Respond to the request
    if (action === 'accept') {
      await swapRequest.accept(responseMessage || '');
    } else {
      await swapRequest.decline(responseMessage || '');
    }

    // Populate and return the updated request
    await swapRequest.populate('requester provider', 'name email avatar skills location bio');

    res.json({
      message: `Swap request ${action}ed successfully`,
      swapRequest
    });

  } catch (error) {
    console.error('Error responding to swap request:', error);
    res.status(500).json({
      message: 'Server error while responding to swap request',
      error: error.message
    });
  }
});

// PUT /api/swap-requests/:id/complete - Mark a request as completed
router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid request ID format'
      });
    }

    const swapRequest = await SwapRequest.findById(id);

    if (!swapRequest) {
      return res.status(404).json({
        message: 'Swap request not found'
      });
    }

    // Check if user is involved in this request
    const userId = req.user._id.toString();
    if (
      swapRequest.requester.toString() !== userId &&
      swapRequest.provider.toString() !== userId
    ) {
      return res.status(403).json({
        message: 'Access denied. You are not involved in this request.'
      });
    }

    // Check if request is accepted first
    if (swapRequest.status !== 'accepted') {
      return res.status(400).json({
        message: 'Only accepted requests can be marked as completed'
      });
    }

    // Mark as completed
    swapRequest.status = 'completed';
    await swapRequest.save();

    // Populate and return the updated request
    await swapRequest.populate('requester provider', 'name email avatar skills location bio');

    res.json({
      message: 'Swap request marked as completed successfully',
      swapRequest
    });

  } catch (error) {
    console.error('Error completing swap request:', error);
    res.status(500).json({
      message: 'Server error while completing swap request',
      error: error.message
    });
  }
});

// DELETE /api/swap-requests/:id - Cancel/delete a swap request
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid request ID format'
      });
    }

    const swapRequest = await SwapRequest.findById(id);

    if (!swapRequest) {
      return res.status(404).json({
        message: 'Swap request not found'
      });
    }

    // Check if the authenticated user is the requester
    if (swapRequest.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. Only the requester can cancel this request.'
      });
    }

    // Only allow deletion of pending requests
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({
        message: 'Only pending requests can be cancelled'
      });
    }

    await SwapRequest.findByIdAndDelete(id);

    res.json({
      message: 'Swap request cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling swap request:', error);
    res.status(500).json({
      message: 'Server error while cancelling swap request',
      error: error.message
    });
  }
});

// GET /api/swap-requests/stats/summary - Get request statistics for the user
router.get('/stats/summary', async (req, res) => {
  try {
    const userId = req.user._id;

    const [sentRequests, receivedRequests] = await Promise.all([
      SwapRequest.countDocuments({ requester: userId }),
      SwapRequest.countDocuments({ provider: userId })
    ]);

    const [pendingSent, pendingReceived] = await Promise.all([
      SwapRequest.countDocuments({ requester: userId, status: 'pending' }),
      SwapRequest.countDocuments({ provider: userId, status: 'pending' })
    ]);

    const [acceptedSent, acceptedReceived] = await Promise.all([
      SwapRequest.countDocuments({ requester: userId, status: 'accepted' }),
      SwapRequest.countDocuments({ provider: userId, status: 'accepted' })
    ]);

    const [completedSent, completedReceived] = await Promise.all([
      SwapRequest.countDocuments({ requester: userId, status: 'completed' }),
      SwapRequest.countDocuments({ provider: userId, status: 'completed' })
    ]);

    res.json({
      message: 'Request statistics retrieved successfully',
      stats: {
        sent: {
          total: sentRequests,
          pending: pendingSent,
          accepted: acceptedSent,
          completed: completedSent
        },
        received: {
          total: receivedRequests,
          pending: pendingReceived,
          accepted: acceptedReceived,
          completed: completedReceived
        }
      }
    });

  } catch (error) {
    console.error('Error fetching request statistics:', error);
    res.status(500).json({
      message: 'Server error while fetching request statistics',
      error: error.message
    });
  }
});

export default router;
