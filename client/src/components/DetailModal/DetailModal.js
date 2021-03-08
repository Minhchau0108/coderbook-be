import React from "react";
import { Modal, Row, Col } from "react-bootstrap";

function PostHeader(props) {
  return (
    <div className='d-flex align-items-center py-3'>
      <img
        alt='profile'
        className='rounded-circle'
        src={`https://ui-avatars.com/api/?name=${props.name}&background=random&length=1&bold=true`}
      />
      <h3 className='font-weight-bold ml-3'>{props.name}Testing</h3>
    </div>
  );
}

const DetailModal = ({ show, handleClose }) => {
  return (
    <div>
      <Modal show={show} onHide={handleClose} size='xl'>
        <Modal.Header closeButton></Modal.Header>

        <Modal.Body>
          <Row>
            <Col sm={8}>
              <img
                src='https://images.unsplash.com/photo-1529231812519-f0dcfdf0445f?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8dGFsZW50ZWR8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60'
                alt='Avatar'
              ></img>
            </Col>

            <Col sm={4}>
              <PostHeader />
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DetailModal;
