import React from "react";
import ScrollAnimation from "react-animate-on-scroll";


function Timeline({ education }:any) {
  const { years, title, content } = education;
  return (
    //@ts-ignore
    <ScrollAnimation
      animateIn="fadeInUp"
      animateOut="fadeInOut"
      animateOnce={true}
    >
      <div className="timeline-container">
        <div className="content">
          <span className="time">{years}</span>
          <h3 className="title">{title}</h3>
          <p>{content}</p>
        </div>
      </div>
    </ScrollAnimation>
  );
}

export default Timeline;
