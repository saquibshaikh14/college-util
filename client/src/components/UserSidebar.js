import React from 'react';
import {Icon} from 'semantic-ui-react';
import {Link, useHistory} from 'react-router-dom';

export default function Sidebar({activeNav, baseUrl}) {
    activeNav = activeNav?activeNav:"home";

        let history = useHistory();
      
        const redirect = () => {
          history.push('/user/dashboard/upload')
        }
        const redirectShowFile = () => {
            history.push('/user/dashboard/show_files')
          }
    
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

                <li className={"sidebar-nav-item "} name="show_files">
                    {/* <button className="ui fluid button sidebar-nav-button">Some text</button> */}
                    <div role="button" className="sidebar-nav-link" onClick={redirectShowFile}>
                        <Icon name="file" />
                        Show Files
                    </div>
                </li>
                <li className={"sidebar-nav-item "} name="upload">
                    {/* <button className="ui fluid button sidebar-nav-button">Some text</button> */}
                    <div role="button" className="sidebar-nav-link" onClick={redirect}>
                        <Icon name="upload" />
                        Upload documents
                    </div>
                </li>
                
                <li className="sidebar-nav-divider"></li>
            </ul>
        </div>
      
    )
}