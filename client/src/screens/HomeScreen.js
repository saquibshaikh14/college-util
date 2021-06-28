import '../components/stylesheet/HomeScreen.css';
import React from 'react'
import { AnimatedText } from "../AnimatedText/AnimatedText";


export default function HomeScreen() {
    const redirectMe = (url) => {
        window.location.href = url;     
    }

    return (
        <div className="container">
                <AnimatedText
                    textColor="#fdc52c"
                    overlayColor="#fc0345"
                >
                   Welcome To<br/>Document Management System
                </AnimatedText>
            {/* <div className="containerTwo">
                <Link className="hs-link" to="/log-in">Login</Link>
                <Link className="hs-link" to="/sign-up">Sign up</Link>
            </div> */}
            <div className="ui buttons containerTwo">
            <button className="ui violet button" onClick={()=>redirectMe('/log-in')}>LogIn</button>
            <div className="or"></div>
            <button className="ui green button" onClick={()=>redirectMe('/sign-up')}>SignUp</button>
            </div>
        </div>
    )
}