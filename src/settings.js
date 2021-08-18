import $ from 'jquery';
import colors from './files/colors.json';
import icons from './files/icons.json';
import './css/settings.css';

export async function createSettings() {
    const data = await browser.storage.sync.get(['color', 'scale', 'links']);
    const prevId = data.color ? data.color : 0;
    const prevScale = data.scale ? data.scale : 100;
    const prevLinks = data.links ? data.links : '';
    setColor(prevId);
    scaleView(prevScale);
    setLinks(prevLinks);

    const gradientList = colors.map((c) =>
        $('<div>')
            .addClass(`color-option ${prevId === c.id ? 'active-color' : ''}`)
            .on('click', changeColor.bind(this, c.id))
            .css('--start', c.start)
            .css('--end', c.end)
    );

    const scaleLabel = $('<p>').addClass('label').attr('id', 'scale-label').text('Scale (%)');
    const scale = $('<input>').attr('id', 'scale').val(prevScale).on('blur', changeScale);
    const scaleInput = $('<div>').addClass('input-box').append([scaleLabel, scale]);
    const scaleError = $('<p>').addClass('error').attr('id', 'scale-error');
    const spacer = $('<div>').addClass('spacer');
    const linksLabel = $('<p>')
        .addClass('label')
        .attr('id', 'links-label')
        .text('Links · Format: [url] [icon] · ');
    linksLabel.append(
        $('<a>')
            .addClass('label')
            .attr('href', 'https://fonts.google.com/icons')
            .attr('target', '_blank')
            .text('Find icons here')
    );
    const linksEdit = $('<textarea>').attr('id', 'links-edit').val(prevLinks);
    const linksSubmit = $('<button>')
        .attr('id', 'links-submit')
        .text('Set Links')
        .on('click', changeLinks);
    const linksError = $('<p>').addClass('error').attr('id', 'links-error');

    const formWrapper = $('<div>')
        .attr('id', 'form-wrapper')
        .append([
            ...gradientList,
            spacer,
            scaleInput,
            scaleError,
            linksLabel,
            linksEdit,
            linksError,
            linksSubmit,
        ]);
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
    $('html').css('font-size', `${(Number(scale) / 100) * 16}px`);
}

async function changeScale(event) {
    $('#scale-error').empty();
    if (isNaN(Number(event.target.value))) $('#scale-error').text('Please enter a number');
    else {
        browser.storage.sync.set({ scale: event.target.value });
        scaleView(event.target.value);
    }
}

async function changeLinks() {
    setLinks($('#links-edit').val());
}

function setLinks(linkText) {
    let error = '';
    const linkList = [];

    linkText.split('\n').forEach((l, i) => {
        const split = l.split(' ');
        if (split.length !== 2 || !icons.find((i) => i === split[1])) error += `${i + 1}, `;
        else linkList.push({ href: split[0], icon: split[1] });
    });

    $('#links-error').empty();
    if (error !== '')
        $('#links-error').text(`Error on line(s): ${error.substring(0, error.length - 2)}`);

    $('#sidebar').empty();
    linkList.forEach((l) => {
        $('#sidebar').append(
            $('<a>')
                .addClass('sidebar-item')
                .attr('href', l.href)
                .append($('<span>').addClass('material-icons-outlined').text(l.icon))
        );
    });

    browser.storage.sync.set({ links: linkText });
}
