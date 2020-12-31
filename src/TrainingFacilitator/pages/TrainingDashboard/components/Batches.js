import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card } from 'react-bootstrap';

const Batches = props => {
  return (
    <Row className="mb-4">
      <Col sm={3}>
        <Card>
          <Card.Body>
            <Card.Title>Batch 1</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={3}>
        <Card>
          <Card.Body>
            <Card.Title>Batch 2</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={3}>
        <Card>
          <Card.Body>
            <Card.Title>Batch 3</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={3}>
        <Card>
          <Card.Body>
            <Card.Title>Batch 4</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={3}>
        <Card>
          <Card.Body>
            <Card.Title>Batch 5</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk of
              the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

Batches.propTypes = {

}

export default Batches
