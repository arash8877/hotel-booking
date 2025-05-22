import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();
app.use(cors()); //Enable cross-origin resource sharing

app.get("/", (req, res) => res.send("API is working!"));
