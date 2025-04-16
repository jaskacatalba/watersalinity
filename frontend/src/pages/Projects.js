import React, { useState } from "react";

function Projects() {
  return (
    <section style={styles.section}>
      <h1>Projects</h1>
      <p>Discover initiatives focused on water sustainability and salinity monitoring.</p>

      <div style={styles.containerWrapper}>
        <div style={styles.container}>Project 1</div>
        <div style={styles.container}>Project 2</div>
        <div style={styles.container}>Project 3</div>
        <div style={styles.container}>Project 4</div>
        <div style={styles.container}>Project 5</div>
        <div style={styles.container}>Project 6</div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    textAlign: 'center',
    padding: '20px',
    //backgroundImage: url(''), // Set your image path here
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed', // Keeps background steady when scrolling
    minHeight: '100vh', // Ensures it covers the full viewport height
  },
  containerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    width: '225%',
    maxWidth: 'none',
    height: '500px',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    marginBottom: '20px',
    border: '2px solid black',
  },
};

export default Projects;