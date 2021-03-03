const fs = require('fs');
const mkdirp = require('mkdirp')
export function writeHTML({topKeywords, destPath, risingKeywords, keyword, keywords, destFile,}) {
    destFile = destFile || 'webpage/' + keyword + '.html';
    try {
        mkdirp(destPath);
    } catch (e) {
        console.error(e);
    }

    if (!topKeywords.length && !risingKeywords.length) {
        const baseHTML = fs.readFileSync('templates/empty.html', {encoding: 'utf-8'})
        fs.writeFileSync(destFile, baseHTML, {encoding: 'utf-8'});
        return;
    }
    let line = it => {
        let value;
        if (it.value > 100) {
            value = 200;
        } else {
            value = (((it.value - 1) % 100) / 10).toFixed(0);
        }

        return `
                      <a href="/${keywords.join('/')}/${it.query}" class="item mb-3 rate-${value}">
                            ${it.query}
                            <span class="badge badge-sm ml-3">${it.value}</span>
                      </a>
                        `;
    };
    const baseHTML = fs.readFileSync('templates/base.html', {encoding: 'utf-8'})
        .replaceAll('%TITLE%', keyword)
        .replaceAll('%KEYWORD%', keyword)
        .replace('%TOP_KEYWORDS%',
            topKeywords.map(line).join('\n')
        )
        .replace('%RAISING_KEYWORDS%',
            risingKeywords.map(line).join('\n')
        );

    fs.writeFileSync(destFile, baseHTML, {encoding: 'utf-8'});
}