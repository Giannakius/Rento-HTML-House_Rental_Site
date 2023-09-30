const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const { MongoClient } = require("mongodb"); // Import MongoClient from the 'mongodb' package
const LoggingSchema = new Schema({
    user: { type: String },
    visited: { type: String },
});

const Logging = mongoose.model('Logging', LoggingSchema);

const attachRoutes = (app) => {
  app.post('/addlog', cookieJwtAuth, async (req, res) => {
    let sclient; // Declare the client variable outside of the try-catch block

    try {
      // Connect to the MongoDB cluster
      sclient = new MongoClient("mongodb://127.0.0.1:27017/", { useNewUrlParser: true, useUnifiedTopology: true });
      await sclient.connect();

      // Get a reference to the users collection
      const usersCollection = sclient.db('test').collection('logging');

      // Create a new user instance
      let Log = new Logging({
        user: req.user,
        visited: req.body.visited,
      });

      // Insert the new user document into the users collection
      await usersCollection.insertOne(Log);

      res.status(200).send("Log added successfully");
    } catch (error) {
      console.error("Error adding log:", error);
      res.status(500).send("Internal Server Error");
    } finally {
      if (sclient) {
        // Close the connection to the MongoDB cluster
        await sclient.close();
      }
    }
  });
};

module.exports = {
  attachRoutes: attachRoutes
};
