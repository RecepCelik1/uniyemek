const mongoose = require('mongoose');

const connectDb = () => {
    mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
        console.log('mongodb connected succesfully!!');
    })
    .catch((err) => {
        console.log("Db connection failed!", err);
    });
}

module.exports = connectDb;