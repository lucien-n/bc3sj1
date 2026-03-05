const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const server = require("./server");

const app = express();

app.use(server);

app.listen(3000, () => {
  console.info("server démarré");
});
