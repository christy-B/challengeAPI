import Express, { Response, Request, NextFunction } from "express";
import { tests } from "./ssh/tests";

const PORT = process.env.PORT || 8000;

const app = Express();

// app.get("/test", tests )

app.get("/", (req:Request, res:Response)=> {
    res.send("hello world");
})


app.listen(PORT,()=> {console.log("Running on " + PORT)})