const express = require("express");
const app = express();

app.get("/", function (request, response) {
  response.send("Hello World");
});

app.listen(3000, () => {
  console.log("Strted express at aport 300");
});
//tt
