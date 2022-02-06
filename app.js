require('dotenv').config();
require('express-async-errors');

const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./db/connect')

//routers
const authUser = require('./routes/authUser')
const portfolio = require('./routes/portfolio')
const talent = require('./routes/talent')
const profile = require('./routes/profile')
    //const authenticateTalent = require('./middleware/authentication')

app.use(express.json());
app.use(cors())
//routes
app.use(authUser)
app.use(portfolio)
app.use(talent)
app.use(profile)


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