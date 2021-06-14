$(document).ready(async () => {
    setBackground();
    startTime();
    writeNews();
    loadLinks();

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

async function newBackground() {
    console.log('wfgwef');
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
        let article = $(`<a class="article" href="${n.url}"></a>`);
        article.append($(`<p class="article-number">${pad(i + 1)}</p>`));
        let articleRight = $(`<div class="article-right"></div>`);
        articleRight.append($(`<p class="article-title">${n.title}</p>`));
        articleRight.append($(`<p class="article-subtitle">${subtitle}</p>`));
        article.append(articleRight);
        articleList.append(article);
    });
}

/* ==================== NOTES SECTION ==================== */

function switchSection(section) {
    $('#nb-info').text('');
    $('#notes-text').attr('class', `notes-text ${section}`);
    if (section === 'links') loadLinks();
    else if (section === 'notes') loadNotes();
    else loadSettings();
}

async function loadLinks() {
    // Change button messages and clear text container
    $('#nb-left').addClass('hidden');
    $('#nb-right').text('Edit');
    $('#notes-text').text('');

    // Load data
    const data = await browser.storage.sync.get('links');
    const links = data.links;

    // If no links, write default message
    if (links === undefined || links === '') {
        $('#notes-text').html('<span class="loading">Press "edit" to add some links!</span>');
        browser.storage.sync.set({ links: '' });
        return;
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
        notesRef.append($(`<a href=${url} class="notes-link" style="color:#${color}">${name}</a>`));
    });
}

async function loadNotes() {
    // Change button messages and clear text container
    $('#nb-left').removeClass('hidden');
    $('#nb-left').text('Revert');
    $('#nb-right').text('Save');
    $('#notes-text').html($('<textarea id="notes-text-edit"></textarea>'));

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
    // Change button messages and clear text container
    $('#nb-left').addClass('hidden');
    $('#nb-right').text('Save text fields');
    $('#notes-text').text('');
    $('#notes-text').append(
        $(
            `<button id="new-background-button" class="settings-button">New Random Background</button>`
        )
    );
}

function handleAction(left = true) {
    const textRef = $('#notes-text');
    console.log(textRef);
    if (textRef.hasClass('links')) {
        if ($('#nb-right').text().toLowerCase() === 'edit') editLinks();
        else {
            if (left) loadLinks();
            else saveLinks();
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
    console.log(links);

    $('#notes-text').html($('<textarea id="notes-text-edit"></textarea>'));
    $('#notes-text-edit').val(links);
    $('#nb-left').removeClass('hidden');
    $('#nb-left').text('Cancel');
    $('#nb-right').text('Save');
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
