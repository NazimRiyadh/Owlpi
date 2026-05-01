import mongoose from "mongoose";
import config from ".";
import logger from "./logger";
import { log } from "winston";

//follows Singleton Design Pattern

class mongoConnect{
    constructor() {
        this.connection=null
    }

    async connect() {
        try {
            if(this.connection!=null){
                logger.info("Mongo Db connection already exists")
                return this.connection
            }

            await mongoose.connect(config.mongo.uri,{
                dbName: config.mongo.dbName
            })
            logger.info(`Mongodb Connected at: ${config.mongo.uri}`)
            
            this.connection.on("error",(error)=>{
                logger.error("Mongo DB connection error", error)
            })

            this.connection.on("disconnected",()=>{
                logger.info("MongoDB disconnected")
            })
        return this.connection
        } catch (error) {
            logger.error("Failed to connect to MongoDB", error)
            throw error
        }
    }

    async disconnect(){
        try {
            if(this.connection){
                await mongoose.disconnect()
                this.connection=null
                logger.info("MongoDB disconnected")
            }
        } catch (error) {
            logger.error("Failed to connect to MongoDB", error)  
            throw error
        }
    }

    async getConnection(){
        return this.connection
    }
}

export default mongoConnect