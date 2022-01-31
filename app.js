require('dotenv').config();
require('express-async-errors');


const express = require('express')

const app = express()

const connectDB = require('./db/connect')
const authUser = require('./routes/authUser')

app.use(express.json());

app.use(authUser)


app.get('/', (req, res) => {
    res.send('Hellooo')
})


const port = process.env.PORT || 3000;


const start = async () => {
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