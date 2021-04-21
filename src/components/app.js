import React from 'react';
import Todo from './todo';
import News from './news';
import Time from './time';

import './app.css';
import Popup from './popup';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todo: null,
            news: null,
            tags: null,
            popupOpen: false,
            popupId: 0,
            popupData: null,
            backend: null,
        };
    }

    /**
     * Opens the popup
     * @param {number} id The ID of the popup to open
     * @param {object} data The data to send to the popup
     */
    openPopup = (id, data) => {
        this.setState({ popupOpen: true, popupId: id, popupData: data });
    };

    closePopup = () => {
        this.setState({ popupOpen: false, popupId: 0 });
    };

    async componentDidMount() {
        const backend = 'http://localhost:8080/';
        this.setState({ backend });

        fetch(`${backend}/todo`).then(async (d) => {
            this.setState({ todo: await d.json() });
        });
        fetch(`${backend}/news`).then(async (d) => {
            const newsData = await d.json();
            this.setState({ news: newsData.results });
        });
        fetch(`${backend}/todo/settings`).then(async (d) => {
            const settings = await d.json();
            this.setState({ tags: settings.tags });
        });
    }

    render() {
        return (
            <div className="app">
                <Popup
                    open={this.state.popupOpen}
                    id={this.state.popupId}
                    data={this.state.popupData}
                    tags={this.state.tags}
                    openPopup={this.openPopup}
                    closePopup={this.closePopup}
                    backend={this.state.backend}></Popup>
                <div className="app-vert">
                    <Todo
                        className="app-left section"
                        data={this.state.todo}
                        tags={this.state.tags}
                        openPopup={this.openPopup}></Todo>
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
