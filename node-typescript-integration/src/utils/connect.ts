import mongoose from "mongoose";
import config from 'config'
import logger from './logger'

export default function connect() {
    const dbUri: string = config.get('dbUri')

    return mongoose.connect(dbUri)
        .then(() => logger.info("DB connected"))
        .catch((err) => {
            logger.error("Couldn't connect to DB")
            process.exit(1)
        })

}