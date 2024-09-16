import React, { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

function Room({ room , checkin, checkout}) {
  console.log("room:--------> ", room);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="row bs">
      <div className="col-md-4">
        <img src={room.imageurls[0]} className="smalling" />
      </div>
      <div className="col-md-7">
        <h1>{room.name}</h1>
        <p> Max count: {room.maxcount}</p>
        <p>Phone number: {room.phonenumber}</p>
        <p>Type: {room.type} </p>

        <div style={{ float: "right" }}>
         {(checkin && checkout) && (
           <Link to={`/book/${room._id}/${checkin}/${checkout}`}>
            
           <button  className="btn btn-primary m-2" >Book now</button>
         </Link>
         )}
         
          <button className="btn btn-primary m-2" onClick={handleShow}>
            view Details
          </button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel>
            {room.imageurls.map((url) => (
              <Carousel.Item key={Math.random(2)}>
                <img src={url} className="d-block w-100 c-image" />
              </Carousel.Item>
            ))}
          </Carousel>

          <p className="mt-2">{room.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Room;
