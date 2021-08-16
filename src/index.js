import $ from 'jquery';
import { writeNews } from './news';
import { writeNotes } from './notes';
import { startTime } from './time';
import './css/index.css';

const titleMap = { news: 'News', notes: 'Notes', smile: ':)', settings: 'Settings' };

$(async () => {
    startTime();
    writeNews();
    writeNotes();

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
