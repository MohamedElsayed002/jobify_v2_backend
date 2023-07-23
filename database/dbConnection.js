

import mongoose from 'mongoose'


export function dbConnection() {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log('database connected established'))
        .catch((error) => console.log(error))
}