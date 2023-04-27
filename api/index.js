const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const multer = require("multer");
const path = require('path');



dotenv.config();

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true,  useUnifiedTopology: true}, () => {
    console.log("Connected to MongoDb ...");
});

// console.log(__dirname);
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, "public/images")
  },
  filename: (request, file, cb) => {
    cb(null, request.body.name);

    // for Postman
    // cb(null, file.originalname);
  }
})

const upload = multer({storage});
app.post("/api/upload", upload.single("file"), (request, response) => {
  try {
    response.status(200).json("File uploaded successfully!");
  } catch (error) {
    console.log(error);
  }
})

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);


const port = 8800;

app.get("/", (request, response) => {
  response.send(`Backend server is running on a port ${port} ...`);
});

app.listen(port, () => {
    console.log(`Backend server is running on a port ${port} ...`);
})