import React, { useEffect, useState } from "react";
import { Col, Row, Alert, Spinner } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";
import axios from 'axios';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Errore nel caricamento dei posts');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <Spinner animation="border" className="d-block mx-auto" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!posts.length) return <Alert variant="info">Nessun post disponibile</Alert>;

  return (
    <Row>
      {posts.map((post) => (
        <Col
          key={post._id}
          md={4}
          style={{
            marginBottom: 50,
          }}
        >
          <BlogItem {...post} />
        </Col>
      ))}
    </Row>
  );
};

export default BlogList;
