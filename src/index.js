import $ from 'jquery';
import { writeNews } from './news';
import { startTime } from './time';
import './css/index.css';

$(async () => {
    startTime();
    writeNews();
});
