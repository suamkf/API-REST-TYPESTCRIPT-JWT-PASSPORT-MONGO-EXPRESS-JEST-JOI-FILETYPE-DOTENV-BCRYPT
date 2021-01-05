import { Error} from "mongoose"
import {Request,Response,NextFunction} from "express";
import { logger } from "../../logger/logger"

export const errorHandler = (fn: any)=>{
    return function(req: Request, res:Response, next: NextFunction){
       fn(req,res,next).catch(next)
    }
}

export const mongoErrors = (err:any, req: Request, res: Response, next: NextFunction)=>{
    if(err instanceof Error){
        logger.error(`Mongo error ocurried ${err}`);
        err.message= "Internal server error cod: mgoose."
       
    }

    next(err);
}

export const devErrors = (err:any, req: Request, res: Response, next: NextFunction)=>{
    logger.error(err.message);
    res.status=err.status || 500
    res.send({
        msg:  err.message,
    })
}

export const prodErrors = (err:any, req: Request, res: Response, next: NextFunction)=>{
    logger.error(err.message);
    res.status=err.status || 500
    res.send({
        msg:  err.message || "internal server error",
        stack: err.stack || "",
    })
}