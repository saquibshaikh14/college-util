import '../components/stylesheet/HomeScreen.css';
import React from 'react'
import { Link } from 'react-router-dom';


export default function HomeScreen() {
    return (
        <div className="container">
            <Link className="hs-link" to="/log-in">Login</Link>
            <Link className="hs-link" to="/sign-up">Sign up</Link>
        </div>
    )
}
