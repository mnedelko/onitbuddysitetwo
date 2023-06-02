import React from "react";
import Timeline from "../elements/Timeline";

const educationData = [
  {
    id: 1,
    title: "OnitBuddy Origin Collection: Pre-Sale Commences",
    years: "Jan 23rd, 2023",
    content:
      "Presale and whitelisting commences on Discord channel.",
  },
  {
    id: 2,
    title: "OnitBuddy Origin Collection Launches",
    years: "Feb 30th, 2022",
    content:
      "Release of 8080 strictly limited PFP Collection featuring more than 100 unique hand-crafted traits.",
  },
  {
    id: 3,
    title: "OnitBuddy Open Source Design System launch",
    years: "Funding Goal: 20% of NFT Supply sold",
    content:
      "OnitBuddy's Open Source Design System starts accepting community contributions.",
  },
];

const experienceData = [
  {
    id: 1,
    title: "NFTT transmorg protocol V1 Release",
    years: "Funding Goal: 65% of NFT Supply Sold",
    content:
      "OnitBuddy's Open Source Design System accepts community contributions",
  },
  {
    id: 2,
    title: "Onit Transmorg Collection Launches",
    years: "Funding Goal: 70% of NFT Supply Sold",
    content:
      "Release of the transmorg portal enabling the ability to combine NFTs via the transmorg protocol.",
  },
  {
    id: 3,
    title: "Transmorg Portal V1",
    years: "Funding Goal: 100% of NFT Supply Sold",
    content:
      "Release of the transmorg portal delivering a UI-enabled platform permitting users to combine NFTs via the NFTT transmorg protocol.",
  },
];

function Experiences() {
  return (
    <section className="tf-section popular-collection" id="roadmap">     
      <div className="themesflat-container">
          <div className="wrap-heading">
              <div className="content">
                  <h2 className="heading">The Roadmap                                                                            
                  </h2>	
                  <p className="sub-heading mt-4 mb-4">Our Roadmap contains the following Objectives. To ensure our team is well positioned to drive towards these milestones transparently and decisively, certain roadmap objectvies have been made contingent on passing dinstict funding goals. 
                  </p>
              </div>
          </div>
          <div className="row ml-5 mt-5">
            <div className="col-md-6">
              <div className="timeline edu bg-white rounded shadow-dark padding-30 overflow-hidden">
                {educationData.map((education) => (
                  <Timeline key={education.id} education={education} />
                ))}
                <span className="line"></span>
              </div>
            </div>

            <div className="col-md-6">
              <div className="spacer d-md-none d-lg-none" data-height="30"></div>
              <div className="timeline edu bg-white rounded shadow-dark padding-30 overflow-hidden">
                {experienceData.map((experience) => (
                  <Timeline key={experience.id} education={experience} />
                ))}
                <span className="line"></span>
              </div>
            </div>
          </div>
          
      </div>
    </section>
  );
}

export default Experiences;
