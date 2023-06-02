import React , { useState, useEffect } from 'react';
import onClickOutside from "react-onclickoutside";
import PropTypes from 'prop-types';

function Dropdown({title, items = [], multiSelect = false, propsdata}){
    const[open, setOpen] = useState(false);
    const[selection, setSelection] = useState([]); //this array is going to hold our items. If we are selecting one item we will have 1 object with its props
    const toggle = () => setOpen(!open);
    Dropdown.handleClickOutside = () => setOpen(false);

    //Here we assign the data that was passed on from the Explore1.jsx <TodayPicks data={todayPickData} /> to the initial state defined in #16
    useEffect(() => {
        //console.log('effect');
        setSource(propsdata);
    },[]);

    function handleonClick(item) {
        if (!selection.some(current=> current.id === item.id)){
            if(!multiSelect){
                setSelection([item]);
            } else if (multiSelect) {
                setSelection([...selection, item]);
            }
        } else {
            let selectionAfterRemoval = selection;
            selectionAfterRemoval = selectionAfterRemoval.filter(
                current => current.id !== item.id
            );
            setSelection([...selectionAfterRemoval])
        }
    }

    function isItemInSelection(item){
        if (selection.find(current => current.id === item.id)) {
            //console.log("this is the selection")
            //console.log(selection[0].value);

            const filteredTag = results.filter((items)=>
                items.tags.toLowerCase().includes(selection[0].value.toLowerCase()) 
            );

            setTag(filteredTag);

            return true;
        } 
        return false;
    }

    // //Filter function: This is where we are checking whether the item that is contained in the results contains the tagvalue
    // const filteredTag = results.filter((items)=>
    //      items.tags.toLowerCase().includes(selection[0].value.toLowerCase()) 
    // );

    return (
        <div id="item_category" className='dropdown'>
            <a 
                tabIndex={0} 
                className='btn-selector nolink' 
                role="button" 
                onKeyPress={() => toggle(!open)} 
                onClick={() => toggle(!open)} >
                {title}
            </a>
            {open &&(
                <ul>
                    {items.map(item =>(
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
    );
}

const clickOutsideConfig = {
    handleClickOutside: () =>  Dropdown.handleClickOutside,
};

export default onClickOutside(Dropdown, clickOutsideConfig);