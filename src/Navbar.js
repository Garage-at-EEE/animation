import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() { 
    const [isMobileView, setIsMobileView] = useState(false);

    const toggleView = () => {
      setIsMobileView(!isMobileView);
      // You should also have some logic here to actually change the view of your app
      // For example, by setting a class on the body or a context value that your components use to determine their layout
    };

    return (
        <nav className="nav">
            <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/account">Account</Link></li>
                <li><Link to="/follow-us">Follow Us</Link></li>
                <li><Link to="/help">Help</Link></li>
            </ul>
        </nav>
    );
}
