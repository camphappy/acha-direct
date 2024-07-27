import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchItems } from './components/item/itemService';
import debounce from 'lodash.debounce';

// ...

const Home = () => {
    // ... other state and hooks

    const fetchItemsData = useCallback(async (page = 1, limit = itemsPerPage) => {
        try {
            const thisJson = await fetchItems(page, limit);
            setItems(thisJson.items);
            setCurrentPage(thisJson.currentPage);
            setTotalPages(thisJson.totalPages);
            if (thisJson.items.length > 0) {
                handleRowClick(thisJson.items[0].sku);
                setCurrentMasterCode(thisJson.items[0].masterCode);
                setSku(thisJson.items[0].sku);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }, [itemsPerPage]);

    // ... other functions

    useEffect(() => {
        fetchItemsData(currentPage);
    }, [currentPage, fetchItemsData]);

    // ... JSX and rest of the component
};
