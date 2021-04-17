import Todo from './todo';
import News from './news';
import Time from './time';

import './app.css';

function App() {
    return (
        <div className="app">
            <div className="app-vert">
                <Todo className="app-left section"></Todo>
                <div className="app-right">
                    <Time className="app-time section"></Time>
                    <News className="app-news section"></News>
                </div>
            </div>
        </div>
    );
}

export default App;
