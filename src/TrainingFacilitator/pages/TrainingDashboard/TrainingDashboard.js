import React, { useState, useEffect } from 'react';
import { Col, Nav, Row, Badge } from 'react-bootstrap';
import Select from 'react-select';
import SelectStyles from '../../../common/SelectStyles';
import '../../../pages/Dashboard/scss/Dashboard.scss';
import TrainingInfo from './components/TrainingInfo';
import TrainingCandidates from './components/TrainingCandidates';
import Batches from './components/Batches';
import Curriculum from './components/Curriculum';
import Feedback from './components/Feedback';
import Axios from 'axios';

const TrainingDashboard = () => {
  const [current, setCurrent] = useState('info');
  const [trainings, setTrainings] = useState([]);
  const [currentTraining, setCurrentTraining] = useState(null);

  const fetchTrainings = async () => {
    const { data } = await Axios.get('https://apk.cnc.hclets.com/DiEvAEndpoints/dev/training/TrainingListAll.php')
    if (data.status) {
      setTrainings(data.arrRes);
      setCurrentTraining(data.arrRes[0]);
    }
  }

  const getTrainings = () => {
    fetchTrainings()
  };

  const onTrainingChange = e => {
    const _training = trainings.find(t => t.id === e.value);
    setCurrentTraining(_training);
  }

  useEffect(getTrainings, []);

  if (!trainings.length || !currentTraining) return null;

  return (
   <div className='eventStatusContainer'>
      <h3 className='pageTitle'>Trainings</h3>
      <section className='statusHandlerContainer'>
        <Row className="w-100 mb-3">
          <Col sm={3}>
            <div className="sprintlabel">
              <label className='eventLabel'>Select Training:</label>
              <Select
                styles={SelectStyles()}
                value={{
                  label: currentTraining.training_name,
                  value: currentTraining.id
                }}
                onChange={onTrainingChange}
                options={trainings.map(t => ({ label: t.training_name, value: t.id }))}
              />
            </div>
          </Col>
          <Col sm={4}>
            <h2><Badge variant="success"><strong>Enrolled</strong>: {currentTraining.count}</Badge></h2>
          </Col>
          <Col className="mt-4" sm={12}>
            <Nav
              variant="pills"
              activeKey={current}
              onSelect={key => setCurrent(key)}
            >
              <Nav.Item>
                <Nav.Link eventKey="info">Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="candidates">Candidates</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="batches">Batches</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="curriculum">Curriculum</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="feedback">Feedback</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        {current === 'info' && <TrainingInfo {...currentTraining} />}
        {current === 'candidates' && <TrainingCandidates {...currentTraining} />}
        {current === 'batches' && <Batches />}
        {current === 'curriculum' && <Curriculum {...currentTraining} />}
        {current === 'feedback' && <Feedback {...currentTraining} />}
      </section>
    </div>
  )
}

export default TrainingDashboard;
