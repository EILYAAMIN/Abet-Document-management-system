const express = require("express");
const app = express();
const connectDB = require('./config/db');
const multer = require('multer');
const path = require('path');
const auth = require('./middleware/auth');
var cors = require('cors')

connectDB();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg")
            cb(null, 'files/images')
        else
            cb(null, 'files/reports')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.')[0] + ' ' + Date.now() + '.' + file.originalname.split('.')[1])
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.mimetype === "application/msword" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.mimetype === "application/vnd.ms-excel"
    )
        cb(null, true);
    else
        cb(null, false);
};

app.use(cors());

app.use(express.json());

app.use('/auth', require('./routes/Controllers/auth'));

app.use(auth);

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('file'));

app.use('/general', require('./routes/Controllers/general'));

app.use('/group', require('./routes/Controllers/group'));

app.use('/event', require('./routes/Controllers/event'));

app.use('/submission', require('./routes/Controllers/submission'));

app.use('/report', require('./routes/Controllers/report'));

app.use('/topic', require('./routes/Controllers/topic'));

app.use('/super', require('./routes/Controllers/supr'));


const PORT = process.env.PORT || 5000 || ("0.0.0.0");


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

