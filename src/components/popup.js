import dayjs from 'dayjs';
import React from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import './popup.css';

dayjs.extend(customParseFormat);
const BACKEND = 'http://localhost:8080';

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: true,
            disabled: false,
            showTags: false,
            name: '',
            dueM: '',
            dueD: '',
            dueY: '',
            priority: 1,
            description: '',
            tags: '',
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({ [target.name]: target.value });
    };

    toggleTags = () => {
        this.setState({ showTags: !this.state.showTags });
    };

    setToday = () => {
        this.setState({
            dueM: dayjs().format('MM'),
            dueD: dayjs().format('DD'),
            dueY: dayjs().format('YYYY'),
        });
    };

    cancelButton = () => {
        this.props.closePopup();
    };

    // TODO: Check the tags and filter no invalid/repeated
    saveButton = async () => {
        this.setState({ disabled: true });

        let due = 0;
        if (this.state.dueM !== '' && this.state.dueD !== '' && this.state.dueY !== '')
            due = dayjs(`${this.state.dueM}/${this.state.dueD}/${this.state.dueY}`, 'M/D/YYYY')
                .startOf('day')
                .valueOf();

        const data = {
            name: this.state.name,
            due,
            priority: this.state.priority,
            description: this.state.description,
            tags: this.state.tags.split(''),
        };

        if (this.state.id === '') {
            await fetch(`${BACKEND}/todo`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
        }

        window.location.reload();
    };

    resetState = (id, name, dueM, dueD, dueY, priority, description, tags) => {
        this.setState({
            id: id || '',
            name: name || '',
            dueM: dueM ? dayjs(dueM).format('MM') : '',
            dueD: dueD ? dayjs(dueD).format('DD') : '',
            dueY: dueY ? dayjs(dueY).format('YYYY') : '',
            priority: priority || 1,
            description: description || '',
            tags: tags ? tags.join(' ') : '',
        });
    };

    componentDidUpdate(prevProps) {
        if (this.props.open !== prevProps.open && this.props.open) {
            if (this.props.data === null) this.resetState();
            else
                this.resetState(
                    this.props.data._id,
                    this.props.data.name,
                    this.props.data.dueM,
                    this.props.data.dueD,
                    this.props.data.dueY,
                    this.props.data.priority,
                    this.props.data.description,
                    this.props.data.tags
                );
        }
    }

    render() {
        if (!this.props.open) return null;

        const open = this.props.open ? 'open' : '';
        const todoPopup = this.props.id === 1 ? 'open' : '';
        const tagsPopup = this.props.id === 2 ? 'open' : '';

        let tagList = 'Click to show all tags';
        if (this.state.showTags)
            tagList = this.props.tags.map((t) => `[${t.char}] ${t.text}`).join(', ');

        return (
            <div className={`popup section ${open}`}>
                {/* Edit todo section */}
                <div className={`popup-inner edit-todo ${todoPopup}`}>
                    <label htmlFor="name">Name</label>
                    <input
                        name="name"
                        className="name-input"
                        placeholder="Name of task"
                        type="text"
                        value={this.state.name}
                        onChange={this.handleInputChange}
                        autoFocus></input>
                    <br />
                    <label htmlFor="dueM">Due</label>
                    <button className="date-today" onClick={this.setToday}>
                        Today
                    </button>
                    <input
                        name="dueM"
                        className="date-input"
                        placeholder="MM"
                        type="text"
                        maxLength="2"
                        value={this.state.dueM}
                        onChange={this.handleInputChange}></input>
                    <div className="date-divider">/</div>
                    <input
                        name="dueD"
                        className="date-input"
                        placeholder="DD"
                        type="text"
                        maxLength="2"
                        value={this.state.dueD}
                        onChange={this.handleInputChange}></input>
                    <div className="date-divider">/</div>
                    <input
                        name="dueY"
                        className="date-input year"
                        placeholder="YYYY"
                        type="text"
                        maxLength="4"
                        value={this.state.dueY}
                        onChange={this.handleInputChange}></input>
                    <label htmlFor="priority" id="priority-label">
                        Priority
                    </label>
                    <input
                        name="priority"
                        className="priority-input"
                        placeholder="#"
                        type="number"
                        min="1"
                        max="5"
                        value={this.state.priority}
                        onChange={this.handleInputChange}></input>
                    <br />
                    <label htmlFor="tags">Tags</label>
                    <input
                        name="tags"
                        className="tags-input"
                        placeholder="List of tags"
                        type="text"
                        value={this.state.tags}
                        onChange={this.handleInputChange}></input>
                    <br />
                    <div className="tags-list" onClick={this.toggleTags}>
                        {tagList}
                    </div>
                    <label htmlFor="Description">Description</label>
                    <br />
                    <textarea
                        name="description"
                        className="description-input"
                        placeholder="Enter a description (optional)"
                        value={this.state.description}
                        onChange={this.handleInputChange}></textarea>
                </div>

                {/* Edit tags section */}
                <div className={`popup-inner edit-tags ${tagsPopup}`}></div>

                {/* Save */}
                <div className="popup-button-container">
                    <button className="popup-cancel popup-button" onClick={this.cancelButton}>
                        Cancel
                    </button>
                    <div className={`popup-type-container 1`}></div>

                    <button
                        className="popup-save popup-button"
                        onClick={this.saveButton}
                        disabled={this.state.disabled}>
                        Save
                    </button>
                </div>
            </div>
        );
    }
}

export default Popup;
