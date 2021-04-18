import React from 'react';
import Article from './article';
import './news.css';

class News extends React.Component {
    createArticleList = () => {
        return this.props.data.map((d, i) => {
            return (
                <Article
                    title={d.title}
                    abstract={d.abstract}
                    byline={d.byline}
                    url={d.url}
                    index={i + 1}
                    key={`${d.title}-${i}`}></Article>
            );
        });
    };

    render() {
        if (this.props.data === null) return <div className={this.props.className}>Loading...</div>;
        const articleList = this.createArticleList();
        return <div className={`news ${this.props.className}`}>{articleList}</div>;
    }
}

export default News;
