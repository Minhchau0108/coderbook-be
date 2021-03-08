import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import { Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { postActions } from "../../redux/actions/post.actions";
import InfiniteScroll from "react-infinite-scroll-component";

import "./style.css";

import Post from "../../components/Post";
import Composer from "../../components/Composer";

const SIDEBAR_BUTTONS = [
  {
    title: "Friends",
    icon: "users",
  },
  {
    title: "Events",
    icon: "calendar",
  },
  {
    title: "Groups",
    icon: "user-friends",
  },
  {
    title: "Pages",
    icon: "flag",
  },
  {
    title: "See More",
    icon: "angle-down",
  },
];

const SidebarButton = ({ title, icon }) => {
  return (
    <Button className='d-flex align-items-center sidebar-button border-0 text-dark btn-light'>
      <FontAwesomeIcon icon={icon} size='lg' style={{ width: "4rem" }} />
      <span>{title}</span>
    </Button>
  );
};
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/* STEP 3 */
export default function HomePage() {
  const querySearch = useQuery();
  const query = querySearch.get("search");
  console.log("Your search is:", query);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const posts = useSelector((state) => state.post.posts);
  const totalPages = useSelector((state) => state.post.totalPageNum);
  const currentPage = useSelector((state) => state.post.currentPage);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(postActions.postsRequest(1, 2, query));
  }, [dispatch, query]);

  if (!isAuthenticated) return <Redirect to='/auth' />;

  return (
    <Row>
      <Col className='d-flex flex-column pl-1 mt-3'>
        <ButtonGroup vertical>
          {SIDEBAR_BUTTONS.map((b) => {
            return <SidebarButton key={b.title} {...b} />;
          })}
        </ButtonGroup>
      </Col>
      <Col
        xs={5}
        id='scrollingElement'
        className='d-flex flex-column align-items-center posts-container'
      >
        <Composer />
        <InfiniteScroll
          dataLength={posts.length}
          next={() =>
            setTimeout(
              () =>
                dispatch(postActions.postsRequest(currentPage + 1, 2, query)),
              1500
            )
          }
          hasMore={currentPage < totalPages}
          loader={<h4>Loading...</h4>}
        >
          {posts &&
            posts.map((p) => {
              return <Post key={p._id} {...p} />;
            })}
        </InfiniteScroll>
      </Col>
      <Col></Col>
    </Row>
  );
}
