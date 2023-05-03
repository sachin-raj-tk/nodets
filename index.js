const http = require("http");
const fs = require("fs");
const path = require("path");

const connection = http.createServer().listen(5000, () => {
  console.log("server statrted at port 5000");
});

const readAllFiles = (currentDirPath, fileNameArray = []) => {
  fs.readdir(currentDirPath, (err, files) => {
    if (err) throw new Error(err);
    files.forEach((item) => {
      let filePath = path.join(currentDirPath, item);
      let stat = fs.statSync(filePath);
      if (stat.isFile()) {
        fileNameArray.push(filePath);
      } else if (stat.isDirectory()) {
        readAllFiles(filePath, fileNameArray);
      }
    });
  });
  return fileNameArray;
};

const allFiles = readAllFiles("./Main");



connection.on("request", (req, res) => {
  console.log("request recieved at 5000 port", req.url);

  if (req.method === 'POST' && req.url === '/delete') {
    let body = '';
   req.on('data', chunk => {
   body += chunk.toString();
   body = body.split('=')[1]
   console.log(body,'hi body');
});
  }

  let content = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <ul>
      ${allFiles.map((item)=>`<li>${item} name<form action="/delete" method="POST"><input type="hidden" id="nil" name="fileName" value="${item}"><button>Delete</button></form></li>`)}
      </ul>
  </body>
  </html>`;


  console.log(allFiles, "this is allfiles array");
  res.end(content);
});
