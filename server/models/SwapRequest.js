import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester is required']
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Provider is required']
  },
  skillRequested: {
    type: String,
    required: [true, 'Skill requested is required'],
    trim: true
  },
  skillCategory: {
    type: String,
    required: [true, 'Skill category is required'],
    trim: true
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  preferredMeetingType: {
    type: String,
    enum: ['online', 'in-person', 'either'],
    default: 'either'
  },
  timeline: {
    type: String,
    enum: ['asap', 'this-week', 'this-month', 'flexible'],
    default: 'flexible'
  },
  responseMessage: {
    type: String,
    maxlength: [500, 'Response message cannot exceed 500 characters'],
    default: ''
  },
  respondedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
swapRequestSchema.index({ requester: 1, createdAt: -1 });
swapRequestSchema.index({ provider: 1, createdAt: -1 });
swapRequestSchema.index({ status: 1 });
swapRequestSchema.index({ skillRequested: 1 });
swapRequestSchema.index({ skillCategory: 1 });

// Compound index for finding requests between specific users
swapRequestSchema.index({ requester: 1, provider: 1 });

// Virtual to populate requester details
swapRequestSchema.virtual('requesterDetails', {
  ref: 'User',
  localField: 'requester',
  foreignField: '_id',
  justOne: true
});

// Virtual to populate provider details
swapRequestSchema.virtual('providerDetails', {
  ref: 'User',
  localField: 'provider',
  foreignField: '_id',
  justOne: true
});

// Method to check if request can be modified
swapRequestSchema.methods.canBeModified = function() {
  return this.status === 'pending';
};

// Method to accept request
swapRequestSchema.methods.accept = function(responseMessage = '') {
  if (!this.canBeModified()) {
    throw new Error('Request cannot be modified');
  }
  this.status = 'accepted';
  this.responseMessage = responseMessage;
  this.respondedAt = new Date();
  return this.save();
};

// Method to decline request
swapRequestSchema.methods.decline = function(responseMessage = '') {
  if (!this.canBeModified()) {
    throw new Error('Request cannot be modified');
  }
  this.status = 'declined';
  this.responseMessage = responseMessage;
  this.respondedAt = new Date();
  return this.save();
};

// Static method to find requests by user (both sent and received)
swapRequestSchema.statics.findByUser = function(userId) {
  return this.find({
    $or: [
      { requester: userId },
      { provider: userId }
    ]
  }).populate('requester provider', 'name email avatar skills location bio');
};

// Static method to find pending requests for a provider
swapRequestSchema.statics.findPendingForProvider = function(providerId) {
  return this.find({
    provider: providerId,
    status: 'pending'
  }).populate('requester', 'name email avatar skills location bio');
};

// Static method to find requests sent by a user
swapRequestSchema.statics.findSentByUser = function(userId) {
  return this.find({
    requester: userId
  }).populate('provider', 'name email avatar skills location bio');
};

// Static method to find requests received by a user
swapRequestSchema.statics.findReceivedByUser = function(userId) {
  return this.find({
    provider: userId
  }).populate('requester', 'name email avatar skills location bio');
};

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);

export default SwapRequest;
