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
import { register } from "../actions/userActions";

function RegisterScreen({ location, history }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const redirect = location.search ? location.search.split("=")[1] : "";

  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  function submitHandler(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(register(name, email, password));
    }
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
          <h1>Sign Up</h1>
          {message && <Message variant={"danger"}>{message}</Message>}
          {error && <Message variant={"danger"}>{error}</Message>}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name: </Form.Label>
              <Form.Control
                type='text'
                name='name'
                placeholder='Enter Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='email'>
              <Form.Label>Email: </Form.Label>
              <Form.Control
                type='email'
                name='email'
                placeholder='Enter Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                required
              />
            </Form.Group>

            <Form.Group controlId='confirmPassword'>
              <Form.Label>Confirm Password: </Form.Label>
              <Form.Control
                type='password'
                name='confirm-password'
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button className='my-4' type='submit' variant='primary'>
              Sign Up
            </Button>
          </Form>
          <Row className='py-3'>
            <Col>
              Already a Customer?{" "}
              <Link
                to={redirect !== "" ? `/login?redirect=${redirect}` : "/login"}>
                Login Now!
              </Link>
            </Col>
          </Row>
        </>
      )}
    </FormContainer>
  );
}

export default RegisterScreen;
