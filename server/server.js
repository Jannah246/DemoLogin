import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";

const app = express();

// middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by"); // this will allow less hackers know about this project stack

const port = 8080;

app.get("/", (req, res) => {
  res.status(201).json("Home get request");
});

// other api routes
app.use('/api', router)

// db connection
connect().then(() => {
  try {
    // start server
    app.listen(port, () => {
      console.log(`Starting server at localhost:${port}`);
    });
  } catch (error) {
    console.log("Couldn't connect to server");
  }
}).catch((error)=>{
    console.log("Invalid server connection: " + error);
})
