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
      <Col sm={4}>
        <div className="eventStatus">
          <Row className="statusRow row">
            <Col sm={12} className='colStatus successBorder'>
              <div>
                <p>Candidates Enrolled</p>
                <p className="success">{props.count}</p>
              </div>
            </Col>
            <Col sm={12} className='mt-4'>
              <Table bordered>
                <tbody>
                  <tr>
                    <th>Type</th>
                    <td>{props.type}</td>
                  </tr>
                  <tr>
                    <th>Location</th>
                    <td>{props.location_name}</td>
                  </tr>
                  <tr>
                    <th>Duration</th>
                    <td>{props.duration}</td>
                  </tr>
                  <tr>
                    <th>Account</th>
                    <td>{props.account_name}</td>
                  </tr>
                  <tr>
                    <th>Requested By</th>
                    <td>{props.request_by}</td>
                  </tr>
                  <tr>
                    <th>Requested By SAP ID</th>
                    <td>{props.requestedby_sapid}</td>
                  </tr>
                  <tr>
                    <th>Program Manager</th>
                    <td>{props.program_manager}</td>
                  </tr>
                  <tr>
                    <th>Program Manager</th>
                    <td>{props.program_manager}</td>
                  </tr>
                  <tr>
                    <th>Skills</th>
                    <td>{props?.skills_array?.map?.(s => s.skill_name)?.join?.(', ')}</td>
                  </tr>
                  <tr>
                    <th>Assign SME</th>
                    <td>{props.sme_name}</td>
                  </tr>
                  <tr>
                    <th>Planned Start Date</th>
                    <td>{props.planned_start_date}</td>
                  </tr>
                  <tr>
                    <th>Planned Start Date</th>
                    <td>{props.planned_start_date}</td>
                  </tr>
                  <tr>
                    <th>Planned End Date</th>
                    <td>{props.planned_end_date}</td>
                  </tr>
                  <tr>
                    <th>Actual Start Date</th>
                    <td>{props.actual_end_date}</td>
                  </tr>
                  <tr>
                    <th>Actual End Date</th>
                    <td>{props.planned_end_date}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      </Col>
      <Col sm={8}>
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
