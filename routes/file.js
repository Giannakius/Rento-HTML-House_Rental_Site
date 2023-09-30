const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = uuidv4() + ext;
        cb(null, filename);

        // Add the filename to req.body.image as an array
        if (!req.body.image) {
            req.body.image = [filename];
        } else {
            req.body.image.push(filename);
        }
    },
});
const uploadf = multer({ storage: storage });
const getImage = (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../uploads', filename);
    res.sendFile(imagePath);
};

module.exports = {
    uploadf: uploadf,
    path: path,
    getImage: getImage,
    attachRoutes: (app) => {
        app.get('/getimage/:filename', getImage);
    }
};