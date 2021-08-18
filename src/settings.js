import $ from 'jquery';
import colors from './files/colors.json';
import './css/settings.css';

export async function createSettings() {
    const data = await browser.storage.sync.get(['color', 'scale']);
    const prevId = data.color ? data.color : 0;
    const prevScale = data.scale ? data.scale : 100;
    setColor(prevId);
    scaleView(prevScale);

    const gradientList = colors.map((c) =>
        $('<div>')
            .addClass(`color-option ${prevId === c.id ? 'active-color' : ''}`)
            .on('click', changeColor.bind(this, c.id))
            .css('--start', c.start)
            .css('--end', c.end)
    );

    const scaleLabel = $('<p>').attr('id', 'scale-label').text('Scale (%)');
    const scale = $('<input>').attr('id', 'scale').val(prevScale).on('blur', changeScale);
    const scaleError = $('<p>').addClass('error').attr('id', 'scale-error');

    const formWrapper = $('<div>')
        .attr('id', 'form-wrapper')
        .append([...gradientList, scaleLabel, scale, scaleError]);
    $('#settings-wrapper').empty().append(formWrapper);
}

async function changeColor(id) {
    setColor(id);
    await browser.storage.sync.set({ color: id });
    createSettings();
}

function setColor(id) {
    const color = colors.find((c) => c.id === id);
    $('body').css('--start', color.start).css('--end', color.end);
}

function scaleView(scale) {
    $('html').css('font-size', `${Number(scale) / 100 * 16}px`);
}

async function changeScale(event) {
    $('#scale-error').empty();
    if (isNaN(Number(event.target.value))) $('#scale-error').text('Please enter a number');
    else {
        browser.storage.sync.set({ scale: event.target.value });
        scaleView(event.target.value);
    }
}

export async function createSidebar() {}
