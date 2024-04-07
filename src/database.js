import React from "react";
import { motion } from "framer-motion";
import { BrowserRouter, Routes, Route, Link, useNavigate} from 'react-router-dom';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import './Profile.css'; // Assume you have a CSS file for profile-specific styles
import './App.js'

function ProfileCard({ profileData }) {

  const { name, title, articles, followers, rating, avatar } = profileData;
  const navigate = useNavigate();

  const backMenu = () => {
    navigate('/'); // Navigate to Profile page
  };

  const myData = () => {
    navigate('/database'); // Navigate to Profile page
  };

  return (
    <Routes>
    <Route path="/" element={
      <MDBContainer className="profile-container">
      <MDBRow className="justify-content-center">
        <MDBCol>
          <MDBCard className="profile-card">
            <MDBCardImage
              className="profile-avatar"
              src={profileData.avatar}
              alt={profileData.name}
        />
        <h2 className="profile-name">{profileData.name}</h2>
        <h3 className="profile-title">{profileData.title}</h3>
        <div className = "backMenu">
        <MDBBtn outline className="profile-action" onClick={backMenu}>Home</MDBBtn>
      </div>
      <div className = "continue">
        <MDBBtn outline className="mydata" onClick={myData}>my Database</MDBBtn>
      </div>
      </MDBCard>
    </MDBCol>
  </MDBRow>
</MDBContainer>

    } />
    <Route path="./" element={<backMenu />} />
    </Routes>
  );
}

// Set default props in case they aren't passed
ProfileCard.defaultProps = {
  profileData: {
    name: "Kevin Ting",
    title: "Senior T&D",
    avatar: "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_640.png"
  }
};

export default ProfileCard;
