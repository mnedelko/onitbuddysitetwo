import React , { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import imgbg from '../../../assets/images/backgroup-secsion/img_bg_page_title.jpg'




const TodayPicks = props => {
    const data = props.data;

    const [visible , setVisible] = useState(8);
    const showMoreItems = () => {
        setVisible((prevValue) => prevValue + 4);
    
    }

    //Dropdown Items
    const items_Traits = [
        {
            id: 1,
            value: 'Hair'
        },
        {
            id: 2,
            value: 'Hats'
        },
        {
            id: 3,
            value: 'Face'
        },
        {
            id: 4,
            value: 'Skintone'
        },
        {
            id: 5,
            value: 'Cyborg'
        },
        {
            id: 6,
            value: 'Ears'
        },
        {
            id: 7,
            value: 'Bandaid'
        },
        {
            id: 8,
            value: 'Mouth'
        },
        {
            id: 9,
            value: 'Scars'
        },
        {
            id: 10,
            value: 'Blushing'
        },
        {
            id: 11,
            value: 'Eyes'
        },
        {
            id: 12,
            value: 'Faces'
        },
        {
            id: 13,
            value: 'Cheeks Covers'
        },
        {
            id: 14,
            value: 'Headphones'
        },
        {
            id: 14,
            value: 'Background'
        }
    ];

    //Dropdown Rarity
    const items_Rarity = [
        {
            id: 1,
            value: 'Common'
        },
        {
            id: 2,
            value: 'Uncommon'
        },
        {
            id: 3,
            value: 'Rare'
        },
        {
            id: 4,
            value: 'Super Rare'
        },
        {
            id: 5,
            value: 'Epic'
        },
        {
            id: 6,
            value: 'Legendary'
        },
        {
            id: 7,
            value: 'Mystical'
        },
    ];

    // Configuration
    const multiSelect = true
    const title_Traits = "Traits"

    const title_Rarity = "Rarity"

    //This is where we define the state of the Dropdown

    const[open, setOpen] = useState(false);
    const[selection, setSelection] = useState([]); //this array is going to hold our items. If we are selecting one item we will have 1 object with its props
    const[cardcollection, setTagCollection] = useState([]);
    
    const toggle = () => setOpen(!open);
    //Dropdown.handleClickOutside = () => setOpen(false);

    //Traits on Click Events
    function handleonClick(item) {
        if (!selection.some(current=> current.id === item.id)){
            if(!multiSelect){
                setSelection([item]);
                //Filter function: This is where we are checking whether the item that is contained in the results contains the tagvalue
                const filteredcards = data.filter((items)=>
                    items.tags.toLowerCase().includes(item.value.toLowerCase())
                );
                setTagCollection(filteredcards);

            } else if (multiSelect) {
                setSelection([...selection, item]);
                //console.log("this is the selection 2")
                // this is the problem righ there. The selection grows to more than one array size. We need to loop through the dropdown item one by one and remove them from the tags, otherwise only items that will be shown are the latest ones only.
                const filteredcards = data.filter((items)=>
                    items.tags.toLowerCase().includes(selection.item.value.toLowerCase()) || items.rarity.toLowerCase().includes(item.value.toLowerCase())
                );
                setTagCollection(filteredcards);
                //console.log(selection)
            }
        } else {
            let selectionAfterRemoval = selection;
            selectionAfterRemoval = selectionAfterRemoval.filter(
                current => current.id !== item.id
            );
            setSelection([...selectionAfterRemoval])
            
            const filteredcards = data.filter((items)=>
                    items.tags.toLowerCase().includes(item.value.toLowerCase()) 
            );
            setTagCollection(filteredcards);
            //console.log(selection)
        }
    }

    function isItemInSelection(item){
        if (selection.find(current => current.id === item.id)) {
            //console.log("this is the selection");
            //console.log(selection[0].value);

            return true;
        } 
        return false;
    }

    // const filteredTag = data.filter((items)=>
    //     items.tags.toLowerCase().includes((selection[0].value).toLowerCase())
    // );
                
    // return (
    //     <div id="item_category" className='dropdown'>
    //         <a 
    //             tabIndex={0} 
    //             className='btn-selector nolink' 
    //             role="button" 
    //             onKeyPress={() => toggle(!open)} 
    //             onClick={() => toggle(!open)} >
    //             {title}
    //         </a>
    //         {open &&(
    //             <ul>
    //                 {items.map(item =>(
    //                     <li key={item.id}>
    //                         <button id="dropdownbuttons" type="button" onClick={() => handleonClick(item)}>
    //                             <span>{item.value}</span>
    //                             <span>{isItemInSelection(item) && 'Selected'}</span>
    //                         </button>
    //                     </li>
    //                 ))}
    //             </ul>
    //         )}
    //     </div>
    // );

    return (
        <section className="flat-title-page sc-explore-1" style={{backgroundImage: `url(${imgbg})`}} >
            <div className="themesflat-container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="wrap-box explore-1 flex mg-bt-40">
                            <div className="seclect-box style-1">
                                {/* <Dropdown title="Trait" items={items} propsdata={sourcedata}/> */}
                                <div id="item_category" className='dropdown'>
                                    <a 
                                            tabIndex={0} 
                                            className='btn-selector nolink' 
                                            role="button" 
                                            onKeyPress={() => toggle(!open)} 
                                            onClick={() => toggle(!open)} >
                                            {title_Traits}
                                    </a>
                                    {open &&(
                                         <ul>
                                            {items_Traits.map(item =>(
                                                <li key={item.id}>
                                                    <button id="dropdownbuttons" type="button" onClick={() => handleonClick(item)}>
                                                        
                                                        <span>{item.value}</span>
                                                        <span>{isItemInSelection(item) && 'Selected'}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div id="item_category" className='dropdown'>
                                    <a 
                                            tabIndex={0} 
                                            className='btn-selector nolink' 
                                            role="button" 
                                            onKeyPress={() => toggle(!open)} 
                                            onClick={() => toggle(!open)} >
                                            {title_Rarity}
                                    </a>
                                    {open &&(
                                         <ul>
                                            {items_Rarity.map(item =>(
                                                <li key={item.id}>
                                                    <button id="dropdownbuttons" type="button" onClick={() => handleonClick(item)}>
                                                        <span>{item.value}</span>
                                                        <span>{isItemInSelection(item) && 'Selected'}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            {/* <div className="seclect-box style-2 box-right">
                                <div id="artworks" className="dropdown">
                                    <Link to="#" className="btn-selector nolink">All Artworks</Link>
                                    <ul >
                                        <li><span>Abstraction</span></li>
                                        <li><span>Skecthify</span></li>
                                        <li><span>Patternlicious</span></li>
                                        <li><span>Virtuland</span></li>
                                        <li><span>Papercut</span></li>
                                    </ul>
                                </div>
                                <div id="sort-by" className="dropdown">
                                    <Link to="#" className="btn-selector nolink">Sort by</Link>
                                    <ul >
                                        <li><span>Top rate</span></li>
                                        <li><span>Mid rate</span></li>
                                        <li><span>Low rate</span></li>
                                    </ul>
                                </div>    
                            </div> */}
                        </div>
                    </div>
                    <div className='row'>
                        {
                            //console.log("this is the stuff") 
                        }
                        {cardcollection.map((i, index) => (
                            //console.log(i),
                            //console.log(index),
                            <TodayPicksItem key={index} item={i}  />
                        ))}
                    </div>
                    {
                        visible < data.length && 
                        <div className="col-md-12 wrap-inner load-more text-center"> 
                            <Link to="#" id="load-more" className="sc-button loadmore fl-button pri-3" onClick={showMoreItems}><span>Load More</span></Link>
                        </div>
                    }
                </div>
            </div>
        </section>
    );
};


TodayPicks.propTypes = {
    data: PropTypes.array.isRequired,
};

const TodayPicksItem = props => (
    <div className="fl-item col-xl-3 col-lg-4 col-md-6 col-sm-6">
        <div className={`sc-card-product ${props.item.feature ? 'comingsoon' : '' } `}>
            <div className="card-media">
                <Link to="/item-details-01"><img src={props.item.img} alt="axies" /></Link>
                <a className="wishlist-button"><span className="number-like">{props.item.rarity}</span></a>
                <div className="coming-soon">{props.item.feature}</div>
            </div>
            <div className="card-title">
                <h5 className="style2"><Link to="/item-details-01">{props.item.title}</Link></h5>
                <div className="tags">{props.item.tags}</div>
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

export default TodayPicks;
