import mongoose from 'mongoose'
import logger from './logger'

const DB_CONNECTION_STRING = 'mongodb://localhost:27017/yt-clone'


export async function connectToDatabase() {
    try {
        await mongoose.connect(DB_CONNECTION_STRING)
        logger.info("Connected to DB")
    } catch(e) {
        logger.error(e, "Failed to connect to database")
        process.exit(1)
    }
}

export async function disconnectFromDatabase() {
    await mongoose.connection.close()
    logger.info("Disconnected from database")
    return
}