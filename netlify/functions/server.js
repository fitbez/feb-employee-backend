const express = require("express");
const mongoose = require("mongoose");
const employeeRouter = require("../../routes/employee");
const userRouter = require("../../routes/user");
const app = express();
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const path = require("path");

const serviceKey = path.join(__dirname, process.env.GCLOUD_PROJECT_KEYFILE);

const storage = new Storage({
  keyfilename: serviceKey,
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY,
  },
});

const configBucket = storage.bucket(process.env.BUCKET_NAME);

const PORT = 5000;

//setup our server
app.listen(PORT, () => {
  console.log(`server is up and running in local host ${PORT}`);
});

//connecting to the mongodb atlas database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log("Database connection is successful!"))
  .catch((err) => console.log(err));

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

//middlewars
app.use(cors());
app.use(express.json());
app.use("/api/employees", employeeRouter);
app.use("/api/user", userRouter);

// Define a route for file uploads
app.post("/upload", multerMid.single("fileUpload"), (req, res) => {
  console.log("file", req.file);
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const file = configBucket.file(req.file.originalname);
  const blobStream = file.createWriteStream();
  const blob = configBucket.file(req.file.originalname.replace(/ /g, "_"));
  //   console.log("blob stream", req.file.originalname);
  blobStream.on("error", (err) => {
    return res.status(500).json(err);
  });

  blobStream.on("finish", async () => {
    const publicUrl = `https://storage.googleapis.com/${configBucket.name}/${blob.name}`;

    const encodedUrl = encodeURI(publicUrl);

    return res.status(200).json({ imageUrl: encodedUrl });
  });

  blobStream.end(req.file.buffer);
});
