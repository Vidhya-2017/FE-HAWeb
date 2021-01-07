import React, { useEffect, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Axios from 'axios';

const TrainingInfo = props => {
  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = async () => {
    const { data } = await Axios.post('https://apk.cnc.hclets.com/DiEvAEndpoints/dev/training/BatchMapCandidateList.php', { training_id: props.training_type, batch_id: props.training_type });

    if (data?.status) {
      setCandidates(data.batchCandidate);
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
              <th>Batch</th>
              <th>SAP</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(c => (
              <tr key={c.id}>
                <td>{c.batch_id}</td>
                <td>{c.sap_id}</td>
                <td>{c.first_name} {c.last_name}</td>
                <td>{c.email}</td>
                <td>{c.phone_number}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  )
}

TrainingInfo.propTypes = {

}

export default TrainingInfo
