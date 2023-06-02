//import React , { useState} from 'react';

import {DropdownList} from 'react-widgets';


import useAsyncEffect from '../../../utility/use-async-effect';

import { useResources } from './hooks';




const RarityTableDropdowns = (props) => {
    //const [filterdropdownOpen, setFilterDropdownOpen] = useState(false);
    const { filters: {gridtable: gridFilters}, options, setFilters, setOptions} = useResources();
        
    useAsyncEffect(
        async isMounted => {
            try {
                if(!isMounted()) return;
                //The optional chaining operator (?.) enables you to read the value of a property located deep within a chain of connected objects without having to check that each reference in the chain is valid. 
                setOptions({
                    trait_categories: [
                        {label: 'All Traits', value: ''},
                        {label: 'Hair', value: 'hair'},
                        {label: 'Hats', value: 'hats'},
                        {label: 'Face', value: 'face'},
                        {label: 'Skintone', value: 'skintone'},
                        {label: 'Cyborg', value: 'cyborg'},
                        {label: 'Ears', value: 'ears'},
                        {label: 'Bandaid', value: 'bandaid'},
                        {label: 'Facemask', value: 'facemask'},
                        {label: 'Mouth', value: 'mouth'},
                        {label: 'Scars', value: 'scars'},
                        {label: 'Cybernodes', value: 'cybernodes'},
                        {label: 'Blushing', value: 'blushing'},
                        {label: 'Flushed', value: 'flushed'},
                        {label: 'Eyes', value: 'eyes'},
                        {label: 'Faces', value: 'faces'},
                        {label: 'Cheeks & Covers', value: 'cheekscovers'},
                        {label: 'Headphones', value: 'headphones'},
                        {label: 'Backgrounds', value: 'backgrounds'},
                        //...(optionsResult?.cloud_types || []).map(t => ({label: cloudLabelMappint[t]|| startCase(t), value: t})),
                    ],
                    rarities: [
                        {label: 'All Rarity Levels', value: ''},
                        {label: 'Common', value: 'common'},
                        {label: 'Uncommon', value: 'uncommon'},
                        {label: 'Rare', value: 'rare'},
                        {label: 'Super Rare', value: 'superrare'},
                        {label: 'Epic', value: 'epic'},
                        {label: 'Legendary', value: 'legendary'},
                        {label: 'Mythical', value: 'mythical'},
                    ],
                });
            } catch (error) {
                console.log(error);
            }
        }, [] 
    );

    //const isFilteredApplied = gridFilters.trait_category || gridFilters.rarity; //this was just used for the filter button, can be removed

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="wrap-box explore-1 flex mg-bt-30">
                    <div className="seclect-box style-1">
                        <div id="item_category" className='dropdown'>
                            <DropdownList
                                data={options.trait_categories}
                                value={options.trait_categories.value}
                                datakey='label'
                                placeholder='All Traits'
                                textField="label"
                                //valueField="value"
                                defaultValue=''
                                containerClassName="rw-dropdown-font rw-container options-dropdown mb-2"
                                selectIcon={<i className="fas fa-chevron-down" />}
                                onChange={o => setFilters(f => ({ ...f, gridtable: { ...f.gridtable, trait_category: o } }))}
                            />
                        </div>
                        <div id="item_category" className='dropdown'>
                            <DropdownList
                                data={options.rarities}
                                value={gridFilters.rarity}
                                datakey='label'
                                placeholder="All Rarity Levels"
                                textField="label"
                                defaultValue=''
                                //valueField="value"
                                containerClassName="rw-dropdown-font rw-container options-dropdown mb-2"
                                selectIcon={<i className="fas fa-chevron-down text-header" />}
                                onChange={r => setFilters(f => ({ ...f, gridtable: { ...f.gridtable, rarity: r } }))}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RarityTableDropdowns;