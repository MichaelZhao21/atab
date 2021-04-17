import React from 'react';
import './news.css';

class News extends React.Component {
    render() {
        return <div className={`news ${this.props.className}`}>News Section</div>;
    }
}

export default News;
