$(document).ready(async () => {
    setBackground();
    startTime();
    writeNews();
    loadLinks();
    changeUI('links');

    $('#links-button').click(switchSection.bind(this, 'links'));
    $('#notes-button').click(switchSection.bind(this, 'notes'));
    $('#settings-button').click(switchSection.bind(this, 'settings'));
    $('#nb-left').click(handleAction.bind(this));
    $('#nb-right').click(handleAction.bind(this, false));
});

/* ==================== BACKGROUND ==================== */

async function setBackground() {
    // Retrieve the background from the local storage
    const savedBackground = await browser.storage.local.get(['background', 'name', 'link']);

    // If not saved, get a new background or else set the bkgd to the saved image
    if (savedBackground.background === undefined) {
        getAndSaveBackground();
        return;
    }
    $('#background-image').attr('src', savedBackground.background);
    $('#credits-author').attr('href', savedBackground.link);
    $('#credits-author').text(savedBackground.name);
}

async function getAndSaveBackground() {
    // Fetch and set the background
    const newBackground = await fetch('https://api.michaelzhao.xyz/background/random').then((d) =>
        d.json()
    );
    $('#background-image').attr('src', newBackground.imageUrl);
    $('#credits-author').attr('href', newBackground.userLink);
    $('#credits-author').text(newBackground.userName);

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
        browser.storage.local.set({
            background: imgAsUrl,
            name: newBackground.userName,
            link: newBackground.userLink,
        });
    };
}

async function fetchNewBackground() {
    await browser.storage.local.remove('background');
    getAndSaveBackground();
}

/* ==================== DATE AND TIME SECTION ==================== */

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

/* ==================== NEWS SECTION ==================== */

async function writeNews() {
    const news = await fetch('https://api.michaelzhao.xyz/news').then((d) => d.json());
    let articleList = $('#news-text');
    articleList.empty();
    news.results.forEach((n, i) => {
        let subtitle = n.abstract;
        if (subtitle === '') subtitle = n.byline;

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

/* ==================== NOTES SECTION ==================== */

function switchSection(section) {
    $('#nb-info').empty();
    $('#notes-text').attr('class', `notes-text ${section}`);
    changeUI(section);
    if (section === 'links') loadLinks();
    else if (section === 'notes') loadNotes();
    else loadSettings();
}

function changeUI(section) {
    $('#nb-left').removeClass('hidden');
    if (section === 'links') {
        $('#notes-text').empty();
        $('#nb-left').addClass('hidden');
        $('#nb-right').text('Edit');
    } else if (section === 'links-edit') {
        createEditArea();
        $('#nb-left').text('Cancel');
        $('#nb-right').text('Save');
    } else if (section === 'notes') {
        createEditArea();
        $('#nb-left').text('Revert');
        $('#nb-right').text('Save');
    } else {
        $('#notes-text').empty();
        $('#nb-left').addClass('hidden');
        $('#nb-right').text('Save text fields');
    }
}

function createEditArea() {
    let area = $('<textarea>');
    area.attr('id', 'notes-text-edit');
    $('#notes-text').empty();
    $('#notes-text').append(area);
}

async function loadLinks() {
    // Load data
    const data = await browser.storage.sync.get('links');
    let links = data.links;

    // If no links, write default message
    if (links === undefined || links === '') {
        links = 'https://example.com 83e1ff click edit to add links!\n[href] [color] [name]';
        browser.storage.sync.set({ links });
    }

    // Split links by line
    const linkRows = links.split('\n');

    // Map each link to an anchor element
    // Each link line should be [link url] [link name]
    let notesRef = $('#notes-text');
    linkRows.forEach((line) => {
        let splitLine = line.trim().split(' ');
        const url = splitLine[0];
        const color = splitLine[1];
        const name = line.substring(url.length + color.length + 2);

        let currLine = $('<a>');
        currLine.addClass('notes-link');
        currLine.attr('href', url);
        currLine.attr('style', `color:#${color}`);
        currLine.text(name);
        notesRef.append(currLine);
    });
}

async function loadNotes() {
    // Load data
    const data = await browser.storage.sync.get('notes');
    const notes = data.notes;

    // If no links, write default message, else write the notes
    if (notes === undefined || notes === '') {
        $('#notes-text-edit').val('');
        browser.storage.sync.set({ notes: '' });
    } else $('#notes-text-edit').val(notes);
}

async function loadSettings() {
    let newBkgdButton = $('<button>');
    newBkgdButton.addClass('settings-button');
    newBkgdButton.attr('id', 'new-background-button');
    newBkgdButton.text('New Random Background');
    $('#notes-text').append(newBkgdButton);
    newBkgdButton.click(fetchNewBackground.bind(this));
}

function handleAction(left = true) {
    const textRef = $('#notes-text');
    if (textRef.hasClass('links')) {
        if ($('#nb-right').text().toLowerCase() === 'edit') editLinks();
        else {
            if (left) loadLinks();
            else saveLinks();
            changeUI('links');
        }
    } else if (textRef.hasClass('notes')) {
        if (left) {
            loadNotes();
            $('#nb-info').text('Reverted to last save');
        } else saveNotes();
    } else {
    }
}

async function editLinks() {
    const data = await browser.storage.sync.get('links');
    const links = data.links;

    changeUI('links-edit');
    $('#notes-text-edit').val(links);
}

async function saveLinks() {
    $('#nb-info').text('Saving...');
    const newLinks = $('#notes-text-edit').val();
    await browser.storage.sync.set({ links: newLinks });
    $('#nb-info').text('Saved links');
    loadLinks();
}

async function saveNotes() {
    $('#nb-info').text('Saving...');
    const newNotes = $('#notes-text-edit').val();
    await browser.storage.sync.set({ notes: newNotes });
    $('#nb-info').text('Saved notes');
    loadNotes();
}

/* ==================== UTILS ==================== */

function pad(input) {
    if (input > 9) return new String(input);
    return `0${input}`;
}

// function randInt(min, max) {
//     return Math.round(Math.random() * (max - min) + min);
// }
