$(document).ready(async function () {
    window.state = {};
    const backend = 'http://localhost:8080';

    fetch(`${backend}/todo`).then(async (d) => {
        const todo = await d.json();
        const tags = await fetch(`${backend}/todo/settings`).then(async (d) => {
            const settings = await d.json();
            return settings.tags;
        });
        writeTodo(todo, tags);
    });
    fetch(`${backend}/news`).then(async (d) => {
        const newsData = await d.json();
        const news = newsData.results;
        window.state.news = news;
        writeNews(news);
    });

    startTime();

    $('#add-task').click(openPopup.bind(this, 1, null));
    $('#edit-tags').click(openPopup.bind(this, 2, null));
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
        let tagsComponent = $(`<p class="todo-item-tags>`);
        tagsComponent.append($(`<span class="todo-item-tags-label">Tags:</span>`));
        tagsComponent.append($(`<span class="todo-item-tags-list">${tagList}</span>`));
        info.append(tagsComponent);
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

function openPopup(id, data) {
    // TODO: add open popup ability
    console.log({ id, data });
}
