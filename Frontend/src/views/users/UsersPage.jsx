import React from 'react'
import { useNavigate, useParams } from 'react'
import { Container } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

const UsersPage = () => {

    let {token} = useParams()
        const navigate = useNavigate()

        useEffect (() => {
        if (token !== undefined) {
            localStorage.setItem('userLogin', token)
            navigate('/home')
        }
        if (localStorage.getItem('userLogin') === null) {
            navigate('/login')
        }
        return (
           <Container>
           
           </Container>
        )
    }
)}


export default UsersPage