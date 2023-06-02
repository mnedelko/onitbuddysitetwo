import React, {useState, useMemo, useContext, createContext} from 'react';
import pick from 'lodash/pick'
import mapValues from 'lodash/mapValues';

const resourcesContext = createContext();

export const useResources = () => useContext(resourcesContext);

const useProvideResources = () => {
    const [options, setOptions] = useState({
        trait_categories:[],
        rarities:[]
    });

    const [resources, setResources] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const [filters, setFilters] = useState({
        gridtable: {
            title: '',
            trait_category: '',
            tags: null,
            rarity: '',
        }
    });

    const filterParams = useMemo(()=> { 
        const params = [{
        ...mapValues(pick(filters.gridtable, ['trait_category','rarity']), v => v?.value)
        
        }];
        //console.log('these are the params in hooks')
        //console.log(params)
        return params;
    }, [filters]);

    return {
        options,
        setOptions,
        filters,
        setFilters,
        filterParams,
        resources,
        totalCount,
        setResources,
        setTotalCount,
    };
}

export const ResourcesProvider = ({children}) => (
    <resourcesContext.Provider value={useProvideResources()}>{children}</resourcesContext.Provider>
);