$(document).ready(async function () {
    window.state = {};
    const backend = 'http://localhost:8080';

    // fetch(`${backend}/todo`).then(async (d) => {
    //     window.state.todo = await d.json();
    //     writeTodo();
    // });
    fetch(`${backend}/news`).then(async (d) => {
        const newsData = await d.json();
        const news = newsData.results;
        window.state.news = news;
        writeNews(news);
    });
    // fetch(`${backend}/todo/settings`).then(async (d) => {
    //     const settings = await d.json();
    //     window.state.tags = settings.tags;
    //     writeTags();
    // });

    startTime();
});

/* DATE AND TIME SECTION */

function startTime() {
    setNow();
    window.setTimeout(() => {
        window.setInterval(setNow, 1000);
    }, 1500 - dayjs().get('ms')); // Offset change time to sync with computer
}

function setNow() {
    const now = dayjs();
    const time = now.format('hh:mm:ss a');
    const date = now.format('dddd, MMMM DD, YYYY');
    setTime(time, date);
}

function setTime(time, date) {
    $('.time-time').text(time);
    $('.time-date').text(date);
}

/* NEWS SECTION */

function writeNews(news) {
    let articleList = $('.news');
    articleList.empty();
    news.forEach((n, i) => {
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
