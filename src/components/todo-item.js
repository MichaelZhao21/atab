import dayjs from 'dayjs';
import React from 'react';
import './todo-item.css';

class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { show: false };
    }
    // 0 for non-existent, 1 for > month, 2 for > week, 3 for > day, 4 for same day, 5 for OVERDUE!
    calcDueDateUrgency = () => {
        if (this.props.data.due === 0) return 0;

        const diff = this.props.data.due - new dayjs().startOf('day').subtract(1, 'day').valueOf();
        console.log(diff);
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

    render() {
        const dueDateUrgency = this.calcDueDateUrgency();
        const formattedDueDate = this.formatDueDate();
        const priorityStars = this.createPriorityStars();
        const showDropdown = this.state.show ? 'show' : '';
        return (
            <div className="todo-item">
                <div className="todo-item-display">
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
                <div className={`todo-item-dropdown ${showDropdown}`}>hi</div>
            </div>
        );
    }
}

export default TodoItem;
