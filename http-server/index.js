const http = require("http");
const fs = require("fs");
const input_arg = require("minimist")(process.argv.slice(1), {
    default: {
        port : 3000,
    },
});

/*if (typeof window!=='undefined'){
    let home = document.getElementById("home");
}
*/

let hc ="";
let prc="";
let rp="";


fs.readFile("home.html",(err, home) => {
    if (err) {
        throw err;
    }
    hc=home;
});

fs.readFile("project.html", (err, project) => {
    if (err) {
        throw err;
    }
    prc=project;
});

fs.readFile("registration.html",(err,registration) => {
    if (err) {
        throw err;
    }
    rp=registration;
});


    
http.createServer((req,res) => {
    let url = req.url;
    res.writeHeader(200, {"content-Type" : "text/html"});
    switch (url) {
        case "/project":
            res.write(prc);
            res.end();
            break;
        case "/registration":
            res.write(rp);
            res.end();
        default:
            res.write(hc);
            res.end();
            break;
    }
}).listen(3000);


//home.addEventListener(show);


/*
fs.readFile("home.html", (err, home) => {
    if (err) {
      throw err;
    }
    http
      .createServer((request, response) => {
        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write(home);
        response.end();
      })
      .listen(3000);
  });
  */
