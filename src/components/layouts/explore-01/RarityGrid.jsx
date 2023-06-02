import React , { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import imgbg from '../../../assets/images/backgroup-secsion/img_bg_page_title.jpg'

import { ResourcesProvider } from './hooks';
import { useResources } from './hooks';

import RarityTableDropdowns from './RarityTableDropdownWidget'



const RarityTable = props => {
    const data = props.data;
    const {resources, filterParams, setResources} = useResources();

    const [visible , setVisible] = useState(8);
    const showMoreItems = () => {
        setVisible((prevValue) => prevValue + 4);
    
    }


    const getResources = (dataitems, paramsitems) => {
        const griddata = dataitems;
        //console.log ("This is the provided data")
        //console.log(griddata);
        const paramsies = paramsitems;
        //console.log ("These are the active filters")
        //console.log(paramsies);
        //console.log(paramsies[0])

        if (!paramsies[0].trait_category && !paramsies[0].rarity) {
            //console.log(paramsies[0].trait_category)
            //console.log(paramsies.rarity)
            const data = griddata;
            //console.log("filtered data")
            //console.log(data);
            return data;
        } else if (!paramsies[0].trait_category && paramsies[0].rarity){
            const data = griddata.filter(array => paramsies.some(filteringparams => filteringparams.rarity === array.rarity.toLowerCase()));
            //console.log("filtered data")
            //console.log(data);
            return data;
        } else if (paramsies[0].trait_category && !paramsies[0].rarity){
            const data = griddata.filter(array => paramsies.some(filteringparams => filteringparams.trait_category === array.category.toLowerCase()));
            //console.log("filtered data")
            //console.log(data);
            return data;
        } else {
            const data = griddata.filter(array => paramsies.some(filteringparams => filteringparams.trait_category === array.category.toLowerCase() && filteringparams.rarity === array.rarity.toLowerCase()));
            //console.log("filtered data")
            //console.log(data);
            return data;
        }

    }


    useEffect(
        isMounted => {
            try {
                //if (!isMounted()) return;
                const resourceResult = getResources(data, filterParams);
                //console.log("these are the resourceREsults")
                //console.log(resourceResult);
                setResources(resourceResult ||[]);
                //setTotalCount(resourceResult || 0);
            } catch (error) {
                console.log('error');
            } 
        }, [filterParams, visible, data, setResources]
    );

    return (
        <section className="flat-title-page sc-explore-1" id="collection" style={{backgroundImage: `url(${imgbg})`}} >
            <div className="themesflat-container">
                <div className="wrap-heading">
                    <div className="content">
                        <h2 className="heading">OnitBuddy Origins Collection:                                                                              
                        </h2>	
                        <p className="sub-heading mt-4 mb-4">OnitBuddy is a carefully crafted collection of 8080 unique NFTs, designed to fund and support the development of the NFTT protocol (see below). Based on an open source Design system the collection launched with 100+ unique, hand-crafted traits of varying rarity. You can check them out below:
                        </p>
                    </div>
                </div>
                <div class="fl-item raritytable col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div class="row">
                        <div class= "fl-item col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div class="row flex-nowrap mg-bt-30">
                                <div class="col-sm">
                                    <p className="common"></p>
                                    <p className="raritydescriptor"> Common </p>
                                </div>
                                <div class="col-sm">
                                    <p className="uncommon"></p>
                                    <p className="raritydescriptor"> Uncommon </p>
                                </div>
                                <div class="col-sm">
                                    <p className="rare"></p>
                                    <p className="raritydescriptor"> Rare </p>
                                </div>
                                <div class="col-sm">
                                    <p className="superrare"></p>
                                    <p className="raritydescriptor"> Super Rare </p>
                                </div>
                                <div class="col-sm">
                                    <p className="epic"></p>
                                    <p className="raritydescriptor"> Epic </p>
                                </div>
                                <div class="col-sm">
                                    <p className="legendary"></p>
                                    <p className="raritydescriptor"> Legendary </p>
                                </div>
                                <div class="col-sm">
                                    <p className="mystical"></p>
                                    <p className="raritydescriptor"> Mythical </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fl-item raritytablecompressed col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div class="row">
                        <div class= "fl-item col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div class="row flex-nowrap">
                                <div class="col-sm">
                                    <p className="common"></p>
                                    <p className="raritydescriptor"> Common </p>
                                </div>
                                <div class="col-sm">
                                    <p className="uncommon"></p>
                                    <p className="raritydescriptor"> Uncommon </p>
                                </div>
                                <div class="col-sm">
                                    <p className="rare"></p>
                                    <p className="raritydescriptor"> Rare </p>
                                </div>
                                <div class="col-sm">
                                    <p className="superrare"></p>
                                    <p className="raritydescriptor"> Super Rare </p>
                                </div>
                            </div>
                            <div class="row flex-nowrap mg-bt-20">
                                <div class="col-sm">
                                    <p className="epic"></p>
                                    <p className="raritydescriptor"> Epic </p>
                                </div>
                                <div class="col-sm">
                                    <p className="legendary"></p>
                                    <p className="raritydescriptor"> Legendary </p>
                                </div>
                                <div class="col-sm">
                                    <p className="mystical"></p>
                                    <p className="raritydescriptor"> Mythical </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <RarityTableDropdowns/>
                
                <div className='row'>
                    { resources.slice(0,visible).map((resource, i) => (
                        <RarityTableItem key={resource.id} item={resource} index={i} />
                    ))}
                </div>
                {
                    visible < data.length && 
                    <div className="col-md-12 wrap-inner load-more text-center pb-5"> 
                        <Link to="#" id="load-more" className="sc-button loadmore fl-button pri-3" onClick={showMoreItems}><span>Load More</span></Link>
                    </div>
                }
            </div>
        </section>
    );
};


RarityTable.propTypes = {
    data: PropTypes.array.isRequired,
};

const RarityTableItem = props => (
    <div className="fl-item col-xl-3 col-lg-3 col-md-3 col-sm-4 col-6">
        <div className={`sc-card-product ${props.item.feature ? 'comingsoon' : '' } `}>
            <div className="card-media">
                <img src={props.item.img} alt="axies" />
                <span className="number-like wishlist-button">{props.item.raritydisplay}</span>
                <div className="coming-soon">{props.item.feature}</div>
            </div>
            <div className="card-title">
                <p className="responsive_font">{props.item.title}</p>
                <div className="tags">{props.item.category}</div>
            </div>
            {/* <div className="meta-info">
                <div className="author">
                    <div className="avatar">
                        <img src={props.item.imgAuthor} alt="axies" />
                    </div>
                    <div className="info">
                        <span>Owned By</span>
                        <h6> <Link to="/authors-02">{props.item.nameAuthor}</Link> </h6>
                    </div>
                </div>
                <div className="price">
                    <span>Current Bid</span>
                    <h5> {props.item.price}</h5>
                </div>
            </div>
            <div className="card-bottom">
                <Link to="/wallet-connect" className="sc-button style bag fl-button pri-3"><span>Place Bid</span></Link>
                <Link to="/activity-01" className="view-history reload">View History</Link>
            </div> */}
        </div>
    </div>
)

const RarityGridPageWrapper = props => (
    <ResourcesProvider>
        <RarityTable {...props}/>
    </ResourcesProvider>

);

export default RarityGridPageWrapper;
