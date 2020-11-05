import React from 'react';
import './scss/Footer.scss';
class Footer extends React.Component {

  render() {
    return (
      <footer className="mt-auto">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between small">
          <div>Copyright &copy; HCL 2020</div>
          <div>
           Powered by - DNA Capability
          </div>
        </div>
      </div>
    </footer>

    )
  }
}

export default Footer;