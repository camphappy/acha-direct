const handleSearchSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (searchText.trim() !== '') {
        setIsSearching(true);
        try {
            const response = await fetch(`/acha-kvell/itemSpecial/search?reqmasterCode=${searchText}`);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const thisJson = await response.json();
            // setItems(thisJson.items);
            setFilteredItems(thisJson.items); // Initialize filtered items
            setItems(thisJson.items);
            setCurrentPage(1);
            setTotalPages(Math.ceil(thisJson.items.length / itemsPerPage)); // Update the total pages based on filtered results
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}
}, [searchText, itemsPerPage]);
