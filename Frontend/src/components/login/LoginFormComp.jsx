import React, { useState } from 'react'
import { Container, Button, Form, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/authService'

const LoginForm = () => { 
  const [user, setUser] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const formHandler = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const formSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await authService.login(user)
      console.log('Login successful:', response)
      
      if (response.token) {
        localStorage.setItem('token', response.token)
        console.log('Token salvato:', localStorage.getItem('token'))
      }
      
      alert("Login avvenuto con successo")
      navigate("/")
    } catch (error) {
      console.error('Login error:', error)
      setError(error.response?.data?.message || "Login fallito")
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`
  }

  return (
    <Container>
    {error && <Alert variant="danger">{error}</Alert>}
    <Form onSubmit={formSubmitHandler}> 
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control 
          type="email" 
          name="email"
          placeholder="Enter email" 
          value={user.email}
          onChange={formHandler}
          required 
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control 
          type="password" 
          name="password"
          placeholder="Password" 
          value={user.password}
          onChange={formHandler}
          required 
        />
      </Form.Group>
      <Button variant="dark" type="submit" className='w-100' >Login</Button>
      <Button variant="primary" type="button" className='w-100 mt-4' onClick={handleGoogleLogin} href='https://m6-w1d1.onrender.com/auth/google'>Google Login</Button>
     
    </Form>

  </Container>
)
}



export default LoginForm