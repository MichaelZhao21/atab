import dayjs from 'dayjs';
import React from 'react';
import './time.css';

class Time extends React.Component {
    constructor(props) {
        super(props);
        this.state = { time: null, date: null, interval: 0 };
    }

    setNow = () => {
        const now = dayjs();
        const time = now.format('hh:mm:ss a');
        const date = now.format('dddd, MMMM DD, YYYY');
        this.setState({ time, date });
    };

    componentDidMount() {
        this.setNow();
        window.setTimeout(() => {
            const interval = window.setInterval(this.setNow, 1000);
            this.setState({ interval });
        }, 1500 - dayjs().get('ms')); // Offset change time to sync with computer
    }

    componentWillUnmount() {
        window.clearInterval(this.state.interval);
    }

    render() {
        return (
            <div className={`time ${this.props.className}`}>
                <div className="time-time">{this.state.time}</div>
                <div className="time-date">{this.state.date}</div>
            </div>
        );
    }
}

export default Time;
