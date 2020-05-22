import React from 'react';

class Footer extends React.Component {

  render() {
    return (
      // <nav className="navbar fixed-bottom navbar-dark" style={{backgroundColor: 'rgba(253, 178, 137, 0.19)'}}>
      //   <p className="navbar-brand" style={{color: '#000', fontSize:"10px", margin: 0}}>Copyrights @ HCL</p>
      // </nav>
      <footer className="py-4 bg-light mt-auto">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between small">
          <div className="text-muted">Copyright &copy; Your Website 2020</div>
          <div>
            <a href="#">Privacy Policy</a>
            &middot;
            <a href="#">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>

    )
  }
}

export default Footer;