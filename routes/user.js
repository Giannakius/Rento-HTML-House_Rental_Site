const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { cookieJwtAuth, cookieJwtAuthCheck } = require("../middleware/cookieJwtAuth");
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String },
  roles: { type: String },
  image: { type: String },
  approved: { type: String },
  rating: { type: String },
  reviews: { type: String },
  rentcount: { type: String },
});
const User = mongoose.model('User', userSchema);
//module.exports = mongoose.model('User', userSchema);
const { uploadf, path } = require("./file");
const { client } = require("../server");



const { transporter } = require("../email/email");
const crypto = require('crypto');

function generateRandomPassword(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const passwordArray = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(characters.length);
    passwordArray.push(characters.charAt(randomIndex));
  }

  return passwordArray.join('');
}






const attachRoutes = (app) => {
  // Define route to handle user creation
  app.post('/adduser', uploadf.single('image'), async (req, res) => {
    try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Get a reference to the users collection
      const usersCollection = client.db('test').collection('users');


      const user_check = await usersCollection.findOne({ username: req.body.username });
      if (user_check == null) {
        let aapproved = "no"; // Initialize the variable

        if (req.body.roles === "host" ||req.body.roles === "tenanthost" ) {
          aapproved = "no";
        } else {
          aapproved = "yes";
        }
        // console.log(req.body.image);
        // Create a new user instance
        const user = new User({
          username: req.body.username,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          gender: req.body.gender,
          roles: req.body.roles,
          approved: aapproved,
          rating: "0",
          reviews: "0",
          image: req.body.image[0],
        });

        // Insert the new user document into the users collection
        const result = await usersCollection.insertOne(user);
        console.log(`New user created with the following id: ${result.insertedId}`);
        // Return a 201 Created status code and the new user's id
        // console.log(req.body.roles);
        if (req.body.roles === "host" ||req.body.roles === "tenanthost") {
          res.status(200).send('Your application is been reviewed! Thanks for your application!');
        } else {
          res.status(200).send('User created successfully');
        }
        //res.status(201).json({ id: result.insertedId });
      } else {
        res.status(200).send('User with this username already exists');
      }



    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
    }
  });


  // Change Phofile Image for user
  app.post('/changeprofileimage', cookieJwtAuth, uploadf.single('image'), async (req, res) => {
    try {
      // Connect to MongoDB
      await client.connect();
      // Get a reference to the users collection
      const usersCollection = client.db('test').collection('users');

      // Update the user document in the database
      const result = await usersCollection.updateOne(
        { username: req.user },
        {
          $set: {
            image: req.body.image,
          }
        }
      );

      if (result.modifiedCount === 1) {
        res.status(200).send('Profile Image updated successfully');
      } else {
        res.status(404).send('User not found');
      }

      client.close();
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });

  // Define route to handle retrieving user data
  app.get('/getuser', cookieJwtAuth, async (req, res) => {
    try {
      // Connect to the MongoDB cluster
      await client.connect();
      // Get a reference to the users collection
      const usersCollection = client.db('test').collection('users');

      // Find the user by username
      const user = await usersCollection.findOne({ username: req.user });

      if (user) {
        // Send the user data as a response
        delete user.password;
        res.status(200).json(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
    }
  });

  app.get('/getuserpublic/:userid', async (req, res) => {
    try {
      // Connect to the MongoDB cluster
      await client.connect();
      // Get a reference to the users collection
      const usersCollection = client.db('test').collection('users');
      const rentCollection = client.db('test').collection('rent');

      // Find the user by username
      const user = await usersCollection.findOne({ username: req.params.userid });
      // Find the rents that specific user has
      const rents = await rentCollection.find({ owner_id: req.params.userid }).toArray();

      if (user) {
        // Send the user data as a response
        delete user.password;
        delete user.approved;
        user.rentcount = rents.length;
        res.status(200).json(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
    }
  });


  app.get('/getuserpubliccookie',cookieJwtAuth, async (req, res) => {
    try {
      // Connect to the MongoDB cluster
      await client.connect();
      console.log(req.user);
      // Get a reference to the users collection
      const usersCollection = client.db('test').collection('users');
      const rentCollection = client.db('test').collection('rent');

      // Find the user by username
      const user = await usersCollection.findOne({ username: req.user });
      let rents ="";
      let t_rent_count = 0;
        // Send the user data as a response
        if(user){
        
       rents = await rentCollection.find({ owner_id: req.user }).toArray(); 
       t_rent_count = rents.length;
        } 
       
        res.status(200).json({username: req.user, rentcount: t_rent_count});
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
    }
  });


  app.post('/updateuser', cookieJwtAuth, async (req, res) => {
    try {
      const { firstName, lastName, email, phone } = req.body;

      // Connect to MongoDB
      await client.connect();
      // Get a reference to the users collection
      const usersCollection = client.db('test').collection('users');

      // Update the user document in the database
      const result = await usersCollection.updateOne(
        { username: req.user },
        {
          $set: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone
          }
        }
      );

      if (result.modifiedCount === 1) {
        res.status(200).send('User updated successfully');
      } else {
        res.status(404).send('User not found');
      }

      client.close();
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });

  //change user pass
  app.post('/changepassword', cookieJwtAuth, async (req, res) => {

    const { oldpassword, newpassword, newnewpassword } = req.body;
    try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Get a reference to the users collection
      const usersCollection = client.db('test').collection('users');

      // Find the user by username
      const user2 = await usersCollection.findOne({ username: req.user });
      // console.log(req.body.oldpassword);
      if (user2.password == oldpassword) {
        if (newpassword == newnewpassword) {
          // change password


          const result = await usersCollection.updateOne(
            { username: req.user },
            {
              $set: {
                password: newpassword,
              }
            }
          );

          if (result.modifiedCount === 1) {
            res.status(200).send('User updated successfully');
          } else {
            res.status(404).send('User not found');
          }
        } else {
          res.status(404).send('New password do not match !');
        }
      } else {
        res.status(404).send('Old Password is wrong');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
    }
  });

  //get ids that are not proved
  app.get('/getunapprovedusers', cookieJwtAuth, async (req, res) => {
    try {
      // Connect to the MongoDB cluster
      await client.connect();
      // Get a reference to the users collection
      const usersCollection = client.db('test').collection('users');
      // Find the user by username
      const user2 = await usersCollection.findOne({ username: req.user });
      if (user2.roles == "admin") {
        // Find the unapproved users and exclude password, username, and gender from the result
        const unapprovedUsers = await usersCollection.find({ approved: "no" }, { projection: { password: 0, gender: 0, approved: 0, reviews: 0, rating: 0 } }).toArray();

        if (unapprovedUsers.length > 0) {
          // Send the user data as a response
          res.status(200).json(unapprovedUsers);
        } else {
          res.status(200).json([]);
        }
      } else {
        res.status(404).send('Access Denied');
      }
    } catch (error) {
      console.error(error);
      res.status(404).send('Access Denied');
    } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
    }
  });


  //change user to approved only by admin
  app.post('/approveuser/:userid', cookieJwtAuth, async (req, res) => {

    try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Get a reference to the users collection
      const usersCollection = client.db('test').collection('users');

      // Find the user by username
      const user2 = await usersCollection.findOne({ username: req.user });
      if (user2.roles == "admin") {
        const result = await usersCollection.updateOne(
          { username: req.params.userid },
          {
            $set: {
              approved: "yes",
            }
          }
        );

        if (result.modifiedCount === 1) {
          res.status(200).send('User approved successfully');
        } else {
          res.status(404).send('User not found');
        }
      } else {
        res.status(404).send('Access Denied');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
    }
  });

  app.post('/forgotpassword', async (req, res) => {
    try {
      const email = req.body.email;
      // Connect to MongoDB
      await client.connect();
      // Get a reference to the users collection
      const usersCollection = client.db('test').collection('users');
      // console.log('pas reset for user ' + email + " requested");
      const password = generateRandomPassword(10);
      // Update the user document in the database
      const result = await usersCollection.updateOne(
        { email: email },
        {
          $set: {
            password: password
          }
        }
      );

      if (result.modifiedCount === 1) {
        const mailOptions = {
          from: 'Rento Company <rento@panosgio.org>',
          to: email,
          subject: 'Password Changed',
          text: 'This is your new password : ' + password,
        };
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error occurred while sending email:', error.message);
          } else {
            console.log('Email sent successfully!');
            console.log('Message ID:', info.messageId);
          }
        });


        res.status(200).send('Password changed. Please check your email!');
      } else {
        res.status(404).send('User not found');
      }

      client.close();
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });

  // contact us
  app.get('/contactuser', async (req, res) => {
    try {
      const { first_name, last_name, email_from, email_to, phone, message, subject } = req.query;
      // Connect to MongoDB
      await client.connect();
      // console.log(first_name, last_name, email_from, email_to, phone, message, subject);
      const mailOptions = {
        from: 'Rento Company <rento@panosgio.org>',
        to: email_to,
        subject: 'You have new message from user : ' + first_name + " " + last_name,
        text: "First name : " + first_name + "\n" +
          "Last name : " + last_name + "\n" +
          "E-mail : " + email_from + "\n" +
          "Phone : " + phone + "\n" +
          "Subject : " + subject + "\n" +
          "Message : " + message,
      };
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error occurred while sending email:', error.message);
        } else {
          console.log('Message ID:', info.messageId);
        }
      });
      res.status(200).send('E-mail Sent!');

      client.close();
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });

  app.get('/getallusers', cookieJwtAuth, async (req, res) => {
    try {
      // Connect to the MongoDB cluster
      await client.connect();
      // Get a reference to the users collection
      const usersCollection = client.db('test').collection('users');
      // Find the user by username
      const user2 = await usersCollection.findOne({ username: req.user });
      if (user2.roles == "admin") {
        // Find the unapproved users and exclude password, username, and gender from the result
        const allusers = await usersCollection.find({}, { projection: { password: 0, gender: 0, approved: 0, reviews: 0, rating: 0 } }).toArray();

        if (allusers.length > 0) {
          // Send the user data as a response
          res.status(200).json(allusers);
        } else {
          res.status(200).json([]);
        }
      } else {
        res.status(404).send('Access Denied');
      }
    } catch (error) {
      console.error(error);
      res.status(404).send('Access Denied');
    } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
    }
  });

  //contact form
  app.post('/contactformpost', async (req, res) => {
    try {
      const email = req.body.email;
      // Connect to MongoDB
      await client.connect();
      // Get a reference to the users collection
      const usersCollection = client.db('test').collection('users');
      console.log('pas reset for user ' + email + " requested");
      const password = generateRandomPassword(10);
      // Update the user document in the database
      const result = await usersCollection.updateOne(
        { email: email },
        {
          $set: {
            password: password
          }
        }
      );

      if (result.modifiedCount === 1) {
        const mailOptions = {
          from: 'Rento Company <rento@panosgio.org>',
          to: email,
          subject: 'Password Changed',
          text: 'This is your new password : ' + password,
        };
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error occurred while sending email:', error.message);
          } else {
            console.log('Email sent successfully!');
            console.log('Message ID:', info.messageId);
          }
        });


        res.status(200).send('Password changed. Please check your email!');
      } else {
        res.status(404).send('User not found');
      }

      client.close();
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });


}

module.exports = {
  attachRoutes: attachRoutes
};

