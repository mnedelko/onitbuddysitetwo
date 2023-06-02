import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { Scrollbar, A11y   } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import 'swiper/swiper.scss';
import 'swiper/components/navigation';
import 'swiper/components/pagination';

import img1 from '../../../assets/images/box-item/imgslider2category.jpg'

const MeetTheTeam = () => {
    const [data] = useState(
        [
            {
                title: 'Mike Nedelko',
                img:  img1
            }
        ]
    )
    return (
        <section className="tf-section brow-category home5 bg-style2" id="team">
            <div className="themesflat-container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="heading-live-auctions">
                            <h2 className="tf-title text-left pb-40">
                                Join the Team</h2>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <Swiper
                            //@ts-ignore
                            modules={[ Scrollbar, A11y ]}
                                spaceBetween={32}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 1,
                                        },
                                    767: {
                                        slidesPerView: 2,
                                    },
                                    991: {
                                        slidesPerView: 4,
                                    },
                                    }}
                                loop={false}
                                scrollbar={{ draggable: true }}
                                >
                                {
                                    data.map((item,index) => (
                                        <SwiperSlide key={index} >
                                            <div className="swiper-slide">
                                                <div className="slider-item">										
                                                    <div className="sc-card-product explode style2">
                                                        <div className="type-title">
                                                            <h3>{item.title}</h3>
                                                        </div>
                                                        <div className="card-media">
                                                            <Link to="/item-details-01"><img src={item.img} alt="Axies" /></Link>
                                                        </div>                                      
                                                    </div>  	
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))
                                }

                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MeetTheTeam;
