import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Nav,
  Button,
  Container,
  ButtonGroup,
  Card,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";

import "./style.css";

import Composer from "../../components/Composer/Composer";
import { postActions } from "../../redux/actions/post.actions";
import Post from "../../components/Post";
import InfiniteScroll from "react-infinite-scroll-component";

export default function ProfilePage() {
  const currentUser = useSelector((state) => state.auth.user);
  const posts = useSelector((state) => state.post.posts);
  const totalPages = useSelector((state) => state.post.totalPageNum);
  const currentPage = useSelector((state) => state.post.currentPage);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("running load post");
    console.log("id", currentUser?._id);
    if (currentUser?._id) {
      dispatch(postActions.postsRequest(1, 2, null, currentUser._id));
    }
  }, [dispatch, currentUser]);
  const handleDeletePost = (e) => {
    console.log(e.target.value);
    dispatch(postActions.deletePost(e.target.value));
  };

  console.log("currentUser", currentUser);
  return (
    <div>
      <Row className='centered hero'>
        <Container className='centered flex-column'>
          <img
            alt='lighthouse'
            className='position-relative img-fluid rounded-md'
            src='https://images.unsplash.com/photo-1507725914440-e1e434774828?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&w=2389&q=100'
          />
          <div className='centered position-relative'>
            <img
              alt='profile'
              className='position-absolute rounded-circle cover-profile-photo'
              src='https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg'
            />
          </div>
          <h2>{currentUser?.name}</h2>
        </Container>
        <hr className='w-75' />
      </Row>
      <Row className='rounded profile-nav bg-white'>
        <Container className='centered'>
          <Container>
            <Nav
              activeKey='/posts'
              onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
            >
              <Nav.Item>
                <Nav.Link className='text-secondary' href='/posts'>
                  Posts
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className='text-secondary' href='/about'>
                  About
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className='text-secondary' href='/friends'>
                  Friends
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className='text-secondary' href='/photos'>
                  Photos
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link className='text-secondary' href='/more'>
                  More
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Container>

          <Container>
            <ButtonGroup
              className='d-flex p-2 align-items-between justify-content-between'
              aria-label='First group'
            >
              <Button variant='light' className='rounded-sm mr-1'>
                Edit
              </Button>
              <Button variant='light' className='rounded-sm mr-1'>
                View As
              </Button>
              <Button variant='light' className='rounded-sm mr-1'>
                Search
              </Button>
              <Button variant='light' className='rounded-sm mr-1'>
                Settings
              </Button>
            </ButtonGroup>
          </Container>
        </Container>
      </Row>
      <Row className='mt-3 profile-content'>
        <div className='d-flex mx-auto'>
          <Col xs={4} className='d-flex justify-content-end'>
            <Card style={{ width: "100%", height: "200px" }}>
              <Card.Header className='bg-white'>
                <h3>Information</h3>
              </Card.Header>
              <Card.Body className='text-left ml-3 mt-3'>
                <div className='mb-2'>Name: {currentUser?.name}</div>
                <div className='mb-2'>Email: {currentUser?.email}</div>
                <div className='mb-2'>Gender: {currentUser?.gender}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={8} className='posts-col'>
            <Composer />
            <InfiniteScroll
              dataLength={posts.length}
              next={() =>
                setTimeout(
                  () =>
                    dispatch(
                      postActions.postsRequest(
                        currentPage + 1,
                        2,
                        null,
                        currentUser._id
                      )
                    ),
                  1500
                )
              }
              hasMore={currentPage < totalPages}
              loader={<h4>Loading...</h4>}
            >
              {posts &&
                posts.map((p, idx) => {
                  return (
                    <div key={idx}>
                      <DropdownButton
                        variant='link'
                        className='position-relative'
                        style={{
                          left: "90%",
                          top: "60px",
                          zIndex: 1,
                        }}
                        title={`🖋️`}
                      >
                        <Dropdown.Item
                          as='button'
                          value={p._id}
                          onClick={handleDeletePost}
                        >
                          Delete this post
                        </Dropdown.Item>
                      </DropdownButton>
                      <Post key={p._id} {...p} />
                    </div>
                  );
                })}
            </InfiniteScroll>
          </Col>
        </div>
      </Row>
    </div>
  );
}
