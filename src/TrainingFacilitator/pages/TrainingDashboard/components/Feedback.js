import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, ListGroup, Table } from 'react-bootstrap';
import Axios from 'axios';

const Feedback = props => {
  const [current, setCurrent] = useState('initial');
  const [initial, setInitial] = useState([]);
  const [pre, setPre] = useState([]);
  const [interim, setInterim] = useState([]);
  const [post, setPost] = useState([]);

  const fetchFeedback = async () => {
    const { data: initialData } = await Axios.post('https://apk.cnc.hclets.com/DiEvAEndpoints/dev/training/candidateListByTraining.php', {
      training_id: props.id,
    });

    const { data: preData } = await Axios.post('https://apk.cnc.hclets.com/DiEvAEndpoints/dev/training/pre-assessmentFeedback-list.php', {
      trainingId: props.id,
    });

    const { data: interimData } = await Axios.post('https://apk.cnc.hclets.com/DiEvAEndpoints/dev/training/candidateListByTraining.php', {
      training_id: props.id,
    });

    const { data: postData } = await Axios.post('https://apk.cnc.hclets.com/DiEvAEndpoints/dev/training/post-assessmentFeedback-list.php', {
      trainingId: props.id,
    });

    if (initialData.status) {
      setInitial(initialData.feedback_given_list);
    }

    if (preData.status) {
      setPre(preData.feedback_given_list);
    }

    if (interimData.status) {
      setInterim(interimData.feedback_given_list);
    }

    if (postData.status) {
      setPost(postData.feedback_given_list);
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
          <ListGroup.Item active={current === "initial"} onClick={() => setCurrent('initial')}>Initial</ListGroup.Item>
          <ListGroup.Item active={current === "pre"} onClick={() => setCurrent('pre')}>Pre Assessment</ListGroup.Item>
          <ListGroup.Item active={current === "interim"} onClick={() => setCurrent('interim')}>Interim</ListGroup.Item>
          <ListGroup.Item active={current === "post"} onClick={() => setCurrent('post')}>Post Assessment</ListGroup.Item>
        </ListGroup>
      </Col>
      <Col sm={9}>
        {current === 'initial' && <Table responsive striped bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {initial?.map?.(f => (
              <tr>
                <td>{f.first_name} {f.last_name}</td>
                <td>{f.remarks}</td>
              </tr>
            ))}
          </tbody>
        </Table>}
        {current === 'pre' && <Table responsive striped bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>Final Conclusion</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {pre?.map?.(f => (
              <tr>
                <td>{f.first_name} {f.last_name}</td>
                <td>{f.score}</td>
                <td>{f.final_conclusion}</td>
                <td>{f.comments}</td>
              </tr>
            ))}
          </tbody>
        </Table>}
        {current === 'interim' && <Table responsive striped bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Attendance</th>
              <th>SME Session Interaction</th>
              <th>Theory</th>
              <th>Hands On</th>
              <th>Hands On Performance</th>
              <th>Assessment %</th>
              <th>Assessment Schedule Compliance</th>
              <th>Overall</th>
              <th>SME's Interaction</th>
              <th>SME Name</th>
              <th>Remarks</th>
              <th>Training Completed</th>
              <th>Training Completed Date</th>
              <th>Certification</th>
              <th>Final Score</th>
              <th>% Complete</th>
              <th>SPOC</th>
            </tr>
          </thead>
          <tbody>
            {interim?.map?.(f => (
              <tr>
                <td>{f.first_name} {f.last_name}</td>
                <td>{f.attendance}</td>
                <td>{f.sme_session_interaction}</td>
                <td>{f.theory}</td>
                <td>{f.hands_on}</td>
                <td>{f.hands_on_performance}</td>
                <td>{f.assessment}</td>
                <td>{f.assessment_schedule_compliance}</td>
                <td>{f.overall}</td>
                <td>{f.sme_interaction}</td>
                <td>{f.remarks}</td>
                <td>{f.sme_name}</td>
                <td>{f.training_completed}</td>
                <td>{f.training_completed_date}</td>
                <td>{f.certification}</td>
                <td>{f.final_assessment_score}</td>
                <td>{f.percentage_complete}</td>
                <td>{f.spoc}</td>
              </tr>
            ))}
          </tbody>
        </Table>}
        {current === 'post' && <Table responsive striped bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Dryfice</th>
              <th>Comments</th>
              <th>Can be certified</th>
            </tr>
          </thead>
          <tbody>
            {post?.map?.(f => (
              <tr>
                <td>{f.first_name} {f.last_name}</td>
                <td>{f.dryfice}</td>
                <td>{f.comment}</td>
                <td>{f.can_be_certified}</td>
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
