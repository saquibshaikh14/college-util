import React from 'react';
import {Nav} from 'react-bootstrap';

const UserHeader = () => {
    return (
        <div>
            <div className="header">
      <h1>File Upload And Download</h1>
      <Nav variant="pills" defaultActiveKey="/user/dashboard">
        <Nav.Item>
          <Nav.Link href="/user/dashboard" exact={true}>
            Home
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/user/dashboard/show_files">
            Files List
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
        </div>
    )
}

export default UserHeader;
