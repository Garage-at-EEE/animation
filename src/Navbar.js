import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar(){ 
    return (
        <nav className="nav">
            <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/account">Account</Link></li>
                <li><Link to="/follow-us">Follow Us</Link></li> {/* Make sure the path matches the Route path you have in App.js */}
                <li><Link to="/help">Help</Link></li>
            </ul>
        </nav>
    );
}
