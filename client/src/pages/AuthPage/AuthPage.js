import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, Redirect } from "react-router-dom";

import {
  Col,
  Row,
  Card,
  Form,
  Modal,
  Button,
  Container,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import "./style.css";

import { authActions } from "../../redux/actions";

import Footer from "../../components/Footer";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FB_APP_ID = process.env.REACT_APP_FB_APP_ID;
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function RegisterPage() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const [birthDate, setBirthDate] = useState(new Date());
  const [gender, setGender] = useState("female");

  const onToggleModal = (e) => {
    e.preventDefault();
    setShow(!show);
  };

  const onLogin = (e) => {
    e.preventDefault();
    dispatch(authActions.loginRequest(user.email, user.password));
  };

  const onChange = (e) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };

  if (isAuthenticated) return <Redirect to='/' />;

  const onRegister = (e) => {
    e.preventDefault();
    dispatch(
      authActions.register(
        user.name,
        user.email,
        user.password,
        birthDate,
        gender
      )
    );
  };

  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Coderbook - Login or Sign Up</title>
        <link rel='canonical' href='http://mysite.com/example' />
      </Helmet>
      <Container
        fluid
        className='min-vh-100 d-flex flex-column align-items-center justify-content-center'
      >
        <Row>
          <Col className='d-flex flex-column justify-content-center align-items-center align-items-md-start'>
            <h1 className='text-primary text-sm-left'>coderbook</h1>
            <p className='header'>
              Coderbook let's you share with your friends and family.
            </p>
          </Col>
          <Col className='d-flex justify-content-center align-items-center'>
            <Card style={{ width: "30rem" }} className='p-3 box-shadow'>
              <Form className='d-flex flex-column justify-content-center align-content-center text-align-center'>
                <Form.Group controlId='email'>
                  <Form.Control
                    type='email'
                    onChange={onChange}
                    placeholder='Email or Phone Number'
                  />
                </Form.Group>
                <Form.Group controlId='password'>
                  <Form.Control
                    type='password'
                    placeholder='Password'
                    onChange={onChange}
                  />
                </Form.Group>
                <Form.Group className='mr-auto' controlId='formBasicPassword'>
                  <Link className='' to='#'>
                    <small className='text-muted'>Forgot Password ?</small>
                  </Link>
                </Form.Group>
                <Button
                  block
                  type='submit'
                  variant='primary'
                  onClick={onLogin}
                  className='font-weight-bold'
                >
                  Login
                </Button>
                <h6 className='text-muted text-center mt-1'>Or</h6>
                <Row>
                  <Col>
                    <GoogleLogin
                      className='py-1'
                      clientId={GOOGLE_CLIENT_ID}
                      buttonText='GOOGLE'
                      onSuccess={(u) => {
                        console.log("u", u);
                        dispatch(authActions.loginGoogleRequest(u));
                      }}
                      onFailure={() => console.log("Google Login Failure")}
                    />
                  </Col>
                  <Col className='text-right'>
                    <FacebookLogin
                      textButton='Facebook'
                      appId={FB_APP_ID}
                      icon='fa-facebook'
                      fields='name,email,picture'
                      callback={(u) =>
                        dispatch(authActions.loginFacebookRequest(u))
                      }
                      onFailure={() => console.log("Facebook Login Failure")}
                    />
                  </Col>
                </Row>
                <hr className='hr' />
                <Button
                  type='submit'
                  variant='success'
                  onClick={onToggleModal}
                  className='mx-auto w-50 font-weight-bold'
                >
                  Create an account
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal
        show={show}
        dialogClassName='modal-90w'
        onHide={() => setShow(false)}
        aria-labelledby='example-custom-modal-styling-title'
        className='d-flex align-items-center justify-content-center'
      >
        <Modal.Header>
          <Modal.Title>
            Sign Up
            <p className='text-secondary font-weight-light p-modal'>
              It's quick and easy.
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* STEP 1 */}
          <Form
            onSubmit={onRegister}
            className='d-flex flex-column justify-content-center'
          >
            <Form.Row>
              <Form.Group as={Col} controlId='name'>
                <Form.Control
                  type='text'
                  placeholder='Name'
                  onChange={onChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId='email'>
                <Form.Control
                  type='email'
                  placeholder='Email'
                  onChange={onChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId='password'>
                <Form.Control
                  type='password'
                  placeholder='Password'
                  onChange={onChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Label>
              <span className='text-muted h6'>Date of birth</span>
            </Form.Label>

            <DatePicker
              className='border-light mb-3'
              showYearDropdown
              scrollableYearDropdown
              selected={birthDate}
              onSelect={(date) => setBirthDate(date)}
            />

            <Form.Label>
              <span className='text-muted h6'>Gender</span>
            </Form.Label>

            <div
              className='row mb-2'
              onChange={(e) => setGender(e.target.value)}
            >
              <Col>
                <input
                  type='radio'
                  value='Male'
                  name='gender'
                  checked
                  className='mr-2'
                />
                Male
              </Col>
              <Col>
                <input
                  type='radio'
                  value='Female'
                  name='gender'
                  className='mr-2'
                />{" "}
                Female
              </Col>
              <Col>
                <input
                  type='radio'
                  value='Other'
                  name='gender'
                  className='mr-2'
                />{" "}
                Custom
              </Col>
            </div>

            <p className='text-center p-terms'>
              By clicking Sign Up, you agree to our Terms, Data Policy and
              Cookie Policy. You may receive SMS notifications from us and can
              opt out at any time.
            </p>
            <Button className='mx-auto w-50' variant='primary' type='submit'>
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Footer />
    </div>
  );
}
