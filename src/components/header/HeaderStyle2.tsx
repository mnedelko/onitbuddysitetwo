import React , { useRef , useState , useEffect } from 'react';
import { Link , useLocation } from "react-router-dom";
import menus from "../../pages/menu";
import * as anchor from "@project-serum/anchor";

import DarkMode from './DarkMode';
import logoheader from '../../assets/images/logo/logoonitbuddy4.png'
import logoheader2x from '../../assets/images/logo/logoonitbuddy4.png'
import logodark from '../../assets/images/logo/logoonitbuddy4.png'
import logodark2x from '../../assets/images/logo/logoonitbuddy4.png'

import { HashLink} from 'react-router-hash-link'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {useWallet} from "@solana/wallet-adapter-react";
import {WalletAdapterNetwork} from '@solana/wallet-adapter-base';

//@ts-ignore
import lightpaper from '../../assets/docs/OnitBuddy-LightPaper.pdf';

const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  export interface HomeProps {
    candyMachineId?: anchor.web3.PublicKey;
    connection: anchor.web3.Connection;
    txTimeout: number;
    rpcHost: string;
    network: WalletAdapterNetwork;
}

const HeaderStyle2 = (props: HomeProps) => {
    const { pathname } = useLocation();

    const wallet = useWallet();

    const headerRef = useRef (null)
    useEffect(() => {
        window.addEventListener('scroll', isSticky);
        return () => {
            window.removeEventListener('scroll', isSticky);
        };
    });
    const isSticky = (e: any) => {
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

    const scrollWidthOffset = (el: any| undefined) => {
        if (document.getElementById(el) === null){
            console.log('log');
            return
        } else {
            //console.log(el);
            //@ts-ignore
            const yCoordinate: any = document.getElementById(el).getBoundingClientRect().top + window.pageYOffset;
            const yOffset = -95; 
            window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' }); 
        }
    };

    const [activeIndex, setActiveIndex] = useState(null);

    const handleOnClick = (index: number | React.SetStateAction<any|null>, el: String | undefined) => {
        if (index === 0){
            scrollToTop();
        } else {
            scrollWidthOffset(el); 
            setActiveIndex(index);
        } 
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
                                                data.namesub !== null ? 
                                                    <li key={index} onClick={(el)=> handleOnClick(index, data.link)} className={`menu-item menu-item-has-children ${activeIndex === index ? 'active' : ''} ` }   >
                                                        <Link to="#" >{data.name}</Link>
                                                        {
                                                            
                                                        }
                                                        <ul className="sub-menu" >
                                                            {
                                                                data.namesub.map((submenu: { download: boolean; external: boolean; id: number; links: string; sub: boolean}) => (
                                                                    submenu.download !== true ?
                                                                        submenu.external !== true ?
                                                                        <li key={submenu.id} className={
                                                                            pathname === submenu.links
                                                                            ? "menu-item current-item"
                                                                            : "menu-item"
                                                                        }>
                                                                            <HashLink smooth to={submenu.links} scroll={(el: any) => scrollWidthOffset(el)}>{submenu.sub}</HashLink>
                                                                        </li>
                                                                        :
                                                                        <li key={submenu.id} className={
                                                                            pathname === submenu.links
                                                                            ? "menu-item current-item"
                                                                            : "menu-item"
                                                                        }>
                                                                            <a target="_blank" rel="noreferrer" href={submenu.links}>{submenu.sub}</a>
                                                                        </li>
                                                                    :
                                                                        <li key={submenu.id} className={
                                                                            pathname === submenu.links
                                                                            ? "menu-item current-item"
                                                                            : "menu-item"
                                                                        }>
                                                                            <a href={lightpaper} target="_blank" rel="noreferrer">{submenu.sub}</a>
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
                                        {wallet ?
                                            <WalletMultiButton className="sc-button header-slider style style-1 fl-button pri-1"></WalletMultiButton> :
                                            //@ts-ignore
                                            <WalletMultiButton className="sc-button header-slider style style-1 wallet fl-button pri-1"><span>Wallet connect
                                            </span></WalletMultiButton>
                                        }
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
