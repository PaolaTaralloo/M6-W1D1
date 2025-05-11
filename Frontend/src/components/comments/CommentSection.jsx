import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import './styles.css'; 

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts/${postId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      console.log('Comments received:', response.data); // Debug log
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Errore nel caricamento dei commenti');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/${postId}/comments`,
        { 
          text: newComment,
          author: JSON.parse(localStorage.getItem('user'))._id // Aggiungi l'ID dell'autore
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNewComment('');
      await fetchComments(); // Ricarica i commenti dopo l'aggiunta
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Errore nell\'invio del commento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="mt-5">
      <h3>Commenti</h3>
      
      {/* Form per nuovo commento */}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Scrivi un commento..."
          />
        </Form.Group>
        <Button 
          type="submit" 
          variant="primary" 
          className="mt-2"
          disabled={loading || !newComment.trim()}
        >
          {loading ? 'Invio...' : 'Invia commento'}
        </Button>
      </Form>

      {/* Lista commenti */}
      {error && <Alert variant="danger">{error}</Alert>}
      <ListGroup>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <ListGroup.Item key={comment._id} className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong className="text-primary">
                  {comment.author ? `${comment.author.name} ${comment.author.surname}` : 'Utente Anonimo'}
                </strong>
                <small className="text-muted">
                  {new Date(comment.createdAt).toLocaleString()}
                </small>
              </div>
              <p className="mb-0">{comment.text}</p>
            </ListGroup.Item>
          ))
        ) : (
          <Alert variant="info">Nessun commento presente</Alert>
        )}
      </ListGroup>
    </div>
  );
};

export default CommentSection;