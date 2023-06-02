import React, { useState ,useEffect } from 'react';
import { Link } from 'react-router-dom'
import logodark from '../../assets/images/logo/logoonitbuddy4.png'
import logofooter from '../../assets/images/logo/logoonitbuddy4.png'

//@ts-ignore
import lightpaperpdfslider from '../../assets/docs/OnitBuddy-LightPaper.pdf'

//@ts-ignore
const Footer = () => {
    const accountList = [
        {
            title: "Contribute on GitHub",
            pathname: "https://github.com/onitbuddy",
        },
        {
            title: "Check out the Lightpaper",
            pdfdoc: {lightpaperpdfslider}
        },
        {
            title: "Join our Dev Channel",
            pathname: "https://discord.gg/RWs3DP2",
        },
        {
            title: "Mint a Buddy",
        },
    ]
    const resourcesList = [
        {
            title: "Discover the Design System",
            pathname: "https://github.com/onitbuddy/OnitDesignSystem",
        },
        {
            title: "Contribute Designs",
            pathname: "https://github.com/onitbuddy/OnitDesignSystem",
        },
        {
            title: "Join our Design Channel",
            pathname: "https://discord.gg/RWs3DP2", 
        }
    ]
    const companyList = [
        {
            title: "Find us on Discord",
            pathname: "https://discord.gg/RWs3DP2",
        },
        {
            title: "How to join the DAO",
            pathname: "https://discord.gg/RWs3DP2",
        },
        {
            title: "Open DAO positions",
            pathname: "https://discord.gg/RWs3DP2",
        },
        {
            title: "FAQ",
            pathname: "https://discord.gg/RWs3DP2",
        },
    ]
    const socialList = [
        {
            icon: "icon-fl-vt",
            pathname: "https://discord.gg/RWs3DP2"
        },
        {
            icon: "fab fa-twitter",
            pathname: "https://twitter.com/onitbuddy"
        },
        {
            icon: "fab fa-telegram-plane",
            pathname: "https://t.me/+9kEeXlbLIBU4OWY5"
        },
        {
            icon: "fab fa-youtube",
            pathname: "https://www.youtube.com/channel/UCp8YrvYzKfdEBTRxvYNPl_Q"
        },
        {
            icon: "icon-fl-tik-tok-2",
            pathname: "https://www.tiktok.com/@onitbuddy"
        }
        
    ]

    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };
  
    useEffect(() => {
      const toggleVisibility = () => {
        if (window.pageYOffset > 500) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };
  
      window.addEventListener("scroll", toggleVisibility);
  
      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <div>
            <footer id="footer" className="footer-light-style clearfix bg-style">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-lg-3 col-md-12 col-12">
                            <div className="widget widget-logo">
                                <div className="logo-footer" id="logo-footer">
                                    <Link to="/">
                                        <img className='logo-dark' id="logo_footer" src={logodark} alt="nft-gaming" />
                                        <img className='logo-light' id="logo_footer" src={logofooter} alt="nft-gaming" />
                                        
                                    </Link>
                                </div>
                                <p className="sub-widget-logo">At OnitBuddy we are a vibrant community to developers, designers and visionaries dediated to evolve how NFTs evolve. There are many ways you can get involved. Here are few ways to join the project: </p>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-5 col-5">
                            <div className="widget widget-menu style-1">
                                <h5 className="title-widget">Join the NFTT Project</h5>
                                <ul>
                                    {
                                        accountList.map((item,index) =>(
                                            (() => {
                                                if (item.pathname) {
                                                  return (
                                                    <li key={index}> <a className="externalLink" target="_blank" rel="noreferrer" href={item.pathname}>{item.title} </a></li>
                                                  )
                                                } else if (item.pdfdoc) {
                                                    return (
                                                      <li key={index}><a href={lightpaperpdfslider} target="_blank" rel="noreferrer" className="externalLink">{item.title}</a></li>
                                                    )
                                                } else {
                                                  return (
                                                    <li key={index}><Link onClick={scrollToTop}  to='#'>{item.title}</Link></li>
                                                  )
                                                }
                                              })()
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-7 col-7">
                            <div className="widget widget-menu style-2">
                                <h5 className="title-widget">Design a Transmorg</h5>
                                <ul>
                                    {
                                        resourcesList.map((item:any,index) =>(
                                            (() => {
                                                if (item.link) {
                                                  return (
                                                    <li key={index}> <Link to={item.link}> {item.title} </Link></li>
                                                  )
                                                } else if (item.pathname) {
                                                  return (
                                                    <li key={index}> <a className="externalLink" target="_blank" rel="noreferrer" href={item.pathname}>{item.title} </a></li>
                                                  )
                                                } else if (item.pdfdoc) {
                                                    return (
                                                      <li key={index}><a href={lightpaperpdfslider} target="_blank" rel="noreferrer" className="externalLink">{item.title}</a></li>
                                                    )
                                                } else {
                                                  return (
                                                    <li key={index}><Link onClick={scrollToTop}  to='#'>{item.title}</Link></li>
                                                  )
                                                }
                                              })()
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-5 col-5">
                            <div className="widget widget-menu fl-st-3">
                                <h5 className="title-widget">Join the DAO</h5>
                                <ul>
                                    {
                                        companyList.map((item:any,index) =>(
                                            (() => {
                                                if (item.pathname) {
                                                  return (
                                                    <li key={index}> <a className="externalLink" target="_blank" rel="noreferrer" href={item.pathname}>{item.title} </a></li>
                                                  )
                                                } else if (item.pdfdoc) {
                                                    return (
                                                      <li key={index}><a href={lightpaperpdfslider} target="_blank" rel="noreferrer" className="externalLink">{item.title}</a></li>
                                                    )
                                                } else {
                                                  return (
                                                    <li key={index}><Link onClick={scrollToTop}  to='#'>{item.title}</Link></li>
                                                  )
                                                }
                                              })()
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-7 col-12">
                            <div className="widget widget-subcribe">
                                <h5 className="title-widget">Get In Touch</h5>
                                <div className="widget-social style-1 mg-t32">
                                    <ul>
                                        {
                                            socialList.map((item,index) =>(
                                                (() => {
                                                    if (item.pathname) {
                                                      return (
                                                        <li key={index}> <a className="externalLink" target="_blank" rel="noreferrer" href={item.pathname}><i className={item.icon}></i></a></li>
                                                      )
                                                    } else {
                                                      return (
                                                        <li key={index}><Link onClick={scrollToTop}  to='#'><i className={item.icon}></i></Link></li>
                                                      )
                                                    }
                                                  })()
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {
                isVisible && 
                <Link onClick={scrollToTop}  to='#' id="scroll-top"></Link>
            }
            
            <div className="modal fade popup" id="popup_bid" tabIndex={-1} role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="modal-body space-y-20 pd-40">
                            <h3>Place a Bid</h3>
                            <p className="text-center">You must bid at least <span className="price color-popup">4.89 ETH</span>
                            </p>
                            <input type="text" className="form-control"
                                placeholder="00.00 ETH" />
                            <p>Enter quantity. <span className="color-popup">5 available</span>
                            </p>
                            <input type="number" className="form-control" placeholder="1" />
                            <div className="hr"></div>
                            <div className="d-flex justify-content-between">
                                <p> You must bid at least:</p>
                                <p className="text-right price color-popup"> 4.89 ETH </p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p> Service free:</p>
                                <p className="text-right price color-popup"> 0,89 ETH </p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p> Total bid amount:</p>
                                <p className="text-right price color-popup"> 4 ETH </p>
                            </div>
                            <Link to="#" className="btn btn-primary" data-toggle="modal" data-target="#popup_bid_success" data-dismiss="modal" aria-label="Close"> Place a bid</Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
}

export default Footer;
