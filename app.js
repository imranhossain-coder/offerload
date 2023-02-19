const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("./db/conn");
const cors = require("cors");
const http = require("http");
const BodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(require("./router/auth"));

app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());

const Server = http.createServer(app);

Server.listen(PORT, () => {
  console.log(`Ishop Backend is running on localhost ${PORT}`);
});

app.get("/", async (req, res) => {
  res.send(`Ishop backend Was Live Successfully ${PORT}`);
});
