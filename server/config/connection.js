const mongoose = require('mongoose');
const Sequelize = require('sequelize');
/* require('dotenv').config(); */

// Mongoose setup
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/waterbattle', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mongooseConnection = mongoose.connection;

// Sequelize setup
let sequelize;
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306,
    }
  );
}

// Export connections
module.exports = {
  mongooseConnection,
  sequelize,
};
