require("dotenv").config();
const https = require("https");
const fs = require("fs");
const path = require("path");
const app = require("./app");

const PORT = process.env.PORT || 8000;

const server = https.createServer(
  {
    cert: fs.readFileSync(path.join(__dirname, "..", "cert.pem")),
    key: fs.readFileSync(path.join(__dirname, "..", "key.pem")),
  },
  app
);

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT} ...`);
});
