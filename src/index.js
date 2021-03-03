const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const {writeHTML} = require("./lib/render");
const {fetchData} = require("./lib/trends");

const app = express();
app.use(cors());

const basePath = path.join(__dirname, '../webpage');

app.get('/favicon.ico', (req, res) => {
    res.status(404).send();
})

app.get('/', async (req, res) => {
    return res.sendFile(path.join(__dirname, '../templates/index.html'));
})

app.get('/*', async (req, res) => {
    let keyword_path = req.path.substring(1, req.path.length);
    keyword_path = decodeURI(keyword_path);
    if (keyword_path.endsWith('/')) {
        keyword_path = keyword_path.substring(0, keyword_path.length - 1);
    }

    const destPath = path.join(basePath, keyword_path);
    const destFile = path.join(basePath, keyword_path + '.html');
    if (!fs.existsSync(destFile)) {
        const keywords = keyword_path.split('/');
        const keyword = keywords[keywords.length - 1];
        try {
            const {topKeywords, risingKeywords} = await fetchData(keyword);
            writeHTML({
                destFile, destPath, topKeywords, risingKeywords, keyword,
                keywords
            })
        } catch (e) {
            console.error(e);
            res.status(500).send(e.requestBody || e);
        }
    }

    return res.sendFile(destFile);
})

app.listen(3003, () => {
    console.log('app is listening at http://localhost:3003');
});






