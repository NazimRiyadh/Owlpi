import winston, { format, level, log } from "winston"
import config from "./index"

/**
 * Winston logger configuration
 */
const logger= winston.createLogger({
    level: config.node_env === "production" ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({format: "YYYY-MM-DD HH-mm-ss"}),
        winston.format.errors({stack: true}),//logs the actual error
        winston.format.splat( ),
        winston.format.json()   
    ),

    defaultMeta: {service: api_monitoring_system},

    transports:[
        new winston.transports.File({filename: 'logs/error.log', level: "error"}),
        new winston.transports.File({filename: 'logs/combined.log'})
    ]
})

if(config.node_env != "prduction"){
    logger.add(new winston.transport.Console({
        format: winston.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }
    ))
}