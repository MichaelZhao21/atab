import dayjs from 'dayjs';
import React from 'react';
import './todo-item.css';

class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dropdown: false };
    }

    // 0 for non-existent, 1 for > month, 2 for > week, 3 for > day, 4 for same day, 5 for OVERDUE!
    calcDueDateUrgency = () => {
        if (this.props.data.due === 0) return 0;

        const diff = this.props.data.due - new dayjs().startOf('day').subtract(1, 'day').valueOf();
        if (diff < 0) return 5;
        else if (diff > 2629800000) return 1;
        else if (diff > 604800000) return 2;
        else if (diff > 86400000) return 3;
        return 4;
    };

    formatDueDate = () => {
        if (this.props.data.due === 0) return 'DUE 00/00/00';
        return `DUE ${new dayjs(this.props.data.due).format('MM/DD/YY')}`;
    };

    createPriorityStars = () => {
        const stars = this.props.data.priority;
        const grey = 5 - stars;
        return `<span class="p${stars}">${'*'.repeat(stars)}</span>${'*'.repeat(grey)}`;
    };

    toggleDropdown = () => {
        this.setState({ dropdown: !this.state.dropdown });
    };

    createTagList = () => {
        if (this.props.tags === undefined || this.props.tags === null) return 'ERROR';

        let tagString = '';
        this.props.data.tags.forEach((t) => {
            let tag = this.props.tags.find((f) => f.char === t);
            tag = (tag === undefined) ? '[INVALID TAG]' : tag.text;
            tagString += tag + ', ';
        });
        return tagString.slice(0, -2);
    };

    render() {
        const dueDateUrgency = this.calcDueDateUrgency();
        const formattedDueDate = this.formatDueDate();
        const priorityStars = this.createPriorityStars();
        const tagList = this.createTagList();
        const showDropdown = this.state.dropdown ? 'show' : '';

        return (
            <div className="todo-item">
                <div className="todo-item-display" onClick={this.toggleDropdown}>
                    <p
                        className="todo-text todo-priority"
                        dangerouslySetInnerHTML={{ __html: priorityStars }}></p>
                    <div className="todo-divider">|</div>
                    <p className={`todo-text todo-due urgent-${dueDateUrgency}`}>
                        {formattedDueDate}
                    </p>
                    <div className="todo-divider">|</div>
                    <p
                        className="todo-text todo-tag"
                        dangerouslySetInnerHTML={{
                            __html: this.props.data.tags[0] || '&nbsp',
                        }}></p>
                    <div className="todo-divider">|</div>
                    <p
                        className="todo-text todo-tag"
                        dangerouslySetInnerHTML={{
                            __html: this.props.data.tags[1] || '&nbsp',
                        }}></p>
                    <div className="todo-divider">|</div>
                    <p
                        className="todo-text todo-tag"
                        dangerouslySetInnerHTML={{
                            __html: this.props.data.tags[2] || '&nbsp',
                        }}></p>
                    <div className="todo-divider">|</div>
                    <p className="todo-text todo-name">{this.props.data.name}</p>
                </div>
                <div className={`todo-item-dropdown ${showDropdown}`}>
                    <div
                        className="todo-item-arrow"
                        onClick={this.props.openPopup.bind(this, 1, this.props.data)}>
                        {'>'}
                    </div>
                    <div className="todo-item-dropdown-right">
                        <p className="todo-item-title">{this.props.data.name}</p>
                        <p className="todo-item-tags">
                            <span className="todo-item-tags-label">Tags:&nbsp;</span>
                            {tagList}
                        </p>
                        <p className="todo-item-description">{this.props.data.description}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default TodoItem;
