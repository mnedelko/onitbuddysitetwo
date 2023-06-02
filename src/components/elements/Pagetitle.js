import React from "react";
import ScrollAnimation from "react-animate-on-scroll";

function Pagetitle({ title }) {
  return (
    <>
      <ScrollAnimation
        animateIn="fadeInUp"
        animateOut="fadeInOut"
        animateOnce={true}
      >
        <h1 className="sub-heading"><span className="tf-text s1">{title}</span></h1>
      </ScrollAnimation>
      <div className="spacer" data-height="60"></div>
    </>
  );
}

export default Pagetitle;
