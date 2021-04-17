import React from 'react';
import './article.css';

class Article extends React.Component {
    pad = (n) => (n < 10 ? `0${n}` : n);

    openArticle = () => {
        window.open(this.props.url, '_self');
    };

    render() {
        let subtitle = this.props.abstract;
        if (subtitle === '') subtitle = this.props.byline;

        return (
            <div className={`article ${this.props.className}`} onClick={this.openArticle}>
                <p className="article-number">{this.pad(this.props.index)}</p>
                <div className="article-right">
                    <p className="article-title">{this.props.title}</p>
                    <p className="article-subtitle">{subtitle}</p>
                </div>
            </div>
        );
    }
}

export default Article;
