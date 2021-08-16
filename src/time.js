import dayjs from 'dayjs';
import $ from 'jquery';

export function startTime() {
    setTime();
    window.setInterval(setTime, 1000);
}

function setTime() {
    const now = dayjs();
    const time = now.format('hh:mm:ss a');
    const date = now.format('dddd, MMMM DD, YYYY');
    $('#time').text(time);
    $('#date').text(date);
}