const express = require('express');
const app = express();

app.get("/",(requests,response) => {
    response.send("hello worls")
})

app.listen(3000, () =>{
    console.log("Stsrted express at aport 300")
})