import React from 'react';
import './time.css';

class Time extends React.Component {
    render() {
        return (
            <div className={`time ${this.props.className}`}>Time Section</div>
        )
    }
}

export default Time;