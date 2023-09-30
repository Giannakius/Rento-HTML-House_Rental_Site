
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { cookieJwtAuth, cookieJwtAuthCheck } = require("../middleware/cookieJwtAuth");
const ReviewsSchemaUser = new Schema({
    reviewer: { type: String },
    reviewed: { type: String },
    rating: { type: Number },
    reviews: { type: String },
});
const ReviewsSchemaRent = new Schema({
    reviewer: { type: String },
    reviewed: { type: String },
    rating: { type: Number },
    reviews: { type: String },
});
const ReviewsUser = mongoose.model('ReviewsUser', ReviewsSchemaUser);
const ReviewsRent = mongoose.model('ReviewsRent', ReviewsSchemaRent);
const { client } = require("../server");

const attachRoutes = (app) => {
    app.post('/adduserreview', cookieJwtAuth, async (req, res) => {
        try {
            // Connect to the MongoDB cluster
            await client.connect();

            // Get a reference to the users collection
            const usersCollection = client.db('test').collection('ReviewsUser');


          
            // Create a new user instance
            let user = new ReviewsRent({
                reviewer: "Anonymous User",
                reviewed: req.body.reviewed,
                rating: req.body.rating,
                reviews: req.body.reviews,
            });

            if (req.user != null) {
                user = new ReviewsRent({
                    reviewer: req.user,
                    reviewed: req.body.reviewed,
                    rating: req.body.rating,
                    reviews: req.body.reviews,
                });
            }

            // Insert the new user document into the users collection
            const result = await usersCollection.insertOne(user);
            res.status(200).send('Review Uploaded');
            //res.status(201).json({ id: result.insertedId });


        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        } finally {
            // Close the connection to the MongoDB cluster
            await client.close();
        }
    });

    app.post('/addrentreview', cookieJwtAuth, async (req, res) => {
        try {

            // Connect to the MongoDB cluster
            await client.connect();

            // Get a reference to the users collection
            const usersCollection = client.db('test').collection('ReviewsRent');

            // Create a new user instance
            let rent = new ReviewsRent({
                reviewer: "Anonymous User",
                reviewed: req.body.reviewed,
                rating: req.body.rating,
                reviews: req.body.reviews,
            });

            if (req.user != null) {
                rent = new ReviewsRent({
                    reviewer: req.user,
                    reviewed: req.body.reviewed,
                    rating: req.body.rating,
                    reviews: req.body.reviews,
                });
            }

            // Insert the new user document into the users collection
            const result = await usersCollection.insertOne(rent);
            res.status(200).send('Review Uploaded');
            //res.status(201).json({ id: result.insertedId });


        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        } finally {
            // Close the connection to the MongoDB cluster
            await client.close();
        }
    });



    app.get('/getuserreview/:userid', async (req, res) => {
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            // Get a reference to the users collection
            const ReviewsCollection = client.db('test').collection('ReviewsUser');

            // Find the reviews
            const users = await ReviewsCollection.find({ reviewed: req.params.userid }, { projection: { reviewer: 0, reviewed: 0, reviews: 0 } }).toArray();
            const totalRatings = users.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRatings / users.length;
            res.status(200).json([averageRating, users.length]);

        } catch (error) {
            console.error(error);
            res.status(404).send('Access Denied');
        } finally {
            // Close the connection to the MongoDB cluster
            await client.close();
        }
    });

    app.get('/getrentreview/:rentid', async (req, res) => {
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            // Get a reference to the users collection
            const ReviewsCollection = client.db('test').collection('ReviewsRent');
    
            // Find the reviews
            const rents = await ReviewsCollection.find({ reviewed: req.params.rentid }, { projection: { reviewer: 0, reviewed: 0, reviews: 0 } }).toArray();
            const totalRatings = rents.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRatings / rents.length;
            res.status(200).json({ "averageRating": averageRating });

    
        } catch (error) {
            console.error(error);
            res.status(404).send('Access Denied');
        } finally {
            // Close the connection to the MongoDB cluster
            await client.close();
        }
    });
    


    app.get('/getrentreviewdata/:rentid', async (req, res) => {
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            // Get a reference to the collections
            const ReviewsCollection = client.db('test').collection('ReviewsRent');
            const UserCollection = client.db('test').collection('users');

            // Find the reviews
            const rents = await ReviewsCollection.find({ reviewed: req.params.rentid }).toArray();

            // Get the reviewer IDs from the reviews
            const reviewerIds = rents.map(review => review.reviewer);

            // Fetch user data for reviewers
            const reviewersData = await UserCollection.find({ username: { $in: reviewerIds } }).toArray();

            // Combine review data with user data
            const combinedData = rents.map(review => {
                const reviewerData = reviewersData.find(user => user.username === review.reviewer);
                return {
                    reviewer: review.reviewer,
                    reviewed: review.reviewed,
                    rating: review.rating,
                    reviews: review.reviews,
                    reviewerphoto: reviewerData.image,
                    reviewerflname: reviewerData.firstName + " " + reviewerData.lastName,

                };
            });

            res.status(200).json(combinedData);

        } catch (error) {
            console.error(error);
            res.status(404).send('Access Denied');
        } finally {
            // Close the connection to the MongoDB cluster
            await client.close();
        }
    });

    app.get('/getuserreviewdata/:userid', async (req, res) => {
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            // Get a reference to the collections
            const ReviewsCollection = client.db('test').collection('ReviewsUser');
            const UserCollection = client.db('test').collection('users');

            // Find the reviews
            const rents = await ReviewsCollection.find({ reviewed: req.params.userid }).toArray();

            // Get the reviewer IDs from the reviews
            const reviewerIds = rents.map(review => review.reviewer);

            // Fetch user data for reviewers
            const reviewersData = await UserCollection.find({ username: { $in: reviewerIds } }).toArray();

            // Combine review data with user data
            const combinedData = rents.map(review => {
                const reviewerData = reviewersData.find(user => user.username === review.reviewer);
                return {
                    reviewer: review.reviewer,
                    reviewed: review.reviewed,
                    rating: review.rating,
                    reviews: review.reviews,
                    reviewerphoto: reviewerData.image,
                    reviewerflname: reviewerData.firstName + " " + reviewerData.lastName,

                };
            });

            res.status(200).json(combinedData);

        } catch (error) {
            console.error(error);
            res.status(404).send('Access Denied');
        } finally {
            // Close the connection to the MongoDB cluster
            await client.close();
        }
    });

    app.get('/getuserreviews/:userid', async (req, res) => {
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            // Get a reference to the users collection
            const ReviewsCollection = client.db('test').collection('ReviewsUser');

            // Find the reviews
            const users = await ReviewsCollection.findOne({ reviewed: req.params.userid }).toArray();

            if (users.length > 0) {
                // Send the rent data
                res.status(200).json(users);
            } else {
                res.status(200).json([]);
            }


        } catch (error) {
            console.error(error);
            res.status(404).send('Access Denied');
        } finally {
            // Close the connection to the MongoDB cluster
            await client.close();
        }
    });



    app.get('/getrentreviews/:rentid', async (req, res) => {
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            // Get a reference to the users collection
            const ReviewsCollection = client.db('test').collection('ReviewsRent');

            // Find the reviews
            const rents = await ReviewsCollection.findOne({ reviewed: req.params.rentid }).toArray();

            if (rents.length > 0) {
                // Send the rent data
                res.status(200).json(rents);
            } else {
                res.status(200).json([]);
            }


        } catch (error) {
            console.error(error);
            res.status(404).send('Access Denied');
        } finally {
            // Close the connection to the MongoDB cluster
            await client.close();
        }
    });

}

module.exports = {
    attachRoutes: attachRoutes
};

