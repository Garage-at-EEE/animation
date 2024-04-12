import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBTable, MDBTableBody, MDBTableHead, MDBBtn } from 'mdb-react-ui-kit';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [items, setItems] = useState([]);
  const [points, setPoints] = useState(55); // Initial points the user has
  // Assuming rewards are fetched from the API, if not, define them here
  const [rewards, setRewards] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpointURL = 'https://script.google.com/macros/s/AKfycbwNPEKAEJ2u5pc0g1C5UTKykHjcyW7bLKTOejtFsst8ICDWX3xykIXGBfpuDZJr5Ds8/exec';
        const response = await axios.get(endpointURL);
        setItems(response.data); // Assuming response.data is the array of items
        // If the rewards are also part of the response, set them here
        // setRewards(response.data.rewards);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  // Define handleRedeemReward here
  const handleRedeemReward = (reward) => {
    if (points < reward.cost) {
      alert('Not enough points to redeem this reward.');
      return;
    }
    // Subtract the cost from the current points and update the state
    setPoints(points - reward.cost);
    // Other logic for redeeming reward...
    alert(`You've redeemed the reward: ${reward.name}`);
  };

  // If you need the profile data (like the name of the user), fetch it from the API or define it here

  return (
    <MDBContainer className="profile-container table-responsive" style={{color:'white'}}>
      <h3>Profile's Points: {points}</h3>
      <MDBTable className="mdb-table">
        <MDBTableHead>
          <tr>
            <th>Reward</th>
            <th>Cost (Points)</th>
            <th>Redeem</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {rewards.map((reward, index) => (
            <tr key={index}> {/* Use unique ids for keys if possible */}
              <td>{reward.name}</td>
              <td>{reward.cost}</td>
              <td>
                <MDBBtn onClick={() => handleRedeemReward(reward)}>Redeem</MDBBtn>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
    </MDBContainer>
  );
}

export default Profile;
