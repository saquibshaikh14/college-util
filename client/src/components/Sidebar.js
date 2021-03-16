import React from 'react';
import {Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export default function Sidebar({activeNav, baseUrl}) {
    activeNav = activeNav?activeNav:"home";
    
    return (
        <div className="sidebar">
            <h3 className="sidebar-logo">STCET</h3>
            <ul className="sidebar-navigations">
                <li className={"sidebar-nav-item" + (activeNav && activeNav==="home"? " side-nav-active":"")}>
                    {/* <button className="ui fluid button sidebar-nav-button">Some text</button> */}
                    <Link to={"/" + baseUrl + "/dashboard"} className="sidebar-nav-link">
                        <Icon name="dashboard" />
                        Dashboard
                    </Link>
                </li>
                <li className="sidebar-nav-title">
                    Menu
                </li>

                <li className={"sidebar-nav-item "} name="notification">
                    {/* <button className="ui fluid button sidebar-nav-button">Some text</button> */}
                    <div role="button" className="sidebar-nav-link">
                        <Icon name="bell outline" />
                        Notification
                    </div>
                </li>
                <li className={"sidebar-nav-item" + (activeNav && activeNav==="user-list"? " side-nav-active":"")} name="users">
                    <Link to={"/" + baseUrl + "/dashboard/user-list"} className="sidebar-nav-link">
                        <Icon name="users" />
                        Users
                    </Link>
                </li>
                
                <li className="sidebar-nav-divider"></li>
            </ul>
        </div>
      
    )
}
