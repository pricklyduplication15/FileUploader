var express = require("express");
var cors = require("cors");
var multer = require("multer");
var path = require("path");
require("dotenv").config();

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(process.cwd(), "/public")));
app.get("/", function (req, res) {
  res.sendFile(path.join(process.cwd(), "/views/index.html"));
});

// Set storage engine
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init multer
var upload = multer({ storage: storage }).single("upfile");

app.post("/api/fileanalyse", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    if (!req.file) {
      return res.status(400).send("No files were uploaded.");
    }

    const uploadedFile = req.file;
    const fileInfo = {
      name: uploadedFile.originalname,
      type: uploadedFile.mimetype,
      size: uploadedFile.size,
    };

    res.json(fileInfo);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
