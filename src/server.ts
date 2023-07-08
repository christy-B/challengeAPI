import Express, { Response, Request, NextFunction } from "express";
import { tests } from "./ssh/tests";

const PORT = process.env.PORT || 5050;

const app = Express();

app.get("/ssh",tests )


app.listen(PORT,()=> {console.log("Running on " + PORT)})