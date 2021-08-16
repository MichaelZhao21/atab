import $ from 'jquery';
import './css/notes.css';

export async function writeNotes() {
    const data = await browser.storage.sync.get('notes');
    const notes = data && data.notes ? data.notes : '';

    const notesComponent = $('<textarea>');
    notesComponent.attr('id', 'notes-edit');
    notesComponent.val(notes);

    const saveButton = $('<button>');
    saveButton.attr('id', 'save-button');
    const saveButtonIcon = $('<span>');
    saveButtonIcon.attr('id', 'save-icon');
    saveButtonIcon.addClass('material-icons-outlined');
    saveButtonIcon.text('save');
    saveButton.append(saveButtonIcon);
    saveButton.on('click', save);

    const notesWrapper = $('#notes-wrapper');
    notesWrapper.empty();
    notesWrapper.append(notesComponent);
    notesWrapper.append(saveButton);
}

async function save() {
    const saveButtonIcon = $('#save-icon');
    saveButtonIcon.text('cloud_upload');

    await browser.storage.sync.set({ notes: $('#notes-edit').val() });
    saveButtonIcon.text('check');
    setTimeout(() => { saveButtonIcon.text('save') }, 3000);
}
