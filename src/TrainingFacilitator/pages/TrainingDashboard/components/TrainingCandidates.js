import React, { useEffect, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Axios from 'axios';

const TrainingInfo = props => {
  const [candidates, setCandidates] = useState(null);
  const fetchCandidates = async () => {
    const { data } = await Axios.post('https://apk.cnc.hclets.com/DiEvAEndpoints/dev/training/candidateListByTraining.php', { training_id: props.id, user_id: 1 },  {headers: {
      'Accept': 'application/json',
      'Content-Type': 'text/plain'
  }});

    if (data?.errCode === 200) {
      const candidate_details = [...data.no_feedback_given_list, ...data.feedback_given_list];
      setCandidates(candidate_details);
    } else {
      setCandidates([]);
    }
  }

  const getCandidates = () => {
    fetchCandidates()
  };

  useEffect(getCandidates, [props.id]);

  return (
    <Row className="w-100">
      <Col sm={12}>
        <Table striped bordered>
          <thead>
            <tr>
              <th>SAP</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {candidates && candidates.map(c => (
              <tr key={c.id}>
                <td>{c.sap_id}</td>
                <td>{c.first_name} {c.last_name}</td>
                <td>{c.email}</td>
                <td>{c.phone_number}</td>
              </tr>
            ))}
            {candidates && candidates.length === 0 && <tr >No data found.</tr>}
          </tbody>
        </Table>
      </Col>
    </Row>
  )
}

TrainingInfo.propTypes = {

}

export default TrainingInfo
