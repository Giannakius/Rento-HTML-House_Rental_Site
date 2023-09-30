//// Database
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017/?retryWrites=true&w=majority";
//const uri = "mongodb://localhost:27017/rento";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
console.log('start');
const fs = require('fs');
const https = require('https');
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};
const express = require('express');
const app = express();
const cors = require('cors');
let alert = require('alert');
module.exports = {
  client: client,
  app: app
};
































// Enable all CORS requests
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const setupUserRoute = require("./routes/user");
setupUserRoute.attachRoutes(app);
const setupRentRoute = require("./routes/rent");
setupRentRoute.attachRoutes(app);
const setupLoginRoute = require("./routes/login");
setupLoginRoute.attachRoutes(app);
const setupReviewRoute = require("./routes/reviews");
setupReviewRoute.attachRoutes(app);
const setupReservationRoute = require("./routes/reservations");
setupReservationRoute.attachRoutes(app);
const setuploggingRoute = require("./routes/logging");
setuploggingRoute.attachRoutes(app);
const setupMatrixRoute = require("./Matrix-Factorization/matrix");
setupMatrixRoute.attachRoutes(app);
const {uploadf,path, attachRoutes} = require("./routes/file");
attachRoutes(app);



app.use(express.static('public', {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));


app.use(express.static(path.join(__dirname, "FINAL/rento")));
app.get('/', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/index.html'));
});
// Define a route to handle the page load
app.get('/account', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/Account Settings/index.html'));
});
app.use(express.static(path.join(__dirname, "FINAL/rento/Pages/Dashboard")));
app.get('/dashboard', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/Dashboard/dashboard.html'));
});
app.get('/approveusers', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/Dashboard/checkusers.html'));
});
app.get('/allusers', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/Dashboard/allusers.html'));
});
app.use(express.static(path.join(__dirname, "FINAL/rento/Pages/Contact Us")));
app.get('/contactus', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/Contact Us/contactus.html'));
});
app.use(express.static(path.join(__dirname, "FINAL/rento/Pages/Login")));
app.get('/login', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/Login/login.html'));
});
app.get('/register', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/Login/register.html'));
});
app.get('/password', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/Login/password.html'));
});
app.use(express.static(path.join(__dirname, "FINAL/rento/Pages/SearchNew")));
app.get('/housesearch', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/SearchNew/index.html'));
});
app.use(express.static(path.join(__dirname, "FINAL/rento/Pages/HouseUpload")));
app.get('/houseadd_next', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/HouseUpload/index.html'));
});
app.get('/houseadd', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/Dashboard/addnewhouse.html'));
});
app.use(express.static(path.join(__dirname, "FINAL/rento/Pages/HouseEdit")));
app.get('/houseedit', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/HouseEdit/index.html'));
});
app.use(express.static(path.join(__dirname, "FINAL/rento/Pages/HouseDetails")));
app.get('/house', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/HouseDetails/house.html'));
});
app.use(express.static(path.join(__dirname, "FINAL/rento/Pages/UserDetails")));
app.get('/user', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/UserDetails/userdetails.html'));
});
app.get('/reviewowner', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/UserDetails/review.html'));
});
app.use(express.static(path.join(__dirname, "FINAL/rento/Pages/MyListings")));
app.get('/mylistings', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/MyListings/index.html'));
});
app.get('/homepage', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/index.html'));
});
app.get('/gethousesbyuser', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/MyListings/mylistingsbyid.html'));
});
app.get('/suggestions', (req, res) => {
  // Load the page from the 'pages' directory
  res.sendFile(path.join(__dirname, 'FINAL/rento/Pages/MyListings/housesuggestions.html'));
});







////// token

const cookieParser = require("cookie-parser");
app.use(
    express.urlencoded({
      extended: true,
    })
);
app.use(cookieParser());



const server = https.createServer(options, app);

server.listen(4000, () => {
  console.log('Server is running on port 4000 with SSL');
});