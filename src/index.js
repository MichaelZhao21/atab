$(document).ready(async function () {
    const backend = 'http://localhost:8080';
    window.backend = backend;

    fetch(`${backend}/todo`).then(async (d) => {
        const todo = await d.json();
        const tags = await fetch(`${backend}/todo/settings`).then(async (d) => {
            const settings = await d.json();
            window.tags = settings.tags;
            return settings.tags;
        });
        writeTodo(todo, tags);
    });
    fetch(`${backend}/news`).then(async (d) => {
        const newsData = await d.json();
        const news = newsData.results;
        writeNews(news);
    });

    startTime();

    $('#add-task').click(openPopup.bind(this, 1, null));
    $('#edit-tags-button').click(openPopup.bind(this, 2, null));

    $('#cancel-popup').click(closePopup);
    $('#save-popup').click(savePopup);
    $('#tags-list').click(toggleTags);
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

/* _TODO SECTION */

function writeTodo(todo, tags) {
    let todoList = $('.todo-list');
    todoList.empty();
    todo.forEach((t, i) => {
        const dueDateUrgency = calcDueDateUrgency(t.due);
        const formattedDueDate = formatDueDate(t.due);
        const priorityStars = createPriorityStars(t.priority);
        const tagList = createTagList(t.tags, tags);
        let todoItem = $(`<div class="todo-item"></div>`);
        let display = $(`<div class="todo-item-display"></div>`);
        display.append($(`<p class="todo-text todo-priority">${priorityStars}</p>`));
        display.append($(`<div class="todo-divider">|</div>`));
        display.append(
            $(`<p class="todo-text todo-due urgent-${dueDateUrgency}">${formattedDueDate}</p>`)
        );
        display.append($(`<div class="todo-divider">|</div>`));
        display.append($(`<p class="todo-text todo-tag">${t.tags[0] || '&nbsp'}</p>`));
        display.append($(`<div class="todo-divider">|</div>`));
        display.append($(`<p class="todo-text todo-tag">${t.tags[1] || '&nbsp'}</p>`));
        display.append($(`<div class="todo-divider">|</div>`));
        display.append($(`<p class="todo-text todo-tag">${t.tags[2] || '&nbsp'}</p>`));
        display.append($(`<div class="todo-divider">|</div>`));
        display.append($(`<p class="todo-text todo-name">${t.name}</p>`));
        display.click(toggleDropdown.bind(this, i));
        todoItem.append(display);
        let dropdown = $(
            `<div id="todo-drop-${i}" class="todo-item-dropdown" style="display:none;"></div>`
        );
        let arrow = $(`<div class="todo-item-arrow">&gt;</div>`);
        arrow.click(openPopup.bind(this, 1, t));
        dropdown.append(arrow);
        let info = $(`<div class="todo-item-dropdown-right"></div>`);
        info.append($(`<p class="todo-item-title">${t.name}</p>`));
        if (tagList.length > 0) {
            let tagsComponent = $(`<p class="todo-item-tags"></p>`);
            tagsComponent.append($(`<span class="todo-item-tags-label">Tags:&nbsp;</span>`));
            tagsComponent.append($(`<span class="todo-item-tags-list">${tagList}</span>`));
            info.append(tagsComponent);
        }
        info.append($(`<p class="todo-item-description">${t.description}</p>`));
        dropdown.append(info);
        todoItem.append(dropdown);
        todoList.append(todoItem);
    });
}

// 0 for non-existent, 1 for > month, 2 for > week, 3 for > day, 4 for same day, 5 for OVERDUE!
function calcDueDateUrgency(due) {
    if (due === 0) return 0;

    const diff = due - new dayjs().startOf('day').subtract(1, 'day').valueOf();
    if (diff < 0) return 5;
    else if (diff > 2629800000) return 1;
    else if (diff > 604800000) return 2;
    else if (diff > 86400000) return 3;
    return 4;
}

function formatDueDate(due) {
    if (due === 0) return 'DUE 00/00/00';
    return `DUE ${new dayjs(due).format('MM/DD/YY')}`;
}

function createPriorityStars(priority) {
    const grey = 5 - priority;
    return `<span class="p${priority}">${'*'.repeat(priority)}</span>${'*'.repeat(grey)}`;
}

function createTagList(tags, tagList) {
    if (tagList === undefined || tags === null) return 'ERROR';

    let tagString = '';
    tags.forEach((t) => {
        let tag = tagList.find((f) => f.char === t);
        tag = tag === undefined ? '[INVALID TAG]' : tag.text;
        tagString += tag + ', ';
    });
    return tagString.slice(0, -2);
}

function toggleDropdown(i) {
    let todoItem = $(`#todo-drop-${i}`);
    let prev = todoItem.css('display');
    if (prev === 'none') todoItem.css('display', 'flex');
    else todoItem.css('display', 'none');
}

/* POPUP SECTION */

function openPopup(id, data = null) {
    // Set data
    if (id === 1 && data !== null) {
        $('#edit-id').text(data._id);
        $('#edit-name').val(data.name);
        $('#edit-m').val(dayjs(data.due).format('MM'));
        $('#edit-d').val(dayjs(data.due).format('DD'));
        $('#edit-y').val(dayjs(data.due).format('YYYY'));
        $('#edit-priority').val(data.priority);
        $('#edit-tags').val(data.tags.join(' '));
        $('#edit-description').val(data.description);
    } else if (id === 2) {
        $('#tags-area').val(createEditTagList());
    }

    // Set visible
    let el = $('#edit-todo-popup');
    if (id === 2) el = $('#edit-tags-popup');
    el.css('display', 'block');
    $('.popup').css('display', 'block');
}

function closePopup() {
    $('.popup-inner').each(function () {
        $(this).css('display', 'none');
    });
    $('.popup').css('display', 'none');
    resetValues();
}

async function savePopup() {
    // Disable submit button
    $('#save-popup').prop('disabled', true);

    // Get type of popup
    const popupId = $('#edit-todo-popup').css('display') === 'none' ? 2 : 1;

    // Edit Tags
    if (popupId === 2) {
        const tagArea = $('#tags-area').val();
        const tagList = tagArea.split('\n').map((t) => {
            let tSplit = t.split(' ');
            if (tSplit.length < 2 || tSplit[0].length !== 1) return null;
            return { char: tSplit[0], text: tSplit.slice(1).join(' ') };
        });
        const finalList = tagList.filter((t) => t !== null);
        await fetch(`${window.backend}/todo/settings`, {
            method: 'POST',
            body: JSON.stringify({ tags: finalList }),
            headers: { 'Content-Type': 'application/json' },
        });
        window.location.reload();
        return;
    }

    // Edit Todo
    const id = $('#edit-id').text();
    const name = $('#edit-name').val();
    const m = $('#edit-m').val();
    const d = $('#edit-d').val();
    const y = $('#edit-y').val();
    const priority = $('#edit-priority').val();
    const rawTags = $('#edit-tags').val();
    const description = $('#edit-description').val();

    // Calculate due date
    let due = 0;
    if (m !== '' && d !== '' && y !== '')
        due = dayjs(`${m}/${d}/${y}`, 'M/D/YYYY').startOf('day').valueOf();

    // Format tags
    let tagsParsed = [];
    rawTags.split('').forEach((t) => {
        if (
            t.toLowerCase().match(/[a-z]/i) &&
            window.tags.find((i) => i.char === t.toUpperCase()) !== undefined &&
            tagsParsed.indexOf(t.toUpperCase()) === -1
        ) {
            tagsParsed.push(t.toUpperCase());
        }
    });

    // Create data obj
    const data = {
        name,
        due,
        priority,
        description,
        tags: tagsParsed,
    };

    if (id === '') {
        await fetch(`${window.backend}/todo`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
    } else {
        await fetch(`${window.backend}/todo/${id}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
    }
    window.location.reload();
}

function resetValues() {
    $('#edit-id').text('');
    $('#edit-name').val('');
    $('#edit-m').val('');
    $('#edit-d').val('');
    $('#edit-y').val('');
    $('#edit-priority').val('');
    $('#edit-tags').val('');
    $('#edit-description').val('');
    $('#tags-area').val('');
}

function toggleTags() {
    let el = $('#tags-list');
    if (el.text() === 'Click to show all tags') {
        el.text(window.tags.map((t) => `[${t.char}] ${t.text}`).join(', '));
    } else {
        el.text('Click to show all tags');
    }
}

function createEditTagList() {
    return window.tags.reduce((out, val) => {
        return (out += `${val.char} ${val.text}\n`);
    }, '');
}
