const mongoose = require('mongoose');
const { ObjectId } = require('mongodb'); // Import ObjectId
const { client } = require("../server");

const reservationSchema = new mongoose.Schema({
    renting_id: String, // Change to 'rent_id'
    user_id: String,
    date: Date,
    available: String,
    price: Number,
});

const Reservation = mongoose.model('reservation', reservationSchema);

const attachRoutes = (app) => {
    app.get('/getavailability', async (req, res) => {
        try {
            await client.connect();
            const { rent_id, checkin, checkout } = req.query;


            const ReservationCollection = client.db('test').collection('reservations');
            console.log(rent_id);
            console.log(checkin);
            console.log(checkout);
            const reservations = await ReservationCollection.find({
                renting_id: rent_id,
                date: {
                    $gte: new Date(checkin),
                    $lte: new Date(checkout),
                },
            }).toArray();

            // Check if all reservations are available and if checkin and checkout dates are in reservations
            const isAvailable = reservations.every((reservation) => reservation.available === "true");
            const checkinExists = reservations.some((reservation) => reservation.date.getTime() === new Date(checkin).getTime());
            const checkoutExists = reservations.some((reservation) => reservation.date.getTime() === new Date(checkout).getTime());

            const isFullyAvailable = isAvailable && checkinExists && checkoutExists;
            console.log(reservations);
            console.log(isFullyAvailable);
            res.status(200).json({ available: isFullyAvailable });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        } finally {
            await client.close();
        }
    });

    app.get('/changeavailability', async (req, res) => {
        try {
            await client.connect();
            const { rent_id, checkin, checkout, tuser_id, tprice } = req.query;
            const ReservationCollection = client.db('test').collection('reservations');

            // Convert checkin and checkout to Date objects
            const checkinDate = new Date(checkin);
            const checkoutDate = new Date(checkout);

            // Update reservations with available: "false" for the specified range
            const filter = {
                renting_id: rent_id,
                date: { $gte: checkinDate, $lte: checkoutDate }
            };

            const update = {
                $set: { available: "false", user_id: tuser_id, price: tprice }
            };

            const result = await ReservationCollection.updateMany(filter, update);

            console.log(`Updated ${result.modifiedCount} reservations.`);
            res.status(200).json({ available: true });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: error.message });
        } finally {
            await client.close();
        }
    });

};

module.exports = {
    attachRoutes: attachRoutes
};
