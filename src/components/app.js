import React from 'react';
import Todo from './todo';
import News from './news';
import Time from './time';

import './app.css';

const BACKEND = 'http://localhost:8080';
const USER = 'michael';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { todo: null, news: [] };
    }

    async componentDidMount() {
        const todo = await fetch(`${BACKEND}/todo/${USER}`).then((d) => d.json());
        const news = await fetch(`${BACKEND}/news`).then((d) => d.json());
        this.setState({ todo, news: news.results });
    }

    render() {
        return (
            <div className="app">
                <div className="app-vert">
                    <Todo className="app-left section" data={this.state.todo}></Todo>
                    <div className="app-right">
                        <Time className="app-time section"></Time>
                        <News className="app-news section" data={this.state.news}></News>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
