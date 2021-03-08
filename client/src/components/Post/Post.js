import React, { useState, useRef } from "react";
import {
  Col,
  Form,
  Card,
  Button,
  ListGroup,
  ButtonGroup,
  ListGroupItem,
  Tooltip,
  OverlayTrigger,
  Modal,
  Tab,
  Tabs,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { postActions } from "../../redux/actions";
import { FacebookCounter, FacebookSelector } from "react-reactions";

import "./style.css";
import DetailModal from "../DetailModal";

const Avatar = (props) => {
  return (
    <img
      alt='profile'
      className='rounded-circle'
      src={`https://ui-avatars.com/api/?name=${props.name}&background=random&length=1&bold=true`}
    />
  );
};

/* STEP 4 */
const CommentForm = (props) => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(postActions.createComment(props.postId, comment));
    e.target.reset();
  };
  return (
    <Form onSubmit={onSubmit}>
      <Form.Row>
        <Col className='d-flex'>
          <Form.Control
            size='sm'
            type='text'
            ref={props.commentInput}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Write a comment...'
            className='border-0 rounded-md bg-light'
          />
        </Col>
      </Form.Row>
    </Form>
  );
};

const Comment = (props) => {
  const dispatch = useDispatch();
  const [showSelectorComment, setShowSelectorComment] = useState(false);
  const hanldeShowSelector = () => {
    setShowSelectorComment(!showSelectorComment);
  };
  const handleSelectReactionComment = (emoji) => {
    dispatch(postActions.createPostReaction("Comment", props._id, emoji));
    setShowSelectorComment(false);
  };
  const reactionsCommentCounter = [];
  if (props.reactions) {
    props.reactions.forEach((r) => {
      reactionsCommentCounter.push({ emoji: r.emoji, by: "ABC" });
    });
  }
  return (
    <>
      <ListGroupItem
        className='justify-content-start border-bottom-0 pr-0 py-0'
        key={props._id}
      >
        <Avatar name={props.owner?.name} />
        <div className='col'>
          <div className='comment-bubble'>
            <div className='font-weight-bold'>{props.owner?.name}</div>
            <p>{props.body}</p>
          </div>
          <div>
            {reactionsCommentCounter.length > 0 && (
              <FacebookCounter
                counters={reactionsCommentCounter}
                bg='#fafafa'
              />
            )}
          </div>
        </div>
      </ListGroupItem>
      <div className='col ml-5 mt-0'>
        {showSelectorComment && (
          <div
            style={{
              marginBottom: "10px",
              width: "300px",
            }}
          >
            <FacebookSelector
              reactions={["like", "love", "haha", "wow", "sad", "angry"]}
              onSelect={handleSelectReactionComment}
            />
          </div>
        )}
        <Button
          variant='link'
          className='text-left text-muted mt-0 pt-0'
          onClick={hanldeShowSelector}
        >
          <small> Like</small>
        </Button>
      </div>
    </>
  );
};

const PostComments = (props) => {
  const [showAllComments, setShowAllComments] = useState(false);
  return (
    <Card.Body>
      <Button
        className='px-0 pt-0'
        variant='link'
        onClick={() => setShowAllComments(!showAllComments)}
      >
        {props.comments.length > 3 && !showAllComments && "See all comments"}
        {showAllComments && "Hide comments"}
      </Button>
      <ListGroup className='list-group-flush'>
        {showAllComments &&
          props.comments.map((c) => <Comment key={c._id} {...c} />)}
        {!showAllComments &&
          props.comments.slice(-3).map((c) => <Comment key={c._id} {...c} />)}
      </ListGroup>
    </Card.Body>
  );
};

const POST_ACTIONS = [
  { title: "Like", icon: "thumbs-up" },
  { title: "Comment", icon: "comment" },
  { title: "Share", icon: "share" },
];

const PostActionButton = ({ title, icon, handleClick }) => {
  return (
    <Button
      className='bg-light bg-white text-dark border-0'
      value={title}
      onClick={handleClick}
    >
      <FontAwesomeIcon
        size='lg'
        icon={icon}
        color='black'
        className='mr-2 action-icon'
      />
      {title}
    </Button>
  );
};

const PostActions = ({ handleClick }) => {
  return (
    <ButtonGroup aria-label='Basic example'>
      {POST_ACTIONS.map((a) => {
        return (
          <PostActionButton key={a.title} {...a} handleClick={handleClick} />
        );
      })}
    </ButtonGroup>
  );
};

const ModalReaction = ({ show, handleClose, reactions }) => {
  const objReaction = reactions.reduce((acc, reaction) => {
    acc[reaction.emoji]
      ? acc[reaction.emoji].push(reaction.owner)
      : (acc[reaction.emoji] = [reaction.owner]);
    return acc;
  }, {});
  console.log(objReaction);
  const renderArray = Object.entries(objReaction);
  console.log(Object.entries(objReaction));
  renderArray.forEach((item) => {
    if (item[0] === "like") {
      item[0] = `👍`;
    }
    if (item[0] === "love") {
      item[0] = `❤️`;
    }
    if (item[0] === "haha") {
      item[0] = `😃`;
    }
    if (item[0] === "wow") {
      item[0] = `😲`;
    }
    if (item[0] === "sad") {
      item[0] = `😢`;
    }
    if (item[0] === "angry") {
      item[0] = `😡`;
    }
  });
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <Tabs id='uncontrolled-tab-example'>
          {renderArray.map((e) => {
            return (
              <Tab eventKey={e[0]} title={`${e[0]}  ${e[1].length}`} key={e[0]}>
                {e[1]
                  .map((people) => people.name)
                  .filter((item, i, arr) => arr.indexOf(item) === i)
                  .map((r, idx) => {
                    return (
                      <h6 key={idx} className='mt-3'>
                        {r}
                      </h6>
                    );
                  })}
              </Tab>
            );
          })}
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

const PostReactions = (props) => {
  const [showModalReaction, setShowModalReaction] = useState(false);
  const iconArray = props.reactions
    .map((r) => r.emoji)
    .filter((item, i, arr) => arr.indexOf(item) === i);
  const emojiArray = iconArray.map((i) => {
    if (i === "like") {
      return `👍`;
    }
    if (i === "love") {
      return `❤️`;
    }
    if (i === "haha") {
      return `😃`;
    }
    if (i === "wow") {
      return `😲`;
    }
    if (i === "sad") {
      return `😢`;
    }
    return `😡`;
  });
  const peopleArray = props.reactions
    .map((r) => r.owner.name)
    .filter((item, i, arr) => arr.indexOf(item) === i);

  return (
    <div className='d-flex justify-content-between my-2 mx-1'>
      <div className='mb-0'>
        <div className='d-flex '>
          {emojiArray.length > 0 &&
            emojiArray.map((e) => {
              return (
                <div key={e} className='mr-2'>
                  {e}
                </div>
              );
            })}
          {peopleArray.length > 0 && (
            <OverlayTrigger
              placement='bottom'
              overlay={
                <Tooltip id='button-tooltip-2'>
                  {peopleArray.length > 0 &&
                    peopleArray.map((c) => {
                      return <div key={c}>{c}</div>;
                    })}
                </Tooltip>
              }
            >
              <button
                className='border-0'
                onClick={() => setShowModalReaction(true)}
              >
                {props.reactions.length}
              </button>
            </OverlayTrigger>
          )}
        </div>
      </div>
      <p className='mb-0'>
        {props.comments.length > 1
          ? `${props.comments.length} comments`
          : `${props.comments.length} comment`}
      </p>
      {props.reactions.length > 0 && (
        <ModalReaction
          reactions={props.reactions}
          show={showModalReaction}
          handleClose={() => setShowModalReaction(false)}
        />
      )}
    </div>
  );
};

function PostHeader({ userWhoCreatedPost }) {
  return (
    <div className='d-flex align-items-center py-3'>
      <Avatar name={userWhoCreatedPost?.name} />
      <h3 className='font-weight-bold ml-3'>{userWhoCreatedPost?.name}</h3>
    </div>
  );
}

export default function Post(props) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const dispatch = useDispatch();
  const [showSelector, setShowSelector] = useState(false);
  const commentInput = useRef(null);
  const handleClick = (e) => {
    console.log(e.target.value);
    if (e.target.value === "Comment") {
      commentInput.current.focus();
    }
    if (e.target.value === "Like") {
      setShowSelector(!showSelector);
    }
  };
  const handleSelectReaction = (emoji) => {
    dispatch(postActions.createPostReaction("Post", props._id, emoji));
    setShowSelector(false);
  };

  return (
    <Card className='p-3 mb-3 shadow rounded-md'>
      <PostHeader userWhoCreatedPost={props.owner} />
      {props.body}

      <Card.Img
        onClick={() => setShowDetailModal(true)}
        variant='top'
        src='https://images.unsplash.com/photo-1529231812519-f0dcfdf0445f?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8dGFsZW50ZWR8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
      />

      <PostReactions comments={props.comments} reactions={props.reactions} />
      <hr className='my-1' />
      {showSelector && (
        <div
          style={{
            marginBottom: "10px",
            width: "300px",
          }}
        >
          <FacebookSelector
            reactions={["like", "love", "haha", "wow", "sad", "angry"]}
            onSelect={handleSelectReaction}
          />
        </div>
      )}
      <PostActions handleClick={handleClick} />

      <hr className='mt-1' />
      <PostComments comments={props.comments} />
      <CommentForm postId={props._id} commentInput={commentInput} />
      <DetailModal
        show={showDetailModal}
        handleClose={() => setShowDetailModal(false)}
      />
    </Card>
  );
}
