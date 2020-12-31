import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { Col, ListGroup, Row, Table, Form } from 'react-bootstrap';

const Curriculum = props => {
  const [current, setCurrent] = useState(0);

  return (
    <Row className="w-100">
      <Col sm={3}>
        <ListGroup variant="flush">
          <ListGroup.Item active={current === 0} onClick={() => setCurrent(0)}>Curriculum 1</ListGroup.Item>
          <ListGroup.Item active={current === 1} onClick={() => setCurrent(1)}>Curriculum 2</ListGroup.Item>
          <ListGroup.Item active={current === 2} onClick={() => setCurrent(2)}>Curriculum 3</ListGroup.Item>
        </ListGroup>
      </Col>
      <Col sm={9}>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Completed</th>
              <th>Name</th>
              <th>Completion Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><Form.Check type="checkbox" checked disabled /></td>
              <td>Topic 1</td>
              <td>12th April 2020</td>
            </tr>
            <tr>
              <td><Form.Check type="checkbox" checked disabled /></td>
              <td>Topic 2</td>
              <td>12th April 2020</td>
            </tr>
            <tr>
              <td><Form.Check type="checkbox" disabled /></td>
              <td>Topic 3 Not complete</td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  )
}

Curriculum.propTypes = {

}

export default Curriculum
