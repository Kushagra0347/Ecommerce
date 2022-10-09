import React, { useState, useEffect } from "react";
// React Router
import { Link } from "react-router-dom";
// React Redux
import { useDispatch, useSelector } from "react-redux";
// React Bootstrap
import { Row, Col, Button, Form } from "react-bootstrap";
// Mine
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";

function LoginScreen({ location, history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirect = location.search ? location.search.split("=")[1] : "";

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  function submitHandler(event) {
    event.preventDefault();
    dispatch(login(email, password));
  }

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  return (
    <FormContainer>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1>Sign In</h1>
          {error && <Message variant={"danger"}>{error}</Message>}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='email'>
              <Form.Label>Email: </Form.Label>
              <Form.Control
                type='email'
                name='email'
                placeholder='Enter Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='password'>
              <Form.Label>Password: </Form.Label>
              <Form.Control
                type='password'
                name='password'
                placeholder='Enter Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button className='my-4' type='submit' variant='primary'>
              Sign In
            </Button>
          </Form>
          <Row className='py-3'>
            <Col>
              New Customer?{" "}
              <Link
                to={
                  redirect !== ""
                    ? `/register?redirect=${redirect}`
                    : "/register"
                }>
                Register Now!
              </Link>
            </Col>
          </Row>
        </>
      )}
    </FormContainer>
  );
}

export default LoginScreen;
