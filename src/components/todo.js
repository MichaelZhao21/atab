import React from 'react';
import TodoItem from './todo-item';
import './todo.css';

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { sortingMethod: 'PRIORITY' };
    }

    render() {
        if (this.props.data === null) return <div className={this.props.className}>Loading...</div>;
        const todoList = this.props.data.map((d, i) => (
            <TodoItem
                data={d}
                key={`${i}-${d.name}`}
                tags={this.props.tags}
                openPopup={this.props.openPopup}></TodoItem>
        ));

        return (
            <div className={`todo ${this.props.className}`}>
                <div className="todo-button-list">
                    <button className="todo-button sort">
                        <span className="todo-sort">SORT&nbsp;</span>
                        {this.state.sortingMethod}
                    </button>
                    <button className="todo-button task-count">
                        <span className="todo-task-count">TASKS&nbsp;</span>
                        {this.props.data.length.toString().padStart(5, '0')}
                    </button>
                    <button
                        className="todo-button add-task"
                        onClick={this.props.openPopup.bind(this, 1, null)}>
                        ADD TASK
                    </button>
                    <button className="todo-button edit-tags">EDIT TAGS</button>
                </div>
                <div className="todo-list">{todoList}</div>
            </div>
        );
    }
}

export default Todo;
