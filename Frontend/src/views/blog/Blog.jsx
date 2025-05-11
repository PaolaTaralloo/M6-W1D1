import React, { useEffect, useState } from "react";
import { Container, Image, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import axios from 'axios';
import "./styles.css";
import CommentSection from '../../components/comments/CommentSection';

const Blog = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/posts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setBlog(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Errore nel caricamento del post');
        setLoading(false);
        if (error.response?.status === 404) {
          navigate("/404");
        }
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (loading) return <Spinner animation="border" className="d-block mx-auto" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!blog) return <Alert variant="info">Post non trovato</Alert>;

  return (
    <div className="blog-details-root">
      <Container>
        <Image className="blog-details-cover" src={blog.cover} fluid />
        <h1 className="blog-details-title">{blog.title}</h1>

        <div className="blog-details-container">
          <div className="blog-details-author">
            <BlogAuthor {...blog.author} />
          </div>
          <div className="blog-details-info">
            <div>{new Date(blog.createdAt).toLocaleDateString()}</div>
            <div>{`lettura da ${blog.readTime?.value} ${blog.readTime?.unit}`}</div>
            <div style={{ marginTop: 20 }}>
              <BlogLike defaultLikes={["123"]} onChange={console.log} />
            </div>
          </div>
        </div>

        <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
        
        {/* Aggiungi la sezione commenti */}
        <CommentSection postId={id} />
      </Container>
    </div>
  );
};

export default Blog;
