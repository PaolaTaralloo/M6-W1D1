import React from 'react'
import { Container } from 'react-bootstrap'

import RegisterFormComp from '../../components/register/RegisterFormComp'

const RegisterPage = () => {
  return (
    
    <Container>
      <h1 className="login-main-title mb-3">Registrati con un nuovo account</h1>
      <RegisterFormComp />
    </Container>
  
  )
}

export default RegisterPage