import React from "react";
import { MDBBtn } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import './FollowUs.css'; // Path to your CSS file for styling

const socialMediaAccounts = [
  // Define location if needed, or remove from the rendered JSX if not.
  { name: 'GarageEEE Instagram', location: 'Location 1', handle: '@garage_at_eee', url: 'https://www.instagram.com/garage_at_eee/' },
  { name: 'GarageEEE Facebook', location: 'Location 2', handle: 'Garage at EEE NTU', url: 'https://www.facebook.com/GARAGEATEEE/' },
  { name: 'GarageEEE LinkedIn', location: 'Location 3', handle: '@Garage@EEE', url: 'https://www.linkedin.com/company/garage-eee/?originalSubdomain=sg' },
];

function SocialMediaPage() {
  const navigate = useNavigate();

  const goHome = () => {
    console.log('Attempting to navigate home'); // Debugging line
    navigate('/'); // This should navigate the user to the home page
  };

  return (
    <>
      <div className="social-media-container">
        {socialMediaAccounts.map(account => (
          <div className="social-media-card" key={account.name}>
            <div className="social-media-header">
              <h2>{account.name}</h2>
            </div>
            <div className="social-media-body">
              <p>Location: {account.location}</p>
              <p>Handle: {account.handle}</p>
              <a href={account.url} target="_blank" rel="noopener noreferrer">Visit</a>
            </div>
          </div>
        ))}
      </div>

      <div className="home-button-container">
        <MDBBtn onClick={goHome}>Back Home</MDBBtn>
      </div>
    </>
  );
}

export default SocialMediaPage;
