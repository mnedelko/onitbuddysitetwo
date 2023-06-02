import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.resolve(__dirname, './build')));

app.get('/', (request, response) => {
  console.log('Home page visited!');
  const filePath = path.resolve(__dirname, './build', 'index.html');

  // read in the index.html file
  fs.readFile(filePath, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    
    // replace the special strings with server generated strings
    data = data.replace(/\$BG_TITLE/g, "The World's First Open Source NFTT Project");
    data = data.replace(/\$BG_DESCRIPTION/g, "OnitBuddy is a PFP project of 8080 unique illustrations designed to support the development of a dynamic-NFT-protocol, the so called transmorg protocol, which creates transformable NFTs, based on an open-source design system that encourages others to evolve each NFT, via a secondary market of component-based contributions.");
    date = data.replace(/\$OG_WEBSITE/g, "https://onitbuddy.com");
    data = data.replace(/\$OG_TITLE/g, "The World's First Open Source NFTT Project");
    data = data.replace(/\$OG_DESCRIPTION/g, "OnitBuddy is a PFP project of 8080 unique illustrations designed to support the development of a dynamic-NFT-protocol, the so called transmorg protocol, which creates transformable NFTs, based on an open-source design system that encourages others to evolve each NFT, via a secondary market of component-based contributions.");
    data = data.replace(/\$OG_IMAGE/g, "https://imgur.com/a/6rPZbGB");
    date = data.replace(/\$TW_URL/g, "https://onitbuddy.com");
    data = data.replace(/\$TW_TITLE/g, "The World's First Open Source NFTT Project");
    data = data.replace(/\$TW_DESCRIPTION/g, "OnitBuddy is a PFP project of 8080 unique illustrations designed to support the development of a dynamic-NFT-protocol, the so called transmorg protocol, which creates transformable NFTs, based on an open-source design system that encourages others to evolve each NFT, via a secondary market of component-based contributions.");
    result = data.replace(/\$TW_IMAGE/g, "https://imgur.com/a/6rPZbGB");
    

    response.send(result);
  });
});

app.use(express.static(path.resolve(__dirname, './build')));

app.listen(port, () => console.log(`Listening on port ${port}`));

