import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap';

const Feedback = props => {
  return (
    <div className="mb-4">
      <Table striped bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>loram ipsum dolor sit amet</td>
          </tr>
          <tr>
            <td>John Doe</td>
            <td>loram ipsum dolor sit amet</td>
          </tr>
          <tr>
            <td>John Doe</td>
            <td>loram ipsum dolor sit amet</td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}

Feedback.propTypes = {

}

export default Feedback
