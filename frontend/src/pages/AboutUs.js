import React, { useState } from "react";
import Slider from "react-slick"; // Import react-slick
import "slick-carousel/slick/slick.css"; // Import slick carousel styles
import "slick-carousel/slick/slick-theme.css"; 
import hi from "../assets/blue.jpg";
import add from "../assets/blue.jpg";

const AboutUs = () => {

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Show 1 image at a time
    slidesToScroll: 1,
    autoplay: true, // Auto-play images
    autoplaySpeed: 3000, // Change image every 3 seconds
  };

  return (
    <div style={styles.container}>
      <img src={add} alt="Header Image" style={styles.backgroundImage} />

      <div style={styles.content}>
        <h2>About Us</h2>
        <p>
          Salinity and pH variations have significant consequences for health, agriculture, and infrastructure.
          Proactive monitoring, sustainable water management, and regulatory measures are essential to ensure
          safe and high-quality water for future use.
        </p>
      </div>

      {/* Slideshow Section */}
      <div style={styles.sliderContainer}>
        <Slider {...settings}>
          <div>
            <img src={hi} alt="Slide 1" style={styles.sliderImage} />
          </div>
          <div>
            <img src={hi} alt="Slide 2" style={styles.sliderImage} />
          </div>
          <div>
            <img src={hi} alt="Slide 3" style={styles.sliderImage} />
          </div>
        </Slider>
      </div>

      <div style={styles.last}>
        <p>
          Drinking water must be free from pathogenic microorganisms, including bacteria (like E. coli), viruses, and parasites.
          The standard permissible level for total coliforms is zero.
          Chemical Contaminants: Heavy metals (like lead, arsenic, mercury), pesticides, nitrates, and fluoride are monitored and regulated.
          <br /><br />
          For example:
          <ul>
            <li>Lead: Maximum allowable concentration of 0.01 mg/L.</li>
            <li>Arsenic: Maximum allowable concentration of 0.01 mg/L.</li>
            <li>Chlorine: 0.2-0.5 mg/L residual chlorine must be present after disinfection.</li>
          </ul>
          <br />
          Physical Parameters: Water should be clear (low turbidity), colorless, and free from unpleasant odors and tastes.
          Salinity and pH levels are critical indicators of water quality, affecting its usability for drinking, agriculture, and industrial purposes.
        </p>
      </div>

    </div>
  );
};
const styles = {
    container: {
      padding: "15px",
      textAlign: "center",
      //backgroundColor: "#f5f5f5",
      maxWidth: "1300px",
    },
    backgroundImage: {
      width: "100%",
      height: "300px",
      objectFit: "cover",
      paddingBottom: "60px",
    },
    content: {
      maxWidth: "1300px",
      margin: "-50px auto 20px",
      padding: "10px",
      paddingTop: "40px",
      backgroundColor: "white",
      color: "black",
      borderRadius: "10px",
      boxShadow: '0 4px 8px #000000',
    },
    last: {
      maxWidth: "1250px",
      margin: "20px auto",
      padding: "30px",
      textAlign: "left",
      backgroundColor: "white",
      color: "black",
      borderRadius: "10px",
      boxShadow: '0 4px 8px #000000',
    }, 
    sliderImage: {
      width: "100%",
      height: "500px",
      objectFit: "cover",
      borderRadius: "8px",
    },
    sliderContainer: {
      maxWidth: "2000px",
      margin: "20px auto",
    },
  };

export default AboutUs;