import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

function Profile() {
  // ... other state variables
  const [items, setItems] = useState([]);
  const [points, setPoints] = useState(100); // Actual points the user has
  const [tentativePoints, setTentativePoints] = useState(100); // Tentative points based on selection
  const [rewards, setRewards] = useState([]);
  const [selectedRewards, setSelectedRewards] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryItems, setSummaryItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const endpointURL =
      "https://script.google.com/macros/s/AKfycbzFKN07XS2IozAXsaZzCugG72jh2NSwfou9fKAfEV3FOiYBHS13qkb_QlWq6ZC7OqL3/exec";
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

  const handleCheckboxChange = (uniqueKey, isSelected) => {
    const price = rewards.find(
      (reward) => reward.uniqueKey === uniqueKey
    ).innocreditPrice;

    setSelectedRewards((prevSelectedRewards) => {
      const newSelectedRewards = {
        ...prevSelectedRewards,
        [uniqueKey]: isSelected,
      };

      // Update tentative points based on the new selection state
      setTentativePoints((currentPoints) => {
        const selectedItems = rewards.filter(
          (reward) => newSelectedRewards[reward.uniqueKey]
        );
        const totalCost = selectedItems.reduce(
          (acc, item) => acc + item.innocreditPrice,
          0
        );
        return points - totalCost;
      });

      return newSelectedRewards;
    });
  };

  const handlePurchase = () => {
    // Gather selected items
    const selectedItems = rewards.filter(
      (reward) => selectedRewards[reward.uniqueKey]
    );
    const totalCost = selectedItems.reduce(
      (acc, item) => acc + item.innocreditPrice,
      0
    );

    if (tentativePoints >= totalCost) {
      // Prepare a summary of the selected items
      setSummaryItems(selectedItems);
      // Show the summary to the user for confirmation
      setShowSummary(true);
    } else {
      alert("You do not have enough points for this purchase.");
    }
  };

  const goHome = () => {
    navigate("/");
  };

  const finalizePurchase = async () => {
    // Gather selected items
    const selectedItems = rewards.filter(
      (reward) => selectedRewards[reward.uniqueKey]
    );
    const totalCost = selectedItems.reduce(
      (acc, item) => acc + item.innocreditPrice,
      0
    );

    if (tentativePoints >= totalCost) {
      // Prepare the payload with the selected items for the POST request
      const payload = selectedItems.map((item) => ({
        id: item.uniqueKey,
        itemName: item.itemName,
        cost: item.innocreditPrice,
      }));

      try {
        // TODO: Replace 'your_endpoint' with the actual endpoint provided by your backend
        // const response = await axios.post(
        //   "https://script.google.com/macros/s/AKfycbyR7JnRDjBZ67VCHSWgu1zWDbF95cajKGWmEjXLRf92ST8Mcv22naqUTuXDRTk3JGzD/exec",
        //   payload,
        //   {
        //     mode: "no-cors",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );

        const response = await axios.post(
          "https://script.google.com/macros/s/AKfycbyZVob9L1HLQh4PO5zbAwL9182lMBnMCF31wgnkUuq3BqMj_es-gnVsOfu601NhRIOq/exec",
          {
            matric: "u2020912L",
            passcode: "2901",
            type: "purchase",
            item: [
              {
                itemName: "Stickers",
                quantity: 3,
              },
              {
                itemName: "Shirts",
                quantity: 1,
              },
            ],
          },
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
          setPoints(tentativePoints);
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
                  {item.itemName} - {item.innocreditPrice} points
                </li>
              ))}
            </ul>
            <div className="summary-total">
              Total:{" "}
              {summaryItems.reduce(
                (acc, item) => acc + item.innocreditPrice,
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
        <div className="loading-container">Loading...</div>
      ) : (
        <MDBContainer
          className="profile-container table-responsive"
          style={{ color: "white" }}
        >
          {/* Assume points is a number */}
          <h3>Profile's Points: {tentativePoints}</h3>
          <MDBTable className="mdb-table">
            <MDBTableHead>
              <tr>
                <th style={{ textAlign: "center" }}>Image</th>
                <th style={{ textAlign: "center" }}>Reward</th>
                <th style={{ textAlign: "center" }}>Cost (Points)</th>
                <th style={{ textAlign: "center" }}>Select</th>{" "}
                {/* Align the header for checkboxes */}
              </tr>
            </MDBTableHead>

            <MDBTableBody>
              {rewards.map((reward) => (
                <tr key={reward.uniqueKey}>
                  <td>
                    <img
                      src={
                        reward.image.preview_url || reward.image.download_url
                      }
                      alt={reward.itemName}
                      style={{ width: "50px", height: "auto" }} // Adjust size as needed
                    />
                  </td>
                  <td>{reward.itemName}</td>
                  <td>{reward.innocreditPrice}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRewards[reward.uniqueKey]}
                      onChange={(e) =>
                        handleCheckboxChange(reward.uniqueKey, e.target.checked)
                      }
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
