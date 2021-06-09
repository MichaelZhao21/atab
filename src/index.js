$(document).ready(async () => {
    startTime();
    
});

/* DATE AND TIME SECTION */

function startTime() {
    setNow();
    window.setInterval(setNow, 1000);
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

function writeNews() {
    let articleList = $('.news');
    articleList.empty();
    window.state.news.forEach((n, i) => {
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
