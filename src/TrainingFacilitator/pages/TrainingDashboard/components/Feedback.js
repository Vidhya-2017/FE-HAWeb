import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, ListGroup, Table } from 'react-bootstrap';
import Axios from 'axios';

const Feedback = props => {
  const [current, setCurrent] = useState('feedback');
  const [feedback, setFeedback] = useState([]);

  const fetchFeedback = async () => {
    const { data } = await Axios.post('https://apk.cnc.hclets.com/DiEvAEndpoints/dev/training/candidateListByTraining.php', {
      training_id: props.id,
    });

    if (data.status) {
      setFeedback(data);
    }
  }

  const getFeedback = () => {
    fetchFeedback();
  };

  useEffect(getFeedback, [props.id])

  return (
    <Row className="w-100 mb-4">
      <Col sm={3}>
        <ListGroup variant="flush">
          <ListGroup.Item active={current === "feedback"} onClick={() => setCurrent('feedback')}>Feedback</ListGroup.Item>
          <ListGroup.Item active={current === "pending"} onClick={() => setCurrent('pending')}>Pending</ListGroup.Item>
          <ListGroup.Item active={current === "managers"} onClick={() => setCurrent('managers')}>Managers</ListGroup.Item>
          <ListGroup.Item active={current === "sme"} onClick={() => setCurrent('sme')}>SME</ListGroup.Item>
        </ListGroup>
      </Col>
      <Col sm={9}>
        {current === 'feedback' && <Table striped bordered>
          <thead>
            <tr>
              <th>SAP</th>
              <th>Name</th>
              <th>Assessment</th>
              <th>Attendance</th>
              <th>Certification</th>
              <th>Email</th>
              <th>Final score</th>
              <th>Completed %</th>
              <th>Training Completed</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {feedback?.feedback_given_list?.map?.(f => (
              <tr>
                <td>{f.sap_id}</td>
                <td>{f.first_name} {f.last_name}</td>
                <td>{f.assessment}</td>
                <td>{f.attendance}</td>
                <td>{f.certification}</td>
                <td>{f.email}</td>
                <td>{f.final_assessment_score}</td>
                <td>{f.percentage_complete}</td>
                <td>{f.training_completed}</td>
                <td>{f.remarks}</td>
              </tr>
            ))}
          </tbody>
        </Table>}
        {current === 'pending' && <Table striped bordered>
          <thead>
            <tr>
              <th>SAP</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {feedback?.no_feedback_given_list?.map?.(f => (
              <tr>
                <td>{f.sap_id}</td>
                <td>{f.first_name} {f.last_name}</td>
                <td>{f.email}</td>
                <td>{f.phone_number}</td>
              </tr>
            ))}
          </tbody>
        </Table>}
        {current === 'managers' && <Table striped bordered>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {feedback?.programManager?.map?.(f => (
              <tr>
                <td>{f.program_manager_id}</td>
                <td>{f.program_manager_name}</td>
              </tr>
            ))}
          </tbody>
        </Table>}
        {current === 'sme' && <Table striped bordered>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {feedback?.sme?.map?.(f => (
              <tr>
                <td>{f.sme_id}</td>
                <td>{f.sme_name}</td>
                <td>{f.enddate}</td>
              </tr>
            ))}
          </tbody>
        </Table>}
      </Col>
    </Row>
  )
}

Feedback.propTypes = {

}

export default Feedback
