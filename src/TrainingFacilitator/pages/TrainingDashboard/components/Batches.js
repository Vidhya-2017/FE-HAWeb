import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Table } from 'react-bootstrap';
import Axios from 'axios';

const Batches = props => {
  const [batches, setBatches] = useState([]);
  const [batchesFetched, setBatchesFetched] = useState(false);
  const [current, setCurrent]= useState();
  const [batchDetails, setBatchDetails] = useState([]);

  const fetchCandidates = async () => {
    const { data } = await Axios.post('https://apk.cnc.hclets.com/DiEvAEndpoints/dev/training/BatchMasterList.php', { training_id: props.id });
    if (data?.status) {
      setBatches(data.arrRes);
      setBatchesFetched(true)
    }
  }

  const fetchBatchDetails = async () => {
    const { data } = await Axios.post('https://apk.cnc.hclets.com/DiEvAEndpoints/dev/training/BatchMapCandidateList.php',
      { training_id: props.id, batch_id: current }
    );
    if (data?.status) {
      setBatchDetails(data.batchCandidate);
    }
  }

  const getCandidates = () => {
    fetchCandidates()
  };

  const getchBatchDetails = () => {
    if (current) {
      fetchBatchDetails();
    } else {
      setBatchDetails([]);
    }
  }

  useEffect(getCandidates, [props.id]);
  useEffect(getchBatchDetails, [current]);

  return (
    <div className="mb-4 w-100">
      <Row className="eventStatusContainer w-100 justify-content-center">
        {batchesFetched && batches.length === 0 &&
        <Col sm={3}>
          No Batched found.
        </Col>
        }
        {batches.map(b => (
          <Col sm={3}>
            <div className="eventStatus cursor-pointer" onClick={() => setCurrent(b.batch_id)}>
              <Row className="statusRow">
                <Col sm={12} className={`colStatus successBorder ${b.batch_id === current && 'bg-success'}`}>
                  <div>
                    <p className={b.batch_id === current ? 'text-light' : ''}>{b.batch_name}</p>
                    <p className={`success ${b.batch_id === current ? 'text-light' : ''}`}>{b.batch_count}</p>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        ))}
      </Row>
      {!!batchDetails.length && (
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
            {batchDetails.map(c => (
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
      )}
    </div>
  )
}

Batches.propTypes = {

}

export default Batches
