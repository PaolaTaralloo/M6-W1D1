import React, { useState } from 'react'
import axios from 'axios'
import { Container, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'


const RegisterFormComp = () => {

    const [user, setUser] = useState({
        name: '',
        surname: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const navigate = useNavigate()


    const formHandler = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const formSubmitHandler = async (e) => {
        e.preventDefault()
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001'
        
        try {
            const response = await axios.post(`${apiUrl}/auth/register`, user)
            console.log('Registration response:', response.data)
            alert("Registrazione avvenuta con successo")
            navigate("/login")
        } catch (error) {
            console.error('Registration error details:', {
                message: error.message,
                response: error.response,
                url: apiUrl
            })
            setError(error.response?.data?.message || "Registrazione fallita")
        }
    }

    // Metodo con Fetch
    // const config = {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(user)
    // }
    // const res = await fetch(process.env.REACT_APP_API_URL + "/auth/register", config)
    // const data = await res.json()
    // console.log(data);
    // if (res.status === 200) {
    //     alert("Registrazione avvenuta con successo")
    //     navigate("/login")
    // } else {
    //     alert("Registrazione fallita")
    // }

    return (
        <Container>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={formSubmitHandler}>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={user.name}
                        onChange={formHandler}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicSurname">
                    <Form.Label>Surname</Form.Label>
                    <Form.Control
                        type="text"
                        name="surname"
                        placeholder="Surname"
                        value={user.surname}
                        onChange={formHandler}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={user.email}
                        onChange={formHandler}
                        required
                    />

                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
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

                <Button variant="success" type="submit">Register</Button>
            </Form>
        </Container>
    )
}


export default RegisterFormComp