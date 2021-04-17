import React from 'react';
import './popup.css';

class Popup extends React.Component {
    cancelButton = () => {
        this.props.closePopup();
    }
    saveButton = async () => {
        // Save stuff
        this.props.closePopup();
    }
    render() {
        const open = this.props.open ? 'open' : '';
        return (
            <div className={`popup section ${open}`}>
                <p className="popup-title">This is a popup!</p>
                <div className="popup-button-container">
                    <button className="popup-cancel popup-button" onClick={this.cancelButton}>Cancel</button>
                    <button className="popup-save popup-button" onClick={this.saveButton}>Save</button>
                </div>
            </div>
        );
    }
}

export default Popup;
