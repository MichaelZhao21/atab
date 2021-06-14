$(document).ready(async () => {
    setBackground();
    startTime();
    writeNews();
});

/* BACKGROUND */

async function setBackground() {
    // Retrieve the background from the local storage
    const savedBackground = await browser.storage.local.get('background');
    
    // If not saved, get a new background or else set the bkgd to the saved image
    if (savedBackground.background === undefined) {
        getAndSaveBackground();
        return;
    }
    $('#background-image').attr('src', savedBackground.background);
}

async function getAndSaveBackground() {
    // Fetch and set the background
    const newBackground = await fetch('https://api.michaelzhao.xyz/background/random').then((d) =>
        d.json()
    );
    $('#background-image').attr('src', newBackground.imageUrl);

    // Save the image to local storage
    let img = new Image();
    img.src = newBackground.imageUrl;
    let imgCanvas = document.createElement('canvas');
    let imgContext = imgCanvas.getContext('2d');
    imgCanvas.width = window.innerWidth;
    imgCanvas.height = window.innerHeight;
    img.onload = () => {
        imgContext.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
        const imgAsUrl = imgCanvas.toDataURL('image/png');
        console.log(imgAsUrl);
        browser.storage.local.set({ background: imgAsUrl });
    };
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
    let articleList = $('#news-text');
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
