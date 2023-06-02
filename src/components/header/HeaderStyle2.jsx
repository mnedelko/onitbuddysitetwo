import React , { useRef , useState , useEffect } from 'react';
import { Link , useLocation } from "react-router-dom";
import menus from "../../pages/menu";
import DarkMode from './DarkMode';
import logoheader from '../../assets/images/logo/logoonitbuddy4.png'
import logoheader2x from '../../assets/images/logo/logoonitbuddy4.png'
import logodark from '../../assets/images/logo/logoonitbuddy4.png'
import logodark2x from '../../assets/images/logo/logoonitbuddy4.png'
import avt from '../../assets/images/avatar/avt-2.jpg'
import coin from '../../assets/images/logo/coin.svg'

import { HashLink} from 'react-router-hash-link'
import { saveAs } from "file-saver";

const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

const HeaderStyle2 = () => {
    const { pathname } = useLocation();

    const headerRef = useRef (null)
    useEffect(() => {
        window.addEventListener('scroll', isSticky);
        return () => {
            window.removeEventListener('scroll', isSticky);
        };
    });
    const isSticky = (e) => {
        const header = document.querySelector('.js-header');
        const scrollTop = window.scrollY;
        scrollTop >= 300 ? header.classList.add('is-fixed') : header.classList.remove('is-fixed');
        scrollTop >= 400 ? header.classList.add('is-small') : header.classList.remove('is-small');
    };

    const menuLeft = useRef(null)
    const btnToggle = useRef(null)

    const menuToggle = () => {
        menuLeft.current.classList.toggle('active');
        btnToggle.current.classList.toggle('active');
    }

    const scrollWidthOffset = (el) => {
        const yCoordinate = document.getElementById(el).getBoundingClientRect().top + window.pageYOffset;
        const yOffset = -95; 
        window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' }); 
    };

    const [activeIndex, setActiveIndex] = useState(null);

    const handleOnClick = (index, el) => {
        if (index === 0){
            scrollToTop();
        } else {
            scrollWidthOffset(el); 
            setActiveIndex(index);
        } 
    };

    const saveFile = () => {
        saveAs(
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          "example.pdf"
        );
    };

    return (
        <header id="header_main" className="header_1 header_2 style2 js-header" ref={headerRef}>
            <div className="themesflat-container">
                <div className="row">
                    <div className="col-md-12">                              
                        <div id="site-header-inner"> 
                            <div className="wrap-box flex">
                                <div id="site-logo" className="clearfix">
                                    <div id="site-logo-inner">
                                        <Link to="/" rel="home" className="main-logo">
                                            <img className='logo-dark'  id="logo_header" src={logodark} srcSet={`${logodark2x}`} alt="nft-gaming" />
                                            <img className='logo-light'  id="logo_header" src={logoheader} srcSet={`${logoheader2x}`} alt="nft-gaming" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="mobile-button" ref={btnToggle} onClick={menuToggle}><span></span></div>
                                <nav id="main-nav" className="main-nav" ref={menuLeft} >
                                    <ul id="menu-primary-menu" className="menu">
                                        {
                                            menus.map((data,index) => (
                                                data.namesub != null ? 
                                                    <li key={index} onClick={(el)=> handleOnClick(index, data.link)} className={`menu-item menu-item-has-children ${activeIndex === index ? 'active' : ''} ` }   >
                                                        <Link to="#" >{data.name}</Link>
                                                        {
                                                            
                                                        }
                                                        <ul className="sub-menu" >
                                                            {
                                                                data.namesub.map((submenu) => (
                                                                    submenu.download != true ?
                                                                        submenu.external != true ?
                                                                        <li key={submenu.id} className={
                                                                            pathname === submenu.links
                                                                            ? "menu-item current-item"
                                                                            : "menu-item"
                                                                        }>
                                                                            <HashLink smooth to={submenu.links} scroll={el => scrollWidthOffset(el)}>{submenu.sub}</HashLink>
                                                                        </li>
                                                                        :
                                                                        <li key={submenu.id} className={
                                                                            pathname === submenu.links
                                                                            ? "menu-item current-item"
                                                                            : "menu-item"
                                                                        }>
                                                                            <a target="_blank" href="https://github.com/Trybler/transmorgprotocol">{submenu.sub}</a>
                                                                        </li>
                                                                    :
                                                                        <li key={submenu.id} onClick={saveFile} className={
                                                                            pathname === submenu.links
                                                                            ? "menu-item current-item"
                                                                            : "menu-item"
                                                                        }>
                                                                            <Link to=''>{submenu.sub}</Link>
                                                                        </li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </li>
                                                :  
                                                    <li key={index} onClick={(el)=> handleOnClick(index, data.link)} className={`menu-item` }   >
                                                    <Link to="#" >{data.name}</Link></li>
                                            ))
                                        }
                                    </ul>
                                </nav>
                                <div className="flat-search-btn flex">
                                    <div className="sc-btn-top mg-r-12" id="site-header">
                                        <Link to="/wallet-connect" className="sc-button header-slider style style-1 wallet fl-button pri-1"><span>Wallet connect
                                        </span></Link>
                                    </div>

                                    <div className="admin_active" id="header_admin">
                                        <div className="header_avatar">
                                            <div className="price">
                                                <span>2.45 <strong>ETH</strong> </span>
                                            </div>
                                            <img
                                                className="avatar"
                                                src={avt}
                                                alt="avatar"
                                                />
                                            <div className="avatar_popup mt-20">
                                                <div className="d-flex align-items-center copy-text justify-content-between">
                                                    <span> 13b9ebda035r178... </span>
                                                    <Link to="/" className="ml-2">
                                                        <i className="fal fa-copy"></i>
                                                    </Link>
                                                </div>
                                                <div className="d-flex align-items-center mt-10">
                                                    <img
                                                        className="coin"
                                                        src={coin}
                                                        alt="/"
                                                        />
                                                    <div className="info ml-10">
                                                        <p className="text-sm font-book text-gray-400">Balance</p>
                                                        <p className="w-full text-sm font-bold text-green-500">16.58 ETH</p>
                                                    </div>
                                                </div>
                                                <div className="hr"></div>
                                                <div className="links mt-20">
                                                    <Link to="#">
                                                        <i className="fab fa-accusoft"></i> <span> My items</span>
                                                    </Link>
                                                    <a className="mt-10" href="/edit-profile">
                                                        <i className="fas fa-pencil-alt"></i> <span> Edit Profile</span>
                                                    </a>
                                                    <a className="mt-10" href="/login" id="logout">
                                                        <i className="fal fa-sign-out"></i> <span> Logout</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
            <DarkMode />
        </header>
    );
}

export default HeaderStyle2;
