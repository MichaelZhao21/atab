window.state = { tags: null, todo: null, news: null, count: null };

$(document).ready(async () => {
    const data = await browser.storage.sync.get('wait');
    let wait = data.wait;
    if (wait === undefined) wait = 0;

    if (wait !== 0) write(null, `Waiting ${wait} ms before loading...`, true);
    setTimeout(setup, wait);
});

async function setup() {
    startTime();

    await sync('sync news todo', ['sync', 'news', 'todo']);
    list('list', ['list']);

    $('#cmd').keypress(runCommand);
}

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
        case 'add':
            add(message, args, options);
            break;
        case 'edit':
            edit(message, args, options);
            break;
        case 'delete':
            deleteTodo(message, args);
            break;
        case 'done':
            done(message, args);
            break;
        case 'tags':
        // TODO: Add tags command
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
            'Commands: help, sync, config, list, add, edit, done, delete<br>Use help [command] to see the help info for a specific command.'
        );
    else {
        if (args[1] === 'help') write(message, 'Help command: Lists out all possible commands.');
        else write(message, 'ERROR: Not a valid command that has information');
        // TODO: Add the rest of the commands here!
    }
}

async function sync(message, args) {
    const backend = await browser.storage.sync.get('backend');
    window.backend = backend.backend;

    if (backend.backend === undefined) {
        write(message, 'Please use the [config backend] command to specify a backend');
        return;
    }

    if (args.length < 2) {
        write(message, 'Please specify the resource to sync.');
        return;
    }

    write(message, 'Syncing resources...');

    // TODO: Change this so both fetches can happen at the same time
    for (let i = 1; i < args.length; i++) {
        let a = args[i];
        if (a === 'todo') {
            const d = await fetch(window.backend);
            try {
                const todo = await d.json();
                window.state.todo = todo.todo;
            } catch (error) {
                write(
                    message,
                    'ERROR: Invalid backend. Please use the config backend command to fix this issue.'
                );
                return;
            }

            const d2 = await fetch(`${window.backend}/settings`);
            const settings = await d2.json();

            window.state.tags = settings.tags;
            window.state.count = settings.count;
            $('#task-count').text(
                '0'.repeat(5 - String(window.state.todo.length).length) +
                    String(window.state.todo.length)
            );
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
        write(message, 'All config options:');
        const items = ['backend', 'wait', 'background-start', 'background-end'];
        const data = await browser.storage.sync.get(items);
        items.forEach((i) => {
            if (data[i] !== undefined) write(message, `| ${i}: ${data[i]}`, true);
            else write(message, `| ${i}: undefined`, true);
        });
    } else if (args[1] === 'backend') {
        if (args.length > 2) {
            await browser.storage.sync.set({ backend: args[2] }).catch((error) => {
                console.error(error);
            });
            write(message, `Set backend URL to ${args[2]}. Please reload the page.`);
            return;
        } else write(message, 'Error: No backend URL defined');
    } else if (args[1] === 'wait') {
        if (args.length > 2) {
            if (isNaN(args[2])) {
                write(message, `Error: Wait time is not a number [${args[2]}]`);
                return;
            }
            await browser.storage.sync.set({ wait: Number(args[2]) }).catch((error) => {
                console.error(error);
            });
            write(message, `Set load wait time to ${args[2]}.`);
            return;
        } else write(message, 'Error: No load wait time defined');
    }
}

function list(message, args) {
    if (window.state.todo === null || window.state.todo.length === 0) {
        write(message, 'No todos found :(');
        return;
    }

    // Sort
    const sortedList = [...window.state.todo].sort((a, b) => {
        if (a.priority === b.priority) return a.id - b.id;
        else return b.priority - a.priority;
    });

    // Trim
    let cutList = sortedList;
    if (args.length > 1 && args[1] > 0) cutList = sortedList.slice(0, args[1]);

    // Create output
    cutList.forEach((t, i) => {
        const dueDateUrgency = calcDueDateUrgency(t.due);
        const formattedDueDate = formatDueDate(t.due);
        const priorityStars = createPriorityStars(t.priority);
        const formattedId = createFormattedId(t.id);
        let out = `${formattedId} | ${priorityStars} | <span class="todo-due urgent-${dueDateUrgency}">${formattedDueDate}</span> | ${t.name}`;
        write(message, out, i !== 0);
    });
}

async function add(message, args, options) {
    const id = ++window.state.count;

    // Calculate due date
    // TODO: check for valid format of date
    // TODO: add ability to do today+1 or smth
    let due = 0;
    if (options.d === 'today') due = dayjs().startOf('day').valueOf();
    else if (options.d !== undefined) due = dayjs(options.d, 'MM-DD-YYYY').startOf('day').valueOf();

    // Split tags
    let tags = [];
    if (options.t !== undefined) tags = options.t.split(' ');

    // Create data obj
    const data = {
        id,
        name: options.n || '',
        due,
        priority: Number(options.p) || 1,
        description: options.m || '',
        tags,
    };

    await fetch(window.backend, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    });

    window.state.todo.push(data);
    window.state.count = id;

    write(message, `Successfully added item: ID ${id}`);
}

async function edit(message, args, options) {
    if (args.length !== 2) {
        write(message, 'ERROR: Edit command takes id as the one argument');
        return;
    }

    const id = Number(args[1]);
    const prev = window.state.todo.find((t) => t.id === id);
    if (prev === null || prev === undefined) {
        write(message, 'ERROR: Invalid ID');
        return;
    }

    // Date
    let due = prev.due;
    if (options.d === 'today') due = dayjs().startOf('day').valueOf();
    else if (options.d !== undefined) due = dayjs(options.d, 'MM-DD-YYYY').startOf('day').valueOf();

    // Split tags
    let tags = prev.tags;
    if (options.t !== undefined) tags = options.t.split(' ');

    // Create data obj
    const data = {
        id,
        name: options.n || prev.name,
        due,
        priority: Number(options.p) || prev.priority,
        description: options.m || prev.description,
        tags,
    };

    await fetch(`${window.backend}/${id}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    });

    const index = window.state.todo.findIndex((t) => t.id === id);
    window.state.todo[index] = data;

    write(message, `Successfully edited item: ID ${id}`);
}

async function deleteTodo(message, args) {
    if (args.length < 2) {
        write(message, 'ERROR: Specify an ID or list of IDs to delete');
        return;
    }

    write(message, 'Deleting specified todos...');
    for (var i = 1; i < args.length; i++) {
        const index = window.state.todo.findIndex((t) => t.id === Number(args[i]));
        if (index === -1) {
            write(message, `| Could not find ID ${args[i]} to delete, skipping`, true);
            continue;
        }
        await fetch(`${window.backend}/${args[i]}`, { method: 'DELETE' });
        window.state.todo.splice(index, 1);
        write(message, `| Deleted item: ID ${args[i]}`, true);
    }
}

async function done(message, args) {
    // TODO: Show list of finished tasks
    if (args.length < 2) {
        write(message, 'ERROR: Specify an ID or list of IDs to delete');
        return;
    }

    write(message, 'Marking complete...');
    for (var i = 1; i < args.length; i++) {
        const index = window.state.todo.findIndex((t) => t.id === Number(args[i]));
        if (index === -1) {
            write(message, `| Could not find ID ${args[i]} to mark as complete, skipping`, true);
            continue;
        }
        await fetch(`${window.backend}/done/${args[i]}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        window.state.todo.splice(index, 1);
        write(message, `| Completed item: ID ${args[i]}`, true);
    }
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
    return `<span class="p${priority}">${'*'.repeat(
        priority
    )}</span><span class="grey">${'*'.repeat(grey)}</span>`;
}

function createFormattedId(id) {
    const grey = 5 - String(id).length;
    return `<span class="grey">${'0'.repeat(grey)}</span>${id}`;
}
