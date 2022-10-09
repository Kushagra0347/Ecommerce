import React, { useState, useEffect } from "react";
// React Redux
import { useDispatch, useSelector } from "react-redux";
// React Bootstrap
import { Row, Col, Button, Form } from "react-bootstrap";
// Mine
import Loader from "../components/Loader";
import Message from "../components/Message";
import { editUserProfile, getUserDetails } from "../actions/userActions";
import { USER_EDIT_PROFILE_RESET } from "../constants/userConstants";

function ProfileScreen({ history }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const userDetail = useSelector((state) => state.userDetail);
  const { loading, error, user } = userDetail;

  const userEditProfile = useSelector((state) => state.userEditProfile);
  const { success } = userEditProfile;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  function submitHandler(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(
        editUserProfile({
          id: user._id,
          name,
          email,
          password,
        }),
      );
      setMessage("");
    }
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_EDIT_PROFILE_RESET });
        dispatch(getUserDetails("profile"));
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [history, userInfo, dispatch, user, success]);

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {loading ? (
          <Loader />
        ) : (
          <>
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
                />
              </Form.Group>

              <Button className='my-4' type='submit' variant='primary'>
                Update
              </Button>
            </Form>
            {/* <Row className='py-3'>
              <Col>
                Already a Customer?{" "}
                <Link
                  to={
                    redirect !== "" ? `/login?redirect=${redirect}` : "/login"
                  }>
                  Login Now!
                </Link>
              </Col>
            </Row> */}
          </>
        )}
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
      </Col>
    </Row>
  );
}

export default ProfileScreen;
