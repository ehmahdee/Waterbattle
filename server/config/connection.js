const mongoose = require('mongoose');

// Mongoose setup
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/waterbattle', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mongooseConnection = mongoose.connection;

// Export connections
module.exports = mongooseConnection;
