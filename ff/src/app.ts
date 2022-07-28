import express, {Application} from 'express'
import mongoose from 'mongoose'
import compression from 'compression'
import cors from 'cors'
import Controller from '@/utils/interfaces/controller.interface'
import ErrorMiddleware from '@/middleware/error.middleware'
import helmet from 'helmet'
import morgan from 'morgan'


class App {
    public express: Application;
    public port: number

    constructor(controllers: Controller[], port: number){
        this.express = express()
        this.port = port

        this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling()
    }

    private initializeMiddleware(): void {
        this.express.use(helmet())
        this.express.use(cors())
        this.express.use(compression())
        this.express.use(morgan('dev'))
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: true }))
    }

    private initializeControllers(controllers: Controller[]): void{
        controllers.forEach((controller: Controller) => {
            this.express.use("/api", controller.router)
        })
    }

    private initializeErrorHandling(): void {
        this.express.use(ErrorMiddleware)
    }

    private initializeDatabaseConnection(): void {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env

        mongoose.connect('mongodb://localhost:27017/tnode')
    }

    public listen(): void{
        this.express.listen(this.port, () => {
            console.log("Server started running")
        })
    }
}

export default App