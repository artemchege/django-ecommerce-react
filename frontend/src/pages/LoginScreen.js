import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Loader from "../components/Loader";
import AlertMessage from "../components/AlertMessage";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../actions/userActions'

function LoginScreen({location, history}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const dispatch = useDispatch();
    const userLogin = useSelector(state => state.userLogin)
    const {loading, userInfo, error} = userLogin

    useEffect(() => {
        if(userInfo) {
            history.push(redirect)
        }
    }, [userInfo, redirect, error])

    const submitHander = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    return (
        <FormContainer>
            <h1 className='my-4'>Sign in</h1>
            { error && <AlertMessage variant="danger" className="my-4">Oops! {error}</AlertMessage>}
            { loading  && <Loader/> }
            <Form onSubmit={submitHander} className='my-4'>

                <Form.Group controlId='email'>
                    <Form.Label>
                        Email address
                    </Form.Label>
                    <Form.Control type='email' placeholder='Enter email' value={email} onChange={((e) => setEmail(e.target.value))}>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>
                        Password
                    </Form.Label>
                    <Form.Control type='password' placeholder='Enter password' value={password} onChange={((e) => setPassword(e.target.value))}>
                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Sign In
                </Button>

            </Form>

            <Row>
                <Col>
                    New? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Registration</Link>
                </Col>
            </Row>
        </FormContainer>

    )
}

export default LoginScreen
