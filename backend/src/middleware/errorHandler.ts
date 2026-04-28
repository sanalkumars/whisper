import type { NextFunction, Request, Response } from "express";



export const errorHandler = (err :Error, req : Request , res :Response , _next :NextFunction)=>{

    const statusCode = res.statusCode !==200 ? res.statusCode : 500 ;

    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        ...( process.env.NODE_ENV === "production" && { stack :err.stack})
    });

}