import React, { useState, useEffect, useCallback } from "react";
import {
  MDBContainer,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import "./Profile.css";


function Profile({resetLoading}) {
  const [items, setItems] = useState([]);
  const [points, setPoints] = useState(0);
  const [tentativePoints, setTentativePoints] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [selectedRewards, setSelectedRewards] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryItems, setSummaryItems] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user; // Access user data passed in the state
  const userPasscode = location.state?.passcode;
  const pointsFromLogin = location.state?.points;

  const updatePointsFromState = () => {
    console.log('Updating points from state:', location.state);
    const userPoints = location.state?.user?.currentInnocredit;
    if (userPoints) {
      const numericPoints = Number(userPoints);
      setPoints(numericPoints);
      setTentativePoints(numericPoints);
    } else {
      console.error('Points not found in the state, defaulting to 0.');
      // You could choose to navigate away or leave this as a non-fatal error.
    }
  };

  useEffect(() => {
    console.log('location.state on mount:', location.state);
    if (location.state && location.state.user) {
      const userPoints = Number(location.state.user.currentInnocredit);
      if (!isNaN(userPoints)) {
        setPoints(userPoints);
        setTentativePoints(userPoints);
      } else {
        console.error('Invalid points value received from login state.');
      }
    } else {
      console.error('Invalid or missing state. Points cannot be set.');
    }
    fetchData();
    // Since fetchData is a dependency and it's defined outside of useEffect, you should either move its definition inside of useEffect or wrap it in a useCallback hook
  }, [location.state]); // Depend on location.state to ensure this runs when it updates
  
  const fetchData = async () => {
    const endpointURL =
      "https://script.google.com/macros/s/AKfycbyZVob9L1HLQh4PO5zbAwL9182lMBnMCF31wgnkUuq3BqMj_es-gnVsOfu601NhRIOq/exec";
    setIsLoading(true);
    try {
      const response = await axios.get(endpointURL);
      const dataWithUniqueKeys = response.data.map((item, index) => ({
        ...item,
        uniqueKey: index, // Assign the index as a unique key
        innocreditPrice: Number(item.innocreditPrice), // Convert the price to a number and add a comma after the uniqueKey line
      }));
      console.log(dataWithUniqueKeys);
      setRewards(dataWithUniqueKeys);

      const initialSelectionState = dataWithUniqueKeys.reduce((acc, item) => {
        acc[item.uniqueKey] = false; // Use the unique key for the selection state
        return acc;
      }, {});
      setSelectedRewards(initialSelectionState);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (uniqueKey, quantity) => {
    quantity = Number(quantity); // Convert to number to ensure calculations are correct
  
    // Update the selected rewards with the new quantity
    setSelectedRewards((prevSelectedRewards) => {
      const newSelectedRewards = {
        ...prevSelectedRewards,
        [uniqueKey]: quantity,
      };
  
      // Calculate the new total cost immediately using the updated rewards state
      const newTotalCost = rewards.reduce((totalCost, reward) => {
        const rewardQuantity = newSelectedRewards[reward.uniqueKey] || 0;
        return totalCost + rewardQuantity * reward.innocreditPrice;
      }, 0);
  
      // Update the tentative points based on the new total cost
      setTentativePoints(points - newTotalCost);
  
      return newSelectedRewards;
    });
  };
  
  
  const handlePurchase = useCallback (() => {
    // Gather selected items with their quantities
     const selectedItems = rewards.map((item) => ({
      ...item,
      quantity: selectedRewards[item.uniqueKey] || 0
    })).filter((item) => item.quantity > 0);
  
    // Calculate the total cost, considering the quantity
    const totalCost = selectedItems.reduce((acc, item) => {
      return acc + (item.quantity * item.innocreditPrice);
    }, 0);
  
    console.log(`Available points: ${points}`);
    console.log(`Tentative points before purchase: ${tentativePoints}`);
    console.log(`Total cost of selected items: ${totalCost}`);
    
    // Check if we have enough points
    if (tentativePoints >= totalCost) {
      // Here you should set summaryItems to include the quantity as well
      setSummaryItems(selectedItems);
  
      // Deduct points for the tentative state, don't update the actual points yet
      setTentativePoints(points - totalCost);
  
      // Show the summary modal
      setShowSummary(true);
    } else {
      alert("You do not have enough points for this purchase.");
    }
  },[points, selectedRewards, rewards]);
  
  

const goHome = () => {
  resetLoading(); // Reset the loading state
  navigate("/");
};


  const finalizePurchase = async () => {
    // Gather selected items
    
    const selectedItems = rewards.filter(
      (reward) => selectedRewards[reward.uniqueKey]
    );
    const totalCost = selectedItems.reduce((acc, item) => {
      return acc + item.innocreditPrice * (selectedRewards[item.uniqueKey] || 0);
    }, 0);

    console.log('Tentative points before purchase:', tentativePoints);

    if (tentativePoints >= totalCost) {

      try {
        const payload = {
          matric: user.matricNumber,
          passcode: userPasscode, // This assumes you have the passcode saved in the user object
          items: selectedItems.map(item => ({
            id: item.uniqueKey,
            itemName: item.itemName,
            quantity: selectedRewards[item.uniqueKey],
          })),
          totalCost: totalCost,
        };
  
        console.log('Sending request with payload:', payload); // Log the payload to verify its structure
  
        const response = await axios.post(
          "https://script.google.com/macros/s/AKfycbyZVob9L1HLQh4PO5zbAwL9182lMBnMCF31wgnkUuq3BqMj_es-gnVsOfu601NhRIOq/exec",
          payload,
          {
            redirect: "follow",
            mode: "cors",
            method: "POST",
            headers: {
              "Content-Type": "text/plain;charset=utf-8",
            },
          }
        );

        // Check the response status and perform actions accordingly
        if (response.status === 200) {
          console.log("Purchase successful:", response.data);
  
          // Deduct points permanently on confirmed purchase
          setPoints(prevPoints => prevPoints - totalCost);

          setSelectedRewards({}); // Reset the selection after purchase
          setShowSummary(false); // Close the summary view
          setSummaryItems([]); // Clear the summary items
        } else {
          console.error("Purchase failed:", response.data);
          // Handle the failed purchase accordingly
        }
      } catch (error) {
        console.error("Error sending data to the server:", error);
        // Handle the error accordingly
      }
    } else {
      alert("You do not have enough points for this purchase.");
    }
  };

  return (
    <>
      {showSummary && (
        <div className="purchase-summary-backdrop">
          <div className="purchase-summary-modal">
            <h3>Confirm Your Purchase</h3>
            <ul>
              {summaryItems.map((item) => (
                <li key={item.uniqueKey}>
                  {item.itemName} x {item.quantity} - {item.quantity * item.innocreditPrice} points
                </li>
              ))}
            </ul>

            <div className="summary-total">
              Total:{" "}
              {summaryItems.reduce(
                (acc, item) => acc + (item.quantity * item.innocreditPrice),
                0
              )}{" "}
              points
            </div>

            <button onClick={finalizePurchase}>Confirm Purchase</button>
            <button onClick={() => setShowSummary(false)}>Cancel</button>
          </div>
        </div>
      )}
      {isLoading ? (
  <div className="loading-container">
    <div className="spinner"></div>
    <h1>Loading...</h1>
  </div>
) : (
  <MDBContainer
    className="profile-container table-responsive"
    style={{ color: "white" }}
  >
    <h3>Profile's Points: {tentativePoints}</h3>
    <MDBTable className="mdb-table">
      <MDBTableHead>
        <tr>
          <th style={{ textAlign: "center" }}>Image</th>
          <th style={{ textAlign: "center" }}>Reward</th>
          <th style={{ textAlign: "center" }}>Cost (Points)</th>
          <th style={{ textAlign: "center" }}>Select</th> {/* Align the header for checkboxes */}
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {rewards.map((reward) => (
          <tr key={reward.uniqueKey}>
            <td>
              <img src={reward.image.preview_url} alt={reward.itemName} />
            </td>
            <td>{reward.itemName}</td>
            <td>{reward.innocreditPrice}</td>
            <td>
              <input
                type="number"
                className="quantity-input"
                min="0"
                value={selectedRewards[reward.uniqueKey] || 0}
                onChange={(e) => handleQuantityChange(reward.uniqueKey, e.target.value)}
              />
            </td>
          </tr>
        ))}
      </MDBTableBody>
        </MDBTable>
        <div className="home-button-container">
          <MDBBtn onClick={goHome}>Back Home</MDBBtn>
          <MDBBtn onClick={handlePurchase}>Purchase</MDBBtn>
        </div>
      </MDBContainer>
    )}

    </>
  );
}


export default Profile;
