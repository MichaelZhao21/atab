import $ from 'jquery';
import icons from './icons.json';
import { randInt } from './util';
import './css/smile.css';

export function drawSmile() {
    const mainIcon = $('<span>');
    mainIcon.attr('id', 'main-icon');
    mainIcon.addClass('material-icons-outlined');
    mainIcon.on('click', setRandomText);
    const iconName = $('<p>');
    iconName.attr('id', 'icon-name');
    $('#smile-wrapper').empty().append(mainIcon).append(iconName);
    setRandomText();
}

function setRandomText() {
    const icon = icons[randInt(0, icons.length)];
    $('#main-icon').text(icon);
    $('#icon-name').text(icon);
}
