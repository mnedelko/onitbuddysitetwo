import React, { useState, useEffect } from "react";
import ScrollAnimation from "react-animate-on-scroll";
import Pagetitle from "../elements/Pagetitle";
import Portfolio from "../../components/elements/Portfolio";
import imgbg from '../../assets/images/backgroup-secsion/img_bg_page_title.jpg';

const ears1 = require('../../assets/images/works/Ears/Ears1.png');
const ears2 = require('../../assets/images/works/Ears/Ears2.png');
const ears3 = require('../../assets/images/works/Ears/Ears3.png');
const ears4 = require('../../assets/images/works/Ears/Ears4.png');
const ears5 = require('../../assets/images/works/Ears/Ears5.png');
const ears6 = require('../../assets/images/works/Ears/Ears6.png');
const ears7 = require('../../assets/images/works/Ears/Ears7.png');

const face1 = require('../../assets/images/works/Faces/Face1_Skintone1.png');
const face2 = require('../../assets/images/works/Faces/Face2_Skintone1.png');
const face3 = require('../../assets/images/works/Faces/Face3_Skintone1.png');
const face4 = require('../../assets/images/works/Faces/Face4_Skintone1.png');

const eyes1 = require('../../assets/images/works/Eyes/Eyes1.png');
const eyes2 = require('../../assets/images/works/Eyes/Eyes2.png');
const eyes3 = require('../../assets/images/works/Eyes/Eyes3.png');
const eyes4 = require('../../assets/images/works/Eyes/Eyes4.png');
const eyes5 = require('../../assets/images/works/Eyes/Eyes5.png');
const eyes6 = require('../../assets/images/works/Eyes/Eyes6.png');
const eyes7 = require('../../assets/images/works/Eyes/Eyes7.png');

const mouth1 = require('../../assets/images/works/Mouth/ahmouth.png');
const mouth2 = require('../../assets/images/works/Mouth/cheekymouth.png');
const mouth3 = require('../../assets/images/works/Mouth/grinmouth.png');
const mouth4 = require('../../assets/images/works/Mouth/gritmouth.png');
const mouth5 = require('../../assets/images/works/Mouth/happycamper.png');
const mouth6 = require('../../assets/images/works/Mouth/pursemouth.png');
const mouth7 = require('../../assets/images/works/Mouth/scepticalmouth.png');
const mouth8 = require('../../assets/images/works/Mouth/smirkmouth.png');
const mouth9 = require('../../assets/images/works/Mouth/vampmouth.png');

const scar = require('../../assets/images/works/Scars/scar.png');
const cybernodes = require('../../assets/images/works/Scars/cybernodes.png');

const skintone1 = require('../../assets/images/works/Skintone/skintone1.png');
const skintone2 = require('../../assets/images/works/Skintone/skintone2.png');
const skintone3 = require('../../assets/images/works/Skintone/skintone3.png');
const skintone4 = require('../../assets/images/works/Skintone/skintone4.png');
const zombie = require('../../assets/images/works/Skintone/zombie.png');

const filters = [
  {
    id: 1,
    text: "ears",
  },
  {
    id: 2,
    text: "face",
  },
  {
    id: 3,
    text: "skintone",
  },
  {
    id: 4,
    text: "eyes",
  },
  {
    id: 5,
    text: "mouth",
  },
  {
    id: 6,
    text: "decoratives",
  },
  {
    id: 7,
    text: "Brow",
  },
  {
    id: 8,
    text: "Covered",
  },
  {
    id: 9,
    text: "Backgrounds",
  },
];

const allData = [
  {
    id: 1,
    title: "The Insider - Ears 1",
    category: "ears",
    image: ears1,
    popupLink: [face1],
  },
  {
    id: 2,
    title: "The Sheriff - Ears 2",
    category: "ears",
    image: ears2,
    popupLink: [
      face2,
      face1,
    ],
  },
  {
    id: 3,
    title: "The Barbarian - Ears 3",
    category: "ears",
    image: ears3,
    popupLink: ["https://www.youtube.com/watch?v=qf9z4ulfmYw"],
  },
  {
    id: 4,
    title: "The Warlock - Ears 4",
    category: "ears",
    image: ears4,
    popupLink: [
      "https://www.youtube.com/watch?v=URVHRhBSjj8",
      "https://www.youtube.com/watch?v=qf9z4ulfmYw",
    ],
  },
  {
    id: 5,
    title: "The Ranger - Ears 5",
    category: "ears",
    image: ears5,
    popupLink: ["images/works/5.svg"],
  },
  {
    id: 6,
    title: "The Fixer - Ears 6",
    category: "ears",
    image: ears6,
    link: "https://dribbble.com",
  },
  {
    id: 7,
    title: "The Rogue - Ears 7",
    category: "ears",
    image: ears7,
    link: "https://pinterest.com",
  },
  {
    id: 8,
    title: "The Patrician - Face 1",
    category: "face",
    image: face1,
    popupLink: [face1],
  },
  {
    id: 9,
    title: "The Franklin - Face 2",
    category: "face",
    image: face2,
    popupLink: [
      face2,
      face1,
    ],
  },
  {
    id: 10,
    title: "The Nefertiti - Face 3",
    category: "face",
    image: face3,
    popupLink: ["https://www.youtube.com/watch?v=qf9z4ulfmYw"],
  },
  {
    id: 11,
    title: "The Endgame Thor - Face 4",
    category: "face",
    image: face4,
    popupLink: [
      "https://www.youtube.com/watch?v=URVHRhBSjj8",
      "https://www.youtube.com/watch?v=qf9z4ulfmYw",
    ],
  },
  {
    id: 12,
    title: "The Patrician - Face 1",
    category: "skintone",
    image: skintone1,
    popupLink: [skintone1],
  },
  {
    id: 13,
    title: "The Franklin - Face 2",
    category: "skintone",
    image: skintone2,
    popupLink: [
      skintone2
    ],
  },
  {
    id: 14,
    title: "The Nefertiti - Face 3",
    category: "skintone",
    image: skintone3,
    popupLink: ["https://www.youtube.com/watch?v=qf9z4ulfmYw"],
  },
  {
    id: 15,
    title: "The Endgame Thor - Face 4",
    category: "skintone",
    image: skintone4,
    popupLink: [
      "https://www.youtube.com/watch?v=URVHRhBSjj8",
      "https://www.youtube.com/watch?v=qf9z4ulfmYw",
    ],
  },
  {
    id: 16,
    title: "The Endgame Thor - Face 4",
    category: "skintone",
    image: zombie,
    popupLink: [
      "https://www.youtube.com/watch?v=URVHRhBSjj8",
      "https://www.youtube.com/watch?v=qf9z4ulfmYw",
    ],
  },
  {
    id: 17,
    title: "Guest App Walkthrough Screens",
    category: "eyes",
    image: eyes1,
    popupLink: ["images/works/1.svg"],
  },
  {
    id: 18,
    title: "Delivery App Wireframe",
    category: "eyes",
    image: eyes2,
    popupLink: ["images/works/4.svg"],
  },
  {
    id: 19,
    title: "Project Managment Illustration",
    category: "eyes",
    image: eyes4,
    link: "https://pinterest.com",
  },
  {
    id: 20,
    title: "Guest App Walkthrough Screens",
    category: "eyes",
    image: eyes5,
    popupLink: ["images/works/1.svg"],
  },
  {
    id: 21,
    title: "Delivery App Wireframe",
    category: "eyes",
    image: eyes6,
    popupLink: ["images/works/4.svg"],
  },
  {
    id: 22,
    title: "Delivery App Wireframe",
    category: "eyes",
    image: eyes7,
    popupLink: ["images/works/4.svg"],
  },
  {
    id: 23,
    title: "Game Store App Concept",
    category: "eyes",
    image: eyes3,
    link: "https://dribbble.com",
  },
  {
    id: 24,
    title: "Game Store App Concept",
    category: "mouth",
    image: mouth1,
    link: "https://dribbble.com",
  },
  {
    id: 25,
    title: "Game Store App Concept",
    category: "mouth",
    image: mouth2,
    link: "https://dribbble.com",
  },
  {
    id: 26,
    title: "Game Store App Concept",
    category: "mouth",
    image: mouth3,
    link: "https://dribbble.com",
  },
  {
    id: 27,
    title: "Game Store App Concept",
    category: "mouth",
    image: mouth4,
    link: "https://dribbble.com",
  },
  {
    id: 28,
    title: "Game Store App Concept",
    category: "mouth",
    image: mouth5,
    link: "https://dribbble.com",
  },
  {
    id: 29,
    title: "Game Store App Concept",
    category: "mouth",
    image: mouth6,
    link: "https://dribbble.com",
  },
  {
    id: 30,
    title: "Game Store App Concept",
    category: "mouth",
    image: mouth7,
    link: "https://dribbble.com",
  },
  {
    id: 31,
    title: "Game Store App Concept",
    category: "mouth",
    image: mouth8,
    link: "https://dribbble.com",
  },
  {
    id: 33,
    title: "Game Store App Concept",
    category: "mouth",
    image: mouth9,
    link: "https://dribbble.com",
  },
  {
    id: 34,
    title: "Game Store App Concept",
    category: "decoratives",
    image: scar,
    link: "https://dribbble.com",
  },
  {
    id: 35,
    title: "Game Store App Concept",
    category: "decoratives",
    image: cybernodes,
    link: "https://dribbble.com",
  },
];

function Works() {
  const [getAllItems] = useState(allData);
  const [dataVisibleCount, setDataVisibleCount] = useState(6);
  const [dataIncrement] = useState(3);
  const [activeFilter, setActiveFilter] = useState("");
  const [visibleItems, setVisibleItems] = useState([]);
  const [noMorePost, setNoMorePost] = useState(false);

  useEffect(() => {
    setActiveFilter(filters[0].text.toLowerCase());
    setVisibleItems(getAllItems.filter((item) => item.id <= 8));
  }, [getAllItems]);

  const handleChange = (e) => {
    e.preventDefault();
    setActiveFilter(e.target.textContent.toLowerCase());
    let tempData;
    if (e.target.textContent.toLowerCase() === filters[0].text.toLowerCase()) {
      tempData = getAllItems.filter((data) => data.id <= dataVisibleCount);
    } else {
      tempData = getAllItems.filter(
        (data) =>
          data.category === e.target.textContent.toLowerCase() &&
          data.id <= dataVisibleCount
      );
    }
    setVisibleItems(tempData);
  };

  const handleLoadmore = (e) => {
    e.preventDefault();
    let tempCount = dataVisibleCount + dataIncrement;
    if (dataVisibleCount > getAllItems.length) {
      setNoMorePost(true);
    } else {
      setDataVisibleCount(tempCount);
      if (activeFilter === filters[0].text.toLowerCase()) {
        console.log("they are same");
        setVisibleItems(getAllItems.filter((data) => data.id <= tempCount));
      } else {
        setVisibleItems(
          getAllItems.filter(
            (data) => data.category === activeFilter && data.id <= tempCount
          )
        );
      }
    }
  };

  return (
    <section id="works">
      <div className="flat-title-page" style={{backgroundImage: `url(${imgbg})`}}>
        <div className="themesflat-container ">
          <div className="wrap-heading flex">
            <div className ="content">
              <div className="flex style2">
                <div className="mb-11">
                  <div className="mg-bt-32">
                    <Pagetitle title="Rarity Table"/>
                  </div>
                  {/* Start Portfolio Filters */}
                  <ScrollAnimation
                    animateIn="fadeInUp"
                    animateOut="fadeInOut"
                    animateOnce={true}
                  >
                    <div className="flex style2">
                      <ul className="portfolio-filter list-inline mg-bt-32">
                        {filters.map((filter) => (
                          <li className="list-inline-item" key={filter.id}>
                            <div className="sc-button style-1">
                              <span>
                                <button
                                  onClick={handleChange}
                                  className={
                                    filter.text.toLowerCase() === activeFilter
                                      ? "text-capitalize current"
                                      : "text-capitalize"
                                  }
                                >
                                  {filter.text}
                                </button>
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollAnimation>
                  {/* End Portfolio Filters */}

                  {/* Start Portfolio Items */}
                  <div className="row portfolio-wrapper">
                    {visibleItems.map((item) => (
                      <div className="col-md-3 col-sm-6 grid-item" key={item.id}>
                        <Portfolio portfolio={item} />
                      </div>
                    ))}
                  </div>
                  {/* End Portfolio Items */}

                  <div className="load-more text-center mt-4">
                    <button
                      className="btn btn-default"
                      onClick={handleLoadmore}
                      disabled={noMorePost ? "disabled" : null}
                    >
                      {noMorePost ? (
                        "No more items"
                      ) : (
                        <span>
                          <i className="fas fa-spinner"></i> Load more
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Works;
