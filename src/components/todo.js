import React from 'react';
import './todo.css';

class Todo extends React.Component {
    render() {
        return (
            <div className={`todo ${this.props.className}`}>Todo Section</div>
        )
    }
}

export default Todo;