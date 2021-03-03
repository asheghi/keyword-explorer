const googleTrends = require('google-trends-api');

export function extractResult(str) {
    let parsed = JSON.parse(str);
    const topKeywords = parsed?.default?.rankedList?.["0"]?.rankedKeyword;
    const risingKeywords = parsed?.default?.rankedList?.["1"]?.rankedKeyword;
    return {topKeywords, risingKeywords};
}

async function getTrends(keyword, rest) {
    const startTime = new Date();
    startTime.setFullYear(startTime.getFullYear() - 1);

    const str = await googleTrends.relatedQueries({keyword, startTime, ...rest},);
    return extractResult(str);
}

export async function fetchData(keyword) {
    if (!keyword) {
        return;
    }
    let topList = [];
    let risingList = [];


    async function process(arg) {
        const {topKeywords, risingKeywords} = await getTrends(keyword, arg);
        topList.push(...topKeywords);
        risingList.push(...risingKeywords)
    }

    await process();
    await process({property: 'youtube'});

    return {
        topKeywords: topList.sort((a, b) => b.value - a.value),
        risingKeywords: risingList.sort((a, b) => b.value - a.value)
    };
}