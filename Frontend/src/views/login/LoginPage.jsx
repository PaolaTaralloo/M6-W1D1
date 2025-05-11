import React from 'react'
import { Container } from 'react-bootstrap'
import LoginFormComp from '../../components/login/LoginFormComp'


const LoginPage = () => {
  return (
  
    <Container >
      <h1 className="login-main-title mb-3">Accedi al tuo account</h1>
      <LoginFormComp />
    </Container>
   
  )
}

export default LoginPage