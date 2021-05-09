window.state = { tags: null, todo: null, news: null, count: null };

$(document).ready(async function () {
    const backend = 'http://localhost:5000';
    window.backend = backend;

    sync('sync todo news', ['sync', 'todo', 'news']);
    startTime();

    $('#cmd').keypress(runCommand);
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

/* _TODO SECTION */

function runCommand(e) {
    if (e.originalEvent.key.toLowerCase() !== 'enter') return;

    const message = $('#cmd').val();
    $('#cmd').val('');

    // Split up arguments
    const rawArgs = message.trim().split(/ +/g);

    // Combine strings
    let argsWithStrings = [];
    let quote = '';
    rawArgs.forEach((r) => {
        if (r.indexOf('"') === -1) {
            if (quote === '') argsWithStrings.push(r);
            else quote += ` ${r}`;
        } else {
            if (r.match(/"/g).length === 2) argsWithStrings.push(r.substring(1, r.length - 1));
            else if (quote === '') quote = r;
            else {
                quote += ` ${r}`;
                argsWithStrings.push(quote.substring(1, quote.length - 1));
                quote = '';
            }
        }
    });

    // Create options object and arguments list
    let options = {};
    let args = [];
    let op = '';
    argsWithStrings.forEach((a) => {
        if (op === '') {
            if (a.startsWith('-')) op = a;
            else args.push(a);
        } else {
            options[op.substring(1, 2)] = a;
            op = '';
        }
    });

    // Commands: help, list, add, edit, done, delete, tlist, tadd, tdelete, tedit
    switch (args[0]) {
        case 'help':
            help(message, args);
            break;
        case 'clear':
            $('#todo').text('');
            break;
        case 'config':
            config(message, args, options);
            break;
        case 'sync':
            sync(message, args);
            break;
        case 'list':
            list(message, args);
            break;
        default:
            write(message, `${message}: command not found`);
            break;
    }
}

function write(original, message, append = false) {
    if (append) $('#todo').append(`${message}<br>`);
    else
        $('#todo').append(
            `<span class="in-pre">[task-tab]$</span> <span class="pre">${original}</span><br>${message}<br>`
        );
    $('#todo').scrollTop($('#todo').get(0).scrollHeight);
}

function help(message, args) {
    if (args.length === 1)
        write(
            message,
            'Commands: help, list, add, edit, done, delete, tlist, tadd, tdelete, tedit<br>Use help [command] to see the help info for a specific command.'
        );
    else {
        if (args[1] === 'help') write(message, 'Help command: Lists out all possible commands.');
    }
}

async function sync(message, args) {
    if (args.length < 2) {
        write(message, 'Please specify the resource to sync.');
        return;
    }

    write(message, 'Syncing resources...');

    for (let i = 1; i < args.length; i++) {
        let a = args[i];
        if (a === 'todo') {
            const d = await fetch(backend);
            const todo = await d.json();
            window.state.todo = todo.todo;
            console.log(todo);

            const d2 = await fetch(`${backend}/settings`);
            const settings = await d2.json();

            window.state.tags = settings.tags;
            window.state.count = settings.count;
            list('list', ['list']);
        } else if (a === 'news') {
            const d3 = await fetch(`https://api.michaelzhao.xyz/news`);
            const news = await d3.json();
            window.state.news = news.results;
            writeNews();
        }
        write(message, `| Synced ${a} successfully!`, true);
    }
}

async function config(message, args, options) {
    if (args.length < 2) {
        write(message, 'Invalid argument length for config: needs at least 2 arguments');
        return;
    }

    if (args[1] === 'list') {
        const backend = await browser.storage.sync.get('backend');
        if (backend.backend !== undefined) write(message, `Backend URL: ${backend.backend}`);
        else
            write(
                message,
                'Error: No backend URL defined. Use the [config backend] command to define.'
            );
    } else if (args[1] === 'backend') {
        if (args.length > 2) {
            await browser.storage.sync.set({ backend: args[2] }).catch((error) => {
                console.error(error);
            });
            write(message, `Set backend URL to ${args[2]}. Please reload the page.`);
            return;
        } else {
            write(message, 'Error: No backend URL defined');
            return;
        }
    }
}

function list(message, args) {
    if (window.state.todo === null) {
        write(message, 'No todos found :(');
        return;
    }

    window.state.todo.forEach((t, i) => {
        const dueDateUrgency = calcDueDateUrgency(t.due);
        const formattedDueDate = formatDueDate(t.due);
        const priorityStars = createPriorityStars(t.priority);
        const tagList = createTagList(t.tags, window.state.tags);
        display.append($(priorityStars));
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

function add(message, args, options) {}

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
    return `<span class="p${priority}">${'*'.repeat(
        priority
    )}</span><span class="p-grey">${'*'.repeat(grey)}</p>`;
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

async function savePopup() {
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
