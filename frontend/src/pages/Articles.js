import React, { useState } from "react";
import blue from "../assets/blue.jpg"; // Ensure the path is correct
import { color } from 'framer-motion';

function Articles() {
  return (
    <section style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}><strong>ARTICLE</strong></h1>
        <p style={styles.subtitle}>Tracking salinity levels in wells to ensure clean and safe drinking water</p>
      </header> 

      <div style={styles.content}>
        <main style={styles.mainArticle}>
          <h2 style={styles.articleTitle}>Bantayan's Locale Underwater Evaluation System</h2>
          <div style={styles.imageContainer}>
            <img 
              src={blue} 
              alt="BANTAYAN" 
              style={styles.image} 
            />
            
          </div>
          <p style={styles.articleText}>
          Both factors are crucial in determining whether well water is suitable for drinking, agriculture, or industrial use. High salinity can result in dehydration and kidney problems if consumed regularly, while extreme pH levels may cause irritation to the skin and eyes. For agriculture, imbalanced salinity or pH can hinder plant growth, reduce soil fertility, and affect crop yields. In households, water with improper pH or high salinity can cause corrosion in appliances and plumbing systems, leading to maintenance issues and additional costs. Ensuring optimal levels is vital for sustainability, public health, and economic stability. </p>
          <p style={styles.articleText}>
          Both factors are crucial in determining whether well water is suitable for drinking, agriculture, or industrial use. High salinity can result in dehydration and kidney problems if consumed regularly, while extreme pH levels may cause irritation to the skin and eyes. For agriculture, imbalanced salinity or pH can hinder plant growth, reduce soil fertility, and affect crop yields. In households, water with improper pH or high salinity can cause corrosion in appliances and plumbing systems, leading to maintenance issues and additional costs. Ensuring optimal levels is vital for sustainability, public health, and economic stability. </p>
          <br></br>  <p style={styles.articleText}>
          Causes of Variations
          a. Factors influencing salinity and pH levels in wells (natural and human-induced). 
          b. Geographic and environmental considerations. 
          c. Impact & Consequences
          </p> 

          <br></br>

           <p style={styles.articleText}><strong>
           A. Factors influencing salinity and pH levels in wells (natural and human-induced)
           Natural Factors Affecting Salinity and pH Levels
           </strong></p>
           
            <br></br>
          

</main>

        <aside style={styles.sidebar}>
          <div style={styles.section}>
            <h3>What are Salinity and ph Levels?</h3>
            <p>Salinity and pH levels are key indicators of water quality, influencing its safety and usability. Salinity refers to the concentration of dissolved salts in water, typically measured in parts per thousand (ppt) or milligrams per liter (mg/L). Salinity can affect the taste, odor, and usability of water. High salinity levels can make water unsuitable for drinking, irrigation, or industrial use. 
            Salinity refers to the concentration of dissolved salts (mainly sodium chloride, but also calcium, magnesium, and other ions) in water. It is measured in parts per thousand (ppt) or total dissolved solids (TDS) in milligrams per liter (mg/L)
            </p>
            <p>Salinity is usually measured by assessing the concentration of total dissolved solids (TDS), which include: </p>
            <p><strong>1. Sodium chloride (NaCl, or common table salt) 
            2. Calcium carbonate (CaCO3) 
            3. Magnesium sulfate (MgSO4) 
            4. Potassium chloride (KCl) 
            </strong> Excessive salinity can make water undrinkable, harm crops, and corrode pipes. pH levels, on the other hand, measure how acidic or alkaline water is on a scale from 0 to 14, with 7 being neutral. Water that is too acidic or too alkaline can damage plumbing, affect aquatic life, and pose health risks. 
            Here's a rough guide to pH levels: 
            - Acidic: pH 0-6.9 (e.g., vinegar, lemon juice)
            - Neutral: pH 7 (e.g., pure water) 
            - Alkaline: pH 7.1-14 (e.g., baking soda, soap)
             </p>
          </div>

          <div style={styles.section}>
            <h3>pH Level </h3>
            <p><strong>pH measures the acidity or alkalinity of water on a scale from 0 to 14, where: </strong></p>
            <ol>
              <li>•7 is neutral</li>
              <li>•Below 7 is acidic </li>
              <li>•Above 7 is alkaline </li>
              <li>•Normal Range for Well Water: Ideal drinking water pH is between 6.5 and 8.5.</li>
            </ol>
            <p><strong>Key Factors Influencing Salinity and pH Levels</strong></p>
            <p><strong>1.	Natural Factors</strong></p>
            <ol>
              <li>o	Geology: The composition of rocks and soil affects mineral content in water.</li>
              <li>o	Seawater Intrusion: Over-extraction of groundwater in coastal areas leads to increased salinity.</li>
              <li>o	Rainfall & Drought: Heavy rainfall dilutes salts, while drought concentrates minerals.</li>
              <li>o	Volcanic & Geothermal Activity: These contribute to acidic water.</li>
            </ol>
            <p><strong>2.	Human Activities</strong></p>
            <ol>
              <li>o	Over-Pumping of Wells: Leads to groundwater depletion and higher mineral concentration.</li>
              <li>o	Agricultural Runoff: Fertilizers and pesticides alter pH and salinity.</li>
              <li>o	Industrial & Domestic Waste: Chemicals from waste disposal affect water chemistry.</li>
              <li>o	Deforestation & Poor Land Management: Erosion introduces minerals and organic matter into groundwater.</li>
            </ol>
          </div>
        </aside>
      </div>
      <main style={styles.mainArticle1}>
  <div style={styles.imageTextContainer}>
    <div style={styles.imageText}>
        <p>
<strong> 1.	Geological Composition of Aquifers</strong>
<br></br>
The type of rock and soil through which groundwater flows directly affects its mineral content, influencing both salinity and pH.
	Limestone and carbonate rocks tend to raise the pH of water, making it more alkaline. This occurs because water dissolves calcium carbonate, a common mineral in these rocks, which can also lead to scaling in pipes and plumbing systems.
	Sulfur and pyrite deposits contribute to water acidity. When pyrite (iron sulfide) is exposed to oxygen and water, it forms sulfuric acid, which lowers the pH and increases the risk of corrosion in metal pipes.
	Granite and quartz-dominant formations have little effect on salinity and pH because they contain fewer soluble minerals. However, water in these areas may become slightly acidic due to the lack of natural buffering minerals.<br></br>
<strong>2.	Seawater Intrusion</strong>
<br></br>
Coastal areas are at risk of seawater mixing with freshwater wells, especially when excessive groundwater extraction lowers the water table. This process allows denser seawater to move inland, increasing the salt concentration in wells.
o	Seawater contains high levels of dissolved salts, around 35 parts per thousand (ppt), which can make water undrinkable and unsuitable for irrigation.
o	Factors that worsen seawater intrusion include over-pumping of wells, land subsidence, and rising sea levels due to climate change.
o	Once seawater contamination occurs, it is difficult to reverse without reducing groundwater extraction or implementing artificial recharge methods.<br></br>
<strong>3.	Rainfall and Drought Conditions</strong>
<br></br>
The amount and frequency of rainfall have a direct impact on groundwater quality.
o	Heavy rainfall helps dilute salts in the soil and aquifers, improving water quality. However, in areas affected by acid rain, precipitation can lower the pH of well water by introducing sulfuric and nitric acids from industrial pollution.
o	Drought conditions lead to increased salinity because less rainwater is available to replenish and flush out dissolved salts. As groundwater levels drop, minerals become more concentrated, making the water harder and saltier.
o	In hot and arid regions, high evaporation rates remove water while leaving behind concentrated minerals, further increasing salinity levels.<br></br>
<strong>4.	Volcanic and Geothermal Activity</strong>
<br></br>
Groundwater in volcanic or geothermal areas often has unique chemical properties due to interactions with volcanic gases and minerals.
o	Volcanic gases such as carbon dioxide, sulfur dioxide, and hydrogen sulfide dissolve in water, forming acidic compounds that lower pH levels.
o	Geothermal hot springs and wells tend to contain dissolved minerals like sulfates, chlorides, and heavy metals, increasing salinity and altering water taste.
o	Lava and volcanic ash deposits can also affect water chemistry by introducing silica and trace metals that influence pH and mineral content.<br></br>
<strong>5.	Soil Erosion and Sedimentation</strong>
<br></br>
When land erosion occurs, it can introduce soil particles and organic matter into groundwater, affecting both salinity and pH.
o	Fine sediments, especially clay, can carry minerals such as sodium, calcium, and magnesium, which dissolve in water and alter its composition.
o	Organic material from eroded soil can lead to microbial activity, producing weak acids that lower pH and contribute to water turbidity.
o	Poor land management, deforestation, and heavy rainfall can accelerate soil erosion, leading to long-term changes in groundwater chemistry.<br></br>
        </p>

    </div>

    <div style={styles.imageContainer1}>
      <img src={blue} alt="BANTAYAN" style={styles.image1} />
    </div>
  </div>
</main>

    </section>
    
  );
  
}

const styles = {
  container: {
    width: "100%",
    overflowX: "hidden",
    overflowY: "auto", // Change to 'hidden' if you want to completely remove vertical scrolling
  },
  header: {
    textAlign: 'center',
    borderBottom: '2px solid black',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  articleTitle: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  title: {
    fontSize: '60px',
    fontWeight: 'bold',
    margin: '10px 0',
    color: 'white',
  },
  subtitle: {
    fontSize: '18px',
    fontStyle: 'italic',
    color: 'white',
  },
  content: {
    display: 'flex',
    gap: '10px', // Smaller gap to maintain closeness
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  mainArticle: {
    flex: 2,
    padding: '1px',
    borderRadius: '10px',
    backgroundColor: 'white',
  },
  sidebar: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    boxShadow: '0 4px 8px #000000',
  },
  section: {
    marginBottom: '10px',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  image: {
    width: '80%',
    borderRadius: '10px',
    boxShadow: '0 4px 8px #000000',
  },
  articleText: {
    textAlign: 'justify',
    maxWidth: '800px',
    margin: 'auto',
  },
  mainArticle1: {
    textAlign: 'center',
    marginTop: '20px',
  },
  articleTitle1: {
    textAlign: 'right',
    paddingRight: '70px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '0px',
  },
  imageContainer1: {
  flex: 1,
  display: 'flex',
  width: '70%',
  justifyContent: 'center', // Keeps image on the right
},
  image1: {
    width: '80%', // Adjust size as needed
    borderRadius: '10px',
    boxShadow: '0 4px 8px #000000',
  },
  imageTextContainer: {
    display: 'flex',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '20px',
  },
  
  imageText: {
    flex: 5, // Takes available space
    marginLeft: '60px',
    textAlign: 'justify',
    fontSize: '16px',
    maxWidth: '50%', // Limits width so it doesn't push the image too much
    marginRight: '5px',
    color: 'black',
  },
};

export default Articles;