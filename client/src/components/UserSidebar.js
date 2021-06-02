import React from 'react';
import {Icon} from 'semantic-ui-react';
import { Link} from "react-router-dom";


export default function UserSidebar({activeNav, baseUrl}) {
  activeNav = activeNav?activeNav:"home";
    return (
          <div className="sidebar">
          <h3 className="sidebar-logo">STCET</h3>
            <ul className="sidebar-navigations">
              <li  className={"sidebar-nav-item" + (activeNav && activeNav==="home"? " side-nav-active":"")}>
                <Link to={"/" + baseUrl + "/dashboard"} className="sidebar-nav-link">
                <Icon name="dashboard" />
                  Dashboard
                </Link>
              </li>
              <li className="sidebar-nav-title">
                    Menu
              </li>

              <li className={"sidebar-nav-item "} name="show_files">
                <Link to={"/" + baseUrl + "/dashboard/show_files"} className="sidebar-nav-link">
                  <Icon name="file" />
                  Show_Files
                </Link>
              </li>
              <li className={"sidebar-nav-item "} name="upload">
                <Link to={"/" + baseUrl + "/dashboard/upload"} className="sidebar-nav-link">
                 <Icon name="upload" />
                  Upload
                </Link>
              </li>
              <li className="sidebar-nav-divider"></li>
            </ul>
          </div>

    );
  }
