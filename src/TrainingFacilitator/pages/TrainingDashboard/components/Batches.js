import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card } from 'react-bootstrap';
import Axios from 'axios';

const Batches = props => {
  const  [batches, setBatches] = useState([]);
  const  [batchesFetched, setBatchesFetched] = useState(false);
  const fetchCandidates = async () => {
    const { data } = await Axios.post('https://apk.cnc.hclets.com/DiEvAEndpoints/dev/training/BatchMasterList.php', { training_id: props.id });
    if (data?.status) {
      setBatches(data.arrRes);
      setBatchesFetched(true)
    }
  }

  const getCandidates = () => {
    fetchCandidates()
  };

  useEffect(getCandidates, [props.id]);

  return (
    <Row className="mb-4 eventStatusContainer w-100 justify-content-center">
      {batchesFetched && batches.length === 0 && 
      <Col sm={3}>
        No Batched found.
      </Col>
      }
      {batches.map(b => (
        <Col sm={3}>
          <div className="eventStatus">
            <Row className="statusRow">
              <Col sm={12} className='colStatus successBorder'>
                <div>
                  <p>{b.batch_name}</p>
                  <p className="success">{b.batch_count}</p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      ))}
    </Row>
  )
}

Batches.propTypes = {

}

export default Batches
