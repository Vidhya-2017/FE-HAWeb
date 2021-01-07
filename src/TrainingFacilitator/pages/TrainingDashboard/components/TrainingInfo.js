import React, { useEffect, useState } from 'react'
import { Col, Row, Table, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Axios from 'axios';
import DonutLargeTwoToneIcon from '@material-ui/icons/DonutLargeTwoTone';

const TrainingInfo = props => {
  const renderInfo = (term, def, isFirst) => (
    <Card bg="light" className={!isFirst && "mt-3"}>
      <div className="d-flex align-items-center">
        <Card bg="secondary" text="white">
          <DonutLargeTwoToneIcon className="m-2" />
        </Card>
        <Card bg="light">
          <h5 className="mt-2 mb-2 ml-3 mr-2"><strong>{term}</strong> {def}</h5>
        </Card>
      </div>
    </Card>
  );

  return (
    <Row className="w-100 mt-4 mb-4">
      <Col sm={6}>
        <Card bg="info">
          <Card.Body>
            {renderInfo("Type", props.type, true)}
            {renderInfo("Location", props.location_name)}
            {renderInfo("Duration", props.duration)}
            {renderInfo("Account", props.account_name)}
            {renderInfo("Requested By", props.request_by)}
            {renderInfo("Requested By SAP ID", props.requestedby_sapid)}
            {renderInfo("Program Manager", props.program_manager)}
          </Card.Body>
        </Card>
      </Col>
      <Col sm={6}>
        <Card bg="info">
          <Card.Body>
            {renderInfo("Skills", props?.skills_array?.map?.(s => s.skill_name)?.join?.(', '), true)}
            {renderInfo("Assign SME", props.sme_name)}
            {renderInfo("Planned Start Date", props.planned_start_date)}
            {renderInfo("Planned End Date", props.planned_end_date)}
            {renderInfo("Actual Start Date", props.actual_start_date)}
            {renderInfo("Actual End Date", props.actual_end_date)}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

TrainingInfo.propTypes = {

}

export default TrainingInfo
