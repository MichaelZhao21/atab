import React from 'react';
import Todo from './todo';
import News from './news';
import Time from './time';

import './app.css';
import Popup from './popup';

const BACKEND = 'http://localhost:8080';
const USER = 'michael';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { todo: null, news: null, popupOpen: false, popupId: 0, popupData: null };
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
        fetch(`${BACKEND}/todo/${USER}`).then(async (d) => {
            this.setState({ todo: await d.json() });
        });
        fetch(`${BACKEND}/news`).then(async (d) => {
            const newsData = await d.json();
            this.setState({ news: newsData.results });
        });
    }

    render() {
        return (
            <div className="app">
                <Popup
                    open={this.state.popupOpen}
                    id={this.state.popupId}
                    data={this.state.popupData}
                    openPopup={this.openPopup}
                    closePopup={this.closePopup}></Popup>
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
