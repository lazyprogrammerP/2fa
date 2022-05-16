// Connect to DB
const mongoose = require("mongoose");

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(process.env.MONGODB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("DB Connection Successful");
      })
      .catch(() => {
        console.log("DB Connection Error");
      });
  }
}

module.exports = new Database();
