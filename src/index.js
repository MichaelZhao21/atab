$(document).ready(async () => {
    setBackground();
    startTime();
    writeNews();
});

/* BACKGROUND */
async function setBackground() {
    const savedBackground = await browser.storage.local.get('background');
    if (savedBackground.background === undefined) {
        getAndSaveBackground();
        return;
    }
    $('#background-image').attr('src', savedBackground.background);
}

async function getAndSaveBackground() {
    const newBackground = await fetch('https://api.michaelzhao.xyz/background/random').then((d) =>
        d.json()
    );
    $('#background-image').attr('src', newBackground.imageUrl);
    browser.storage.local.set({ background: newBackground.imageUrl });
}

/* DATE AND TIME SECTION */

function startTime() {
    setTime();
    window.setInterval(setTime, 1000);
}

function setTime() {
    const now = dayjs();
    const time = now.format('hh:mm:ss a');
    const date = now.format('dddd, MMMM DD, YYYY');
    $('.time').text(time);
    $('.date').text(date);
}

/* NEWS SECTION */

async function writeNews() {
    const news = await fetch('https://api.michaelzhao.xyz/news').then((d) => d.json());
    let articleList = $('#news');
    articleList.empty();
    news.results.forEach((n, i) => {
        let subtitle = n.abstract;
        if (subtitle === '') subtitle = n.byline;
        let article = $(`<a class="article" href="${n.url}"></a>`);
        article.append($(`<p class="article-number">${i + 1}</p>`));
        let articleRight = $(`<div class="article-right"></div>`);
        articleRight.append($(`<p class="article-title">${n.title}</p>`));
        articleRight.append($(`<p class="article-subtitle">${subtitle}</p>`));
        article.append(articleRight);
        articleList.append(article);
    });
}

// function randInt(min, max) {
//     return Math.round(Math.random() * (max - min) + min);
// }
