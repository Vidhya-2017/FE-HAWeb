import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import { Col, ListGroup, Row, Table, Form } from 'react-bootstrap';
import Axios from 'axios';

const Curriculum = props => {
  const [current, setCurrent] = useState(0);
  const [curriculum, setCurriculum] = useState([]);

  const fetchCurriculum = async (skill, index) => {
    setCurrent(index);

    const { data } = await Axios.post('https://apk.cnc.hclets.com/DiEvAEndpoints/dev/training/CurriculumDetailsAPI.php', {
      training_id: props.id,
      skill_id: skill.id
    });

    if (data.status) {
      setCurriculum(data.coveredTopic);
    }
  }

  const getFirstCurriculum = () => {
    fetchCurriculum(props.skills_array[0], 0)
  };

  useEffect(getFirstCurriculum, [])

  return (
    <Row className="w-100">
      <Col sm={3}>
        <ListGroup variant="flush">
          {props.skills_array.map((skill, i) => (
            <ListGroup.Item active={current === i} key={skill.id} onClick={() => fetchCurriculum(skill, i)}>{skill.skill_name}</ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
      <Col sm={9}>
        <Table striped bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>Covered</th>
              <th>Name</th>
              <th>Covered Week</th>
            </tr>
          </thead>
          <tbody>
            {curriculum.map(c => (
              <tr>
                <td>{c.skill_id}</td>
                <td><Form.Check type="checkbox" checked={c.coveredStatus === 'yes'} disabled /></td>
                <td>{c.name}</td>
                <td>{c.coveredWeek}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  )
}

Curriculum.propTypes = {

}

export default Curriculum
