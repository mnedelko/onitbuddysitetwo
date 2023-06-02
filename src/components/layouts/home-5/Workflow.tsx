import React from 'react';
import { Link } from 'react-router-dom'
import icon1 from '../../../assets/images/icon/buddyicon.png'
import icon2 from '../../../assets/images/icon/buddyicon_glasses.png'
import icon3 from '../../../assets/images/icon/designicon.png'
import icon4 from '../../../assets/images/icon/paid.png'

const Workflow = () => {
    const data = [
        {
            title: "Your OnitBuddy NFT",
            description: "To keep the NFT fresh holders of the OnitBuddy Transmorg Collection can augment their NFT by purchasing new designs for existing traits. These designs are called transmorgs.",
            icon : icon1,
            colorbg : "icon-color1"
        },
        {
            title: "Introducing Transmorgs",
            description: "A Transmorg is a new look for an existing trait. Creators around the world can submit their designs via the OpenSource design system. NFT holders will be able to buy said designs to change their NFT's look.",
            icon : icon2,
            colorbg : "icon-color2",
        },
        {
            title: "Open Source Community",
            description: "OnitBuddy NFTs adhere to an OpenSource design system. Creators all over the world are invited to submit new designs for existing traits. The DAO approves submission for release in the OnitBuddy Transmorg Collection.",
            icon : icon3,
            colorbg : "icon-color3",
        },
        {
            title: "Creators get paid",
            description: "Contributors receive their own comission. The price of the transmorg is determined as a percentage of the OnitBuddy NFT's current value. This ensures the NFT appreciates in value while the transmorg's comission carries forward in future transactions.",
            icon : icon4,
            colorbg : "icon-color4",
        },
    ]
    return (
        <section className="tf-box-icon create tf-section bg-home-3">
            <div className="themesflat-container">
                <div className="row">
                    {
                        data.map((item , index) => (
                            <CreateItem key={index} item={item} />
                        ))
                    }
                </div>                 
            </div>
        </section>
    );
}

const CreateItem = (props :any) => (
    <div className='col-lg-3 col-md-6 col-12'>
        <div className="sc-box-icon">
        <div className="image center">
            <div className={`icon-create ${props.item.colorbg}`}>
                    <img src={props.item.icon} alt="" />
                </div>                                                                           
            </div>
        <h3 className="heading"><Link to="/wallet-connect">{props.item.title}</Link></h3>
        <p className="content">{props.item.description}</p>
    </div>
    </div>
    
)

export default Workflow;
