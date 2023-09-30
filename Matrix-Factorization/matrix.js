// Import the file with the Matrix-Factorization Code
const {
    buildCompletedMatrix,
    factorizeMatrix
} = require('./matrix-factorization')

const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { cookieJwtAuth, cookieJwtAuthCheck } = require("../middleware/cookieJwtAuth");

const { client } = require("../server");

const attachRoutes = (app) => {


    app.get('/getmatrix/:userid', async (req, res) => {
        try {
            const userid = req.params.userid;

            // Connect to the MongoDB cluster
            await client.connect();

            // Get a reference to the collections
            const ReviewsCollection = client.db('test').collection('ReviewsRent');
            const HousesCollection = client.db('test').collection('rent');
            const UsersCollection = client.db('test').collection('users');

            // Fetch all houses and users
            const houses = await HousesCollection.find().toArray();
            const users = await UsersCollection.find().toArray();

            // Create maps to store house and user data
            const houseData = new Map();
            const userData = new Map();

            // Populate houseData map with house information
            for (const house of houses) {
                houseData.set(house._id.toString(), house);
            }

            // Populate userData map with user information
            for (const user of users) {
                userData.set(user.username.toString(), user);
            }

            // Fetch all ratings
            const ratings = await ReviewsCollection.find().toArray();

            const numRows = users.length;
            const numCols = houses.length;
            const RatingsArray = Array(numRows).fill(0).map(() => Array(numCols).fill(0));

            let SearchUserArrayIndex = -1;

            for (const user of users) {
                for (const house of houses) {
                    for (const rating of ratings) {
                        if (rating.reviewer === user.username && rating.reviewed === house._id.toString()) {
                            const userIndex = users.indexOf(user);
                            const houseIndex = houses.indexOf(house);
                            RatingsArray[userIndex][houseIndex] = rating.rating;

                            if (user.username === userid) {
                                SearchUserArrayIndex = userIndex;
                                // console.log(userid + " " + house._id.toString() + " " + rating.rating);
                            }
                        }
                    }
                }
            }

            const LATENT_FEATURE_COUNT = 2;
            const COMPLETED_MATRIX = buildCompletedMatrix(factorizeMatrix(RatingsArray, LATENT_FEATURE_COUNT));

            const Output = COMPLETED_MATRIX[SearchUserArrayIndex];

            const houseFeatures = houses.map(house => {
                const houseInfo = houseData.get(house._id.toString());
                return {
                    _id: house._id.toString(),
                    // Προσθέστε όλα τα χαρακτηριστικά του σπιτιού που χρειάζεστε εδώ
                    name: houseInfo.housename,
                    description: houseInfo.housetext,
                    owner_id: houseInfo.owner_id,
                    housetext: houseInfo.housetext,
                    housename: houseInfo.housename,
                    beds: houseInfo.beds,
                    bathrooms: houseInfo.bathrooms,
                    rented_space_type: houseInfo.rented_space_type,
                    bedrooms: houseInfo.bedrooms,
                    area_space: houseInfo.area_space,
                    livingroom: houseInfo.livingroom,
                    smoking: houseInfo.smoking,
                    pets: houseInfo.pets,
                    parties: houseInfo.parties,
                    mindaysrent: houseInfo.mindaysrent,
                    address: houseInfo.address,
                    postcode: houseInfo.postcode,
                    country: houseInfo.country,
                    city: houseInfo.city,
                    wifi: houseInfo.wifi,
                    aircondition: houseInfo.aircondition,
                    heat: houseInfo.heat,
                    kitchen: houseInfo.kitchen,
                    tv: houseInfo.tv,
                    parking: houseInfo.parking,
                    hotwater: houseInfo.hotwater,
                    elevator: houseInfo.elevator,
                    reviews: houseInfo.reviews,
                    rating: houseInfo.rating,
                    image: houseInfo.image,
                    price: houseInfo.price,
                    housetype: houseInfo.housetype,


                    // Προσθέστε τα υπόλοιπα χαρακτηριστικά
                    rating: Output[houses.indexOf(house)]
                };
            });

            houseFeatures.sort((a, b) => b.rating - a.rating);
            const top5 = houseFeatures.slice(0, 5);

            res.status(200).json(top5);
        } catch (error) {
            console.error(error);
            res.status(404).send('Access Denied');
        } finally {
            await client.close();
        }
    });





    app.get('/getuservector/:userid', async (req, res) => {
        try {
            const userid = req.params.userid; // Αποκτήστε την τιμή του userid από το URL

            // Connect to the MongoDB cluster
            await client.connect();
            // Get a reference to the users collection
            const LoggingCollection = client.db('test').collection('logging');
            const HousesCollection = client.db('test').collection('rent');

            // Βρείτε τα IDS σπίτιων που έχει επισκεφθεί ο συγκεκριμένος χρήστης ΧΩΡΙΣ ΔΙΠΛΩΤΥΠΑ
            const visitedHouses = await LoggingCollection.find({ user: userid }).toArray();
            const visitedHouseIdsSet = new Set(visitedHouses.map(visit => visit.visited));
            const visitedHouseIds = Array.from(visitedHouseIdsSet);


            const housesWithDetails = [];

            // Βρείτε τα σπίτια με βάση τα IDs που υπάρχουν στον visitedHouseIds
            const housesCursor = HousesCollection.find({ _id: { $in: visitedHouseIds.map(id => new ObjectId(id)) } });

            // Χρησιμοποιήστε ένα loop για να πάρετε κάθε σπίτι από τον cursor
            await housesCursor.forEach(house => {
                housesWithDetails.push(house);
            });


            // Τώρα ο πίνακας housesWithDetails περιέχει όλα τα σπίτια με όλα τα χαρακτηριστικά τους 
            // για τα σπιτια που εχει επισκεφτει ο χρηστης .
            // console.log(housesWithDetails);






            // // Δημιουργήστε ένα αρχικό διάνυσμα για τον χρήστη
            const userVector = {
                beds: 0,
                bathrooms: 0,
                bedrooms: 0,
                area_space: 0,
                smoking: 0,
                parties: 0,
                pets: 0,
                wifi: 0,
                aircondition: 0,
                heat: 0,
                kitchen: 0,
                tv: 0,
                elevator: 0,
                hotwater: 0,
                parking: 0,
                price: 0

            };


            // Υπολογίστε το aθροισμα των χαρακτηριστικών των προτιμησεων του χρηστη userid
            for (const house of housesWithDetails) {

                // const objectId = new ObjectId(houseId);


                // const house = await HousesCollection.findOne({ _id: objectId });

                if (house) {

                    // Ηταν σε μορφη string και οχι int
                    userVector.beds += parseInt(house.beds);
                    userVector.bathrooms += parseInt(house.bathrooms);
                    userVector.bedrooms += parseInt(house.bedrooms);
                    userVector.area_space += parseInt(house.area_space);
                    userVector.price += parseInt(house.price);


                    userVector.smoking += house.smoking;
                    userVector.parties += house.parties;
                    userVector.pets += house.pets;
                    userVector.wifi += house.wifi;
                    userVector.aircondition += house.aircondition;
                    userVector.heat += house.heat;
                    userVector.kitchen += house.kitchen;
                    userVector.tv += house.tv;
                    userVector.elevator += house.elevator;
                    userVector.hotwater += house.hotwater;
                    userVector.parking += house.parking;


                }
            }


            // Υπολογίστε τον μέσο όρο των χαρακτηριστικών των προτιμησεων του χρηστη userid
            const numVisitedHouses = visitedHouseIds.length;
            if (numVisitedHouses > 0) {
                userVector.beds /= numVisitedHouses;
                userVector.bathrooms /= numVisitedHouses;
                userVector.bedrooms /= numVisitedHouses;
                userVector.area_space /= numVisitedHouses;
                userVector.smoking /= numVisitedHouses;
                userVector.parties /= numVisitedHouses;
                userVector.pets /= numVisitedHouses;
                userVector.wifi /= numVisitedHouses;
                userVector.aircondition /= numVisitedHouses;
                userVector.heat /= numVisitedHouses;
                userVector.kitchen /= numVisitedHouses;
                userVector.tv /= numVisitedHouses;
                userVector.elevator /= numVisitedHouses;
                userVector.hotwater /= numVisitedHouses;
                userVector.parking /= numVisitedHouses;
                userVector.price /= numVisitedHouses;

            }


            // Βρες τα 5 πλησιεστερα σπιτια στα χαρακτηριστικα στις προτημησεις του χρηστη

            // Ανακτήστε όλα τα σπίτια από τη συλλογή "rent"
            // const houses = await HousesCollection.find().toArray();


            const top5Houses = [];


            // // Μετατρέψτε τις τιμές της visitedHouseIds σε ObjectIds
            // const visitedHouseObjectIds = visitedHouseIds.map(id => new ObjectId(id));

            // // Χρησιμοποιήστε το $in για να βρείτε τα σπίτια με αντίστοιχα _id
            // const temphousedetails = await HousesCollection.find({ _id: { $in: visitedHouseObjectIds } }).toArray();



            // Περπατήστε μέσα από όλα τα σπίτια
            for (const temphousedetails of housesWithDetails) {
                // Κάντε τη σύγκριση των προτιμήσεων του χρήστη με τις προτιμήσεις του κάθε σπιτιού

                const similarity = calculateSimilarity(userVector, temphousedetails);

                // Προσθέστε το σπίτι και την ομοιότητα στη λίστα
                top5Houses.push([temphousedetails, similarity]);
            }

            // Ταξινομήστε τη λίστα των σπιτιών βάσει της ομοιότητας σε φθίνουσα σειρά
            top5Houses.sort((a, b) => b.similarity - a.similarity);
            
            // Επιλέξτε τα πρώτα 5 σπίτια
            const top5 = top5Houses.slice(0, 5);
           ///////// console.log(temphousedetails);

            // Η συνάρτηση για τον υπολογισμό της ομοιότητας μεταξύ του χρήστη και ενός σπιτιού
            function calculateSimilarity(userVector, house) {

                // Ορίστε τα βάρη για κάθε χαρακτηριστικό
                const weights = {
                    price: 1.3,     // 30% επιπλέον βάρος
                    beds: 1.15,     // 15% επιπλέον βάρος
                    bathrooms: 1.15, // 15% επιπλέον βάρος
                    bedrooms: 1.15,  // 15% επιπλέον βάρος

                    // Υπόλοιπα χαρακτηριστικά με βάρος 1.0
                    Acreage_Space: 1.0,
                    Smoking_Allowed: 1.0,
                    Parties_Allowed: 1.0,
                    Pets_Allowed: 1.0,
                    Wifi: 1.0,
                    Aircondition: 1.0,
                    Heat: 1.0,
                    Kitchen: 1.0,
                    Tv: 1.0,
                    Elevator: 1.0,
                    Hot_Water: 1.0,
                    Parking: 1.0,
                };

                // Υπολογίστε το εσωτερικό γινόμενο με βάση τα βάρη
                let dotProduct = 0;
                let userVectorMagnitude = 0;
                let houseMagnitude = 0;

                for (const key in userVector) {
                    if (key in weights) {
                        dotProduct += userVector[key] * house[key] * weights[key];
                        userVectorMagnitude += Math.pow(userVector[key] * weights[key], 2);
                        houseMagnitude += Math.pow(house[key] * weights[key], 2);
                    } else {
                        // Χρησιμοποιήστε το προεπιλεγμένο βάρος 1.0 για τα υπόλοιπα χαρακτηριστικά
                        dotProduct += userVector[key] * house[key];
                        userVectorMagnitude += Math.pow(userVector[key], 2);
                        houseMagnitude += Math.pow(house[key], 2);
                    }
                }

                userVectorMagnitude = Math.sqrt(userVectorMagnitude);
                houseMagnitude = Math.sqrt(houseMagnitude);

                // Υπολογίστε την ομοιότητα με βάση τον αλγόριθμο Cosine Similarity
                if (userVectorMagnitude === 0 || houseMagnitude === 0) {
                    return 0; // Αν οποιοδήποτε από τα δύο διανύσματα είναι το μηδέν, η ομοιότητα είναι μηδέν
                } else {
                    return dotProduct / (userVectorMagnitude * houseMagnitude);
                }
            }


            // res.status(200).json(userVector);
            res.status(200).json(top5.map(item => item[0]));


        } catch (error) {
            console.error(error);
            res.status(404).send('Access Denied');
        } finally {
            // Close the connection to the MongoDB cluster
            await client.close();
        }
    });




    const axios = require('axios');
    const https = require('https'); // Εισαγωγή του πακέτου https


    app.get('/getRecommendedHouses',cookieJwtAuth, async (req, res) => {
        try {
            const userid = req.user;
             console.log('userid = ' + userid);
            // Connect to the MongoDB cluster
            await client.connect();

            // Get a reference to the collections
            const ReviewsCollection = client.db('test').collection('ReviewsRent');

            // Check if the user has reviewed any houses
            const hasUserReviewedHouses = await ReviewsCollection.findOne({ reviewer: userid });

            let recommendedHouses = [];

            if (hasUserReviewedHouses) {
                // The user has reviewed houses, call the getmatrix function
                const matrixResponse = await axios.get(`https://rento.panosgio.org:4000/getmatrix/${userid}`, {
                    httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Χρησιμοποιεί τον πράκτορα HTTPS
                });
                recommendedHouses = matrixResponse.data; // Use the response from getmatrix
            } else {
                // The user has not reviewed any houses, call the getuservector function
                const userVectorResponse = await axios.get(`https://rento.panosgio.org:4000/getuservector/${userid}`, {
                    httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Χρησιμοποιεί τον πράκτορα HTTPS
                });
                recommendedHouses = userVectorResponse.data; // Use the response from getuservector
            }
            // console.log(recommendedHouses);
          
            res.status(200).json(recommendedHouses);

        } catch (error) {
            console.error(error);
            res.status(404).send('Access Denied');
        } finally {
            await client.close();
        }
    });



    async function callAlgorithm(url) {
        try {
            // Call the algorithm with the given URL using the axios library
            const response = await axios.get(url);

            if (response.status === 200) {
                // Return the results from the algorithm
                return response.data;
            } else {
                console.error(`Error: ${response.status} - ${response.statusText}`);
                return []; // Return an empty array in case of an error
            }
        } catch (error) {
            console.error('An error occurred:', error);
            return []; // Return an empty array in case of an error
        }
    }



}

module.exports = {
    attachRoutes: attachRoutes
};

