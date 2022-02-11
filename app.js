require('dotenv').config();
require('express-async-errors');

const express = require('express')
const app = express()
const cors = require('cors')
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

const connectDB = require('./db/connect')

//routers
const authUser = require('./routes/authUser')
const portfolio = require('./routes/portfolio')
const talent = require('./routes/talent')
const profile = require('./routes/profile')
const rating = require('./routes/rating')
const employerRedirect = require('./routes/employerRedirect')
//const authenticateTalent = require('./middleware/authentication')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(cors())
//routes
app.use(authUser)
app.use(portfolio)
app.use(talent)
app.use(profile)
app.use(rating)
app.use(employerRedirect)


app.get('/', (req, res) => {
    res.send('Hellooo')
})

const port = process.env.PORT || 3000;

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log('Connectd to db');
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();