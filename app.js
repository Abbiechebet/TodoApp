import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import { globalErrorHandler } from "./src/utils/errorHandler.js";
import { config } from "./src/config/index.js";

// Importing the User Routes
import { router as userRouter } from "./src/router/user.route.js";
import { router as taskRouter } from "./src/router/task.route.js";
// import userRouter, { obj as userObj, callName} from "./router/user.route.js"

// console.log(userObj)
// callName()
// Creating the express app
const app = express();

// Exposing environment variables
dotenv.config();

//Database connection
mongoose
  .connect(config.mongodb_connection_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connection established"))
  .catch((e) => console.log(e.message));

  console.log('Connecting to:', config.mongodb_connection_url);
// mongoose
//   .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Database connection established"))
//   .catch((e) => console.log("Mongo connection error: ", e.message));

// Port configuration
//const port = Number(process.env.PORT) || 3000;
const port = config.port || 3000;

// Middlewares
app.use(morgan("tiny"));
app.use(express.json());


// test route
app.get('/testRoute', (req, res) => {
  res.status(200).json({
    message: "connected to the api successfully"
  })
})


// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);

app.use(globalErrorHandler);

// Setting up the express server
app.listen(port, () => {
  console.log(`Server runnning on port: ${port}`);
});


/*
  { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' }
*/
