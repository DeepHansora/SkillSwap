import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('📡 MongoDB URI format check:');
    
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.log('❌ MONGODB_URI not found in .env file');
      return;
    }
    
    if (uri.includes('<username>') || uri.includes('<password>')) {
      console.log('❌ MongoDB URI still contains placeholders!');
      console.log('📝 Please replace <username>, <password>, <cluster-url>, and <database-name> with your actual values');
      console.log('🔗 Your current URI:', uri);
      return;
    }
    
    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      console.log('❌ Invalid MongoDB URI format');
      console.log('🔗 Your current URI:', uri);
      return;
    }
    
    console.log('✅ MongoDB URI format looks good');
    console.log('🔄 Attempting to connect...');
    
    const conn = await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || 'swapskills',
    });
    
    console.log('🎉 MongoDB Connected Successfully!');
    console.log('📍 Host:', conn.connection.host);
    console.log('📊 Database:', conn.connection.db.databaseName);
    console.log('🔌 Connection State:', conn.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔚 Test connection closed');
    
  } catch (error) {
    console.log('❌ MongoDB Connection Failed:');
    console.log('📄 Error:', error.message);
    
    if (error.message.includes('authentication')) {
      console.log('🔐 Authentication Error: Check your username and password');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('🌐 Network Error: Check your cluster URL and internet connection');
    } else if (error.message.includes('Invalid scheme')) {
      console.log('🔗 URI Format Error: Check your connection string format');
    }
  }
};

testConnection();
