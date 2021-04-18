import React from 'react';
import './popup.css';

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { disabled: false };
    }
    cancelButton = () => {
        this.props.closePopup();
    };

    saveButton = async () => {
        this.setState({ disabled: true });
        // Save stuff
        this.props.closePopup();
    };

    render() {
        const open = this.props.open ? 'open' : '';
        return (
            <div className={`popup section ${open}`}>
                <p className="popup-title">This is a popup!</p>
                <div className="popup-button-container">
                    <button className="popup-cancel popup-button" onClick={this.cancelButton}>
                        Cancel
                    </button>
                    <div className={`popup-type-container 1`}>
                        
                    </div>


                    <button
                        className="popup-save popup-button"
                        onClick={this.saveButton}
                        disabled={this.state.disabled}>
                        Save
                    </button>
                </div>
            </div>
        );
    }
}

export default Popup;
