import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios'
import articles from "./article-content";
import CommentsList from "../components/CommentsList";
import AddCommentsForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";
import NotFoundPage from "./NotFoundPage";

const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: []});
    const { articleId }  = useParams();

    const { user, isLoarding} = useUser();

    useEffect(() => {
        const loadArticleInfo = async () => {
            const response = await axios.get(`/api/articles/${articleId}`);
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        }

        loadArticleInfo();
        }, []);
        

    
    const article = articles.find(article => article.name === articleId);

    const addUpvote = async () => {
        const response = await axios.put(`/api/articles/${articleId}/upvote`);
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);
    }

    if (!article) {
        return <NotFoundPage />
    }

    return (
        <>
        <h1>{article.title}</h1>
        <div>
            {user
                ? <button onClick={addUpvote}>Upvote</button>
                : <button>Log in to upvote</button>
            }
            <p>This article has {articleInfo.upvotes} upvote(s)</p>
        </div>
        {article.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
        ))}
        {user
            ? <AddCommentsForm
                articleName={articleId}
                onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)} />
            :   <button>Log in to add a comment</button>
        }
        <CommentsList comments={articleInfo.comments} />
        </>

    );
}

export default ArticlePage;