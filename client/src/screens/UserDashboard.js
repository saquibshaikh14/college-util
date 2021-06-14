import React, { useContext } from 'react';
 import { BrowserRouter as Router, Route, Redirect, useLocation, Link} from 'react-router-dom';

import {Icon, Modal, Message, Grid} from 'semantic-ui-react';
import UserSidebar from '../components/UserSidebar';
import { AuthContext } from '../context/AuthContext';

import UserApp from '../components/UserApp';
import UserFilesList from '../components/UserFilesList'
import AdminDefault from '../components/AdminDefault';

export default function UserDashboard() {    


  const location = useLocation();

  const { user, isActive } = useContext(AuthContext);


  //get component name from url

  let urlComponent = location.pathname.split('/');
  // console.log(urlComponent);

  let componentName = urlComponent[3] || 'default';

  //component to render (if parameter doesnot contain any of this show 404)
  const component = {
      allowedComponent: ["show_files","upload","default"], //array of component name (url freindly);
      "show_files": UserFilesList,
      "upload": UserApp,
      "default": AdminDefault
  }
  if(user){
    if(user.role && user.role.includes('ADMIN')){
        return <Redirect to="/user/dashboard" />
    }
 }else{
     return (<Redirect to={{pathname: "/log-in", state: {from: location, message: 'Login to access protected routes'}}} />)
 }
   
    return (
      <>
        <div className="dashboard-container">
            {!isActive && (
                <Modal size="mini" open={!isActive} closeOnDimmerClick={false} content="Logged out due to inactivity. &nbsp; Refresh page!" />
            )}

            <UserSidebar activeNav={urlComponent[3]} baseUrl={urlComponent[1]} />
            {/* sidebar ends */}

            <div className="right-panel">
                <header className="dashboard-header">
                    <h5 style={{display: "flex", alignItems: "center", padding:" 0 1rem 0 2rem", marginBottom: 0}}> Overview</h5>

                    <ul className="header-nav-list">
                        <li className="header-nav-item">
                            <h4 style={{padding: 0, margin: 0, color: "rgba(0, 0, 0, 0.9)"}}>
                                {user.name?user.name: "-------"}
                            </h4>

                            <p style={{color: "rgba(0, 0, 0, 0.8)", padding: 0, margin: 0}}>
                                {user.email?user.email:"-----@----"}
                            </p>
                        </li>

                        <li className="header-nav-item">
                            <div role="button" className="header-dropdown-toggle">
                                <div className="header-avatar-div">
                                   <img src={user.profile?"http://localhost:5000/"+user.profile:'https://i.pravatar.cc/50'} alt="user" className="header-avatar" /> 
                                </div>   
                            </div>
                            <div className="header-dropdwon-menu">
                                <div role="button" className="header-dropdown-item">
                                    <Icon name="log out" size="small" />
                                    Logout
                                </div>
                            </div>
                        </li>
                    </ul>
                </header>
                {/* header ends */}
                <div className="content-container">
                    <main className="content">
                        <div className="fluid-container">
                            <Router>
                                <Route pathname={location.pathname}
                                    render={()=>{
                                        
                                        if(component.allowedComponent.includes(componentName)){
                                            let Component = component[componentName];

                                            return <Component/>
                                        }else{
                                            return (
                                                <Grid centered columns={2}>
                                                <Grid.Column>
                                                <Message negative>
                                                    <Message.Header>Invalid URL</Message.Header>
                                                    <p>Please check the url or go back to dashboard  
                                                        <Link to="/user/dashboard"> home</Link>
                                                    </p>
                                                </Message>
                                                </Grid.Column>
                                                </Grid>
                                            )
                                        }
                                    }}
                                />
                            </Router>
                        </div>
                    </main>
                </div>
            </div>
        </div>
        
        </>
      );

}