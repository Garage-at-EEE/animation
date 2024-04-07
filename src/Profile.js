import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardImage, MDBBtn, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import axios from 'axios';
import './Profile.css';


function ProfileCard({ profileData }) {
  const [points, setPoints] = useState(55); // Initial points the user has
  const [rewards, setRewards] = useState([ // Mock data for rewards
    { id: 1, name: 'Laptop', cost: 25 },
    { id: 2, name: 'Headphones', cost: 15 },
    { id: 3, name: 'Gift Card', cost: 10 },
    // Add more rewards here
  ]);
  const navigate = useNavigate();

  const handleRedeemReward = async (reward) => {
    if (points < reward.cost) {
      alert('Not enough points to redeem this reward.');
      return;
    }

    // Here, you would typically make an API call to your server to handle the redemption
    // For the sake of this example, we'll simply subtract the cost from the current points
    const updatedPoints = points - reward.cost;
    setPoints(updatedPoints);

    // After the "purchase", you might want to do additional tasks, like navigating to a success page
    // or showing a confirmation message. For now, we'll just show an alert.
    alert(`You've redeemed the reward: ${reward.name}`);
  };

  return (
    <MDBContainer className="profile-container table-responsive" style={{color:'white'}}>
      <h3>{profileData.name}'s Points: {points}</h3>
      <MDBTable className="mdb-table">
        <MDBTableHead>
          <tr>
            <th>Reward</th>
            <th>Cost (Points)</th>
            <th>Redeem</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {rewards.map(reward => (
            <tr key={reward.id}>
              <td>{reward.name}</td>
              <td>{reward.cost}</td>
              <td>
                <MDBBtn onClick={() => handleRedeemReward(reward)}>Redeem</MDBBtn>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
      {/* The rest of your profile card JSX */}
    </MDBContainer>
  );
}

ProfileCard.defaultProps = {
  profileData: {
    name: "Kevin Ting",
    // Include other default profile data here
  }
};

export default ProfileCard;
