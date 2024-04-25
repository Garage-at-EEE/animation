import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate} from 'react-router-dom';
import './App.css';
import { Container, Row, Col, Button, Card, Form, Breadcrumb } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import Rewards from './Rewards'; // Import the Rewards component
import logo from './White Garage Logo.png';
import { Animator, ScrollContainer, ScrollPage, Sticky, StickyIn, ZoomIn, batch, Fade, FadeIn, MoveOut } from 'react-scroll-motion';
import Profile from './Profile';
import "./index.css";
import Navbar from './Navbar';
import { motion } from "framer-motion";
import FollowUs from './FollowUs';
import axios from "axios";

// Then use Zoom in your Animator component

const ZoomInScrollOut =batch(StickyIn(),FadeIn(), ZoomIn());

function App() {
  const navigate = useNavigate();
  const text1 = "Hi, Garage Ambassadors !".split(" ");
  const text2 = "Your contribution matters! Swipe down to discover the exciting reward awaiting you.".split(" ");
  const [logoScale, setLogoScale] = useState(1);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [cardPosition, setCardPosition] = useState(0);
  const [matric, setMatric] = useState('');
  const [passcode, setPasscode] = useState('');
  const [points, setPoints] = useState(0); // Points should be a number
  const [isLoading, setIsLoading] = useState(false); // To track loading state
  const [loginError, setLoginError] = useState('');


  const resetLoading = () => {
    setIsLoading(false);
  };
  
  const handleScroll = () => {
    const position = window.pageYOffset;
    const newScale = Math.max(0.5, 1 - position / 500); // Adjust the denominator for speed
    setLogoScale(newScale);

    const newOpacity = Math.max(0, 1 - position / 250); // Adjust as necessary for timing
    setContentOpacity(newOpacity);

    const newPosition = Math.min(position, 200); // Adjust 200 to control how high the card goes
    setCardPosition(newPosition);
  }; // Correctly closes handleScroll function

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Correctly closes useEffect call

  const handleLogin = async () => {
    setIsLoading(true);
    setLoginError('');

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    };
  
    console.log(`Attempting to log in with matric: ${matric} and passcode: ${passcode}`);
   
    try {
      const response = await axios.post('https://script.google.com/macros/s/AKfycbyZVob9L1HLQh4PO5zbAwL9182lMBnMCF31wgnkUuq3BqMj_es-gnVsOfu601NhRIOq/exec', {
        matric: matric,
        passcode: passcode,
        type: "userdata"
      }, config);
  
      console.log('Response:', response); // Debugging line to see what's returned from the backend
  
      // Check for successful login response
      if (response.data.status === "DATA RETRIEVAL SUCCESSFUL") {
        // If the data retrieval is successful, navigate to the Profile page
        navigate('/Profile', { state: { user: response.data.info, points: response.data.info.currentInnocredit } });
      } else {
        // Handle unsuccessful login
        setLoginError("Wrong username or passcode.")
      }
      // ... rest of your existing code
    } catch (error) {
      console.error("Error logging in: ", error);
      setLoginError("An Error occured. Please try again.")
      // Maybe set an error message in state and display it
    } finally{
      setIsLoading(false);
    }
  };
  
 

    return (
      <div className="App">
        <Navbar />
        <Routes>
        <Route path="/" element={
        <div className="main-content">
          <ScrollContainer>
            <ScrollPage page={0}>
              <Animator animation={batch(Sticky(), Fade(), MoveOut(0,-200))}>
                <motion.div
                  style={{
                    transform: `translateY(-${cardPosition}px)`, // Move card up based on scroll
                    transition: 'transform 0.5s ease-out' // Smooth transition for the movement
                  }}
                >
                  <Card className="mb-3" style={{ color: "#686A6C", maxHeight: "500px", maxWidth: "1500px", margin: "auto" }}>
                    <motion.div
                      style={{
                        scale: logoScale,
                        transition: { duration: 0.5 }
                      }}
                    >
                      <Card.Img src={logo} />
                    </motion.div>
                    <Card.Body>
                      <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: contentOpacity }}
                        transition={{ duration: 0.5 }}
                      >
                        <Card.Title style={{ color: 'white', fontSize: '2.0rem' }}>
                          {text1.map((el, i) => (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: i / 10 }} key={i}>
                              {el}{" "}
                            </motion.span>
                          ))}
                        </Card.Title>
                        <Card.Text style={{ color: 'white', fontSize: '1.3rem' }}>
                          {text2.map((el, i) => (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: i / 10 }} key={i}>
                              {el}{" "}
                            </motion.span>
                          ))}
                        </Card.Text>
                      </motion.div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Animator>
            </ScrollPage>

              <ScrollPage page={1}>
                <Animator animation={ZoomInScrollOut}>                
                  <Form className="Form">
                      <Row>
                      <Form.Group controlId="formEmail">
                      <Form.Label>Matric Number</Form.Label>
                      <Form.Control
                        type="text" // this should probably be type="text" instead of type="email"
                        placeholder="eg. U123456789A"
                        value={matric}
                        onChange={(e) => setMatric(e.target.value)}
                      />
                    </Form.Group>
                    <Col md>
                      <Form.Group controlId="formPassword">
                        <Form.Label>Day of Birth</Form.Label>
                        <Form.Control
                          type="password" // or type="text" if it's not sensitive information
                          placeholder="DDMM"
                          value={passcode}
                          onChange={(e) => setPasscode(e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                      </Row>

                      <Row>
                      <Col>
                        <Button variant="secondary" onClick={handleLogin} style={{ color: 'white' }}> 
                          {isLoading ? (
                            <div className="loading-spinner"></div>
                          ) : (
                            "Login"
                          )}
                        </Button>
                        {/* Display error message if login fails */}
                        {loginError && (
                          <div style={{ color: 'red', marginTop: '10px' }}>{loginError}</div>
                        )}
                      </Col>
                    </Row>

                                            
                  </Form>
                </Animator>
              
              </ScrollPage>          
                          
            </ScrollContainer>
            </div>  
          } />
              <Route path="/follow-us" element={<FollowUs />} />
              <Route path="/Profile" element={<Profile resetLoading={resetLoading} />} />
            </Routes>
 
        </div>  
    );
}


export default App;

