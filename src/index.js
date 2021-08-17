import $ from 'jquery';
import { writeNews } from './news';
import { writeNotes } from './notes';
import { startTime } from './time';
import { drawSmile } from './smile';
import { createSettings, createSidebar } from './settings';
import './css/index.css';
import './css/sidebar.css';

const titleMap = { news: 'News', notes: 'Notes', smile: ':)', settings: 'Settings' };

$(async () => {
    startTime();
    writeNews();
    writeNotes();
    drawSmile();
    createSettings();
    createSidebar();

    $('#article-button').on('click', handleClick.bind(this, 'news'));
    $('#edit-button').on('click', handleClick.bind(this, 'notes'));
    $('#emoji-button').on('click', handleClick.bind(this, 'smile'));
    $('#palette-button').on('click', handleClick.bind(this, 'settings'));
});

function handleClick(category) {
    $('#news-wrapper').addClass('hidden');
    $('#notes-wrapper').addClass('hidden');
    $('#smile-wrapper').addClass('hidden');
    $('#settings-wrapper').addClass('hidden');
    $(`#${category}-wrapper`).removeClass('hidden');

    $('#header-name').text(titleMap[category]);
}
