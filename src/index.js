import dayjs from 'dayjs';
import $ from 'jquery';
import './index.css';

$(async () => {
    startTime();
    writeNews();
});

/* ==================== DATE AND TIME SECTION ==================== */

function startTime() {
    setTime();
    window.setInterval(setTime, 1000);
}

function setTime() {
    const now = dayjs();
    const time = now.format('hh:mm:ss a');
    const date = now.format('dddd, MMMM DD, YYYY');
    $('#time').text(time);
    $('#date').text(date);
}

/* ==================== NEWS SECTION ==================== */

async function writeNews() {
    const news = await fetch('https://api.michaelzhao.xyz/news').then((d) => d.json());
    let articleList = $('#news-text');
    articleList.empty();
    
    news.articles.forEach((n, i) => {
        let subtitle = n.description || n.content || n.author || '';

        let article = $('<a>');
        article.addClass('article');
        article.attr('href', n.url);

        let articleNumber = $('<p>');
        articleNumber.addClass('article-number');
        articleNumber.text(pad(i + 1));
        article.append(articleNumber);

        let articleRight = $('<div>');
        articleRight.addClass('article-right');

        let articleTitle = $('<p>');
        articleTitle.addClass('article-title');
        articleTitle.text(n.title);
        articleRight.append(articleTitle);

        let articleSubtitle = $('<p>');
        articleSubtitle.addClass('article-subtitle');
        articleSubtitle.text(subtitle);
        articleRight.append(articleSubtitle);

        article.append(articleRight);
        articleList.append(article);
    });
}

/* ==================== UTILS ==================== */

function pad(input) {
    if (input > 9) return new String(input);
    return `0${input}`;
}

// function randInt(min, max) {
//     return Math.round(Math.random() * (max - min) + min);
// }
