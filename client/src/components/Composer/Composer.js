import React, { useState } from "react";
import { Card, Form, Button, ButtonGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { postActions } from "../../redux/actions";
import { useDispatch } from "react-redux";

import "./style.css";

const ComposerButton = ({ title, icon, handleClick }) => {
  return (
    <Button
      value={title}
      className='d-flex justify-content-center align-items-center bg-light bg-white text-dark border-0 rounded-md'
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={icon} className='mr-2' size='lg' />
      {title}
    </Button>
  );
};

export default function Composer() {
  const [showInputFile, setShowInputFile] = useState(false);
  const [post, setPost] = useState({ body: "" });
  const dispatch = useDispatch();
  const onChange = (e) => {
    setPost({ ...post, [e.target.id]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(postActions.createPost(post.body));
    e.target.reset();
  };
  const handleShowInput = (e) => {
    console.log(e.target.value);
    if (e.target.value === "Photo Video") {
      setShowInputFile(!showInputFile);
    }
  };
  return (
    <Card className='mb-3 w-100 shadow composer-card'>
      <Card.Body className='px-3 pt-3'>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='body'>
            <Form.Control
              type='text'
              onChange={onChange}
              placeholder="What's on your mind?"
              className='border-0 rounded-md post-text'
            />
          </Form.Group>
        </Form>
      </Card.Body>

      <hr className='mt-0' />
      <ButtonGroup size='lg' className='m-2'>
        <ComposerButton title='Live Video' icon='video' />
        <ComposerButton
          title='Photo Video'
          icon='photo-video'
          handleClick={handleShowInput}
        />
        <ComposerButton title='Feeling/Activity' icon='smile' />
      </ButtonGroup>
    </Card>
  );
}
