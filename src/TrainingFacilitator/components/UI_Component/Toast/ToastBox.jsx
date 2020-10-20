import React, {useState} from 'react';
import { Toast } from 'react-bootstrap';
const ToastBox = (props) => {
    const [showToast, setShowToast]= useState(props.showToast);
    return(
    <Toast
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#deeddd',
              border: '1px solid #28a745',
              color: '#6c757d',
              fontWeight: 500,
              width: 400,
              zIndex: 1
            }}
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            autohide
          >
            <Toast.Body>{props.toastMsg}</Toast.Body>
          </Toast>
)};
export default ToastBox;