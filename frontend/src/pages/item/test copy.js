const handleSearchSubmit = useCallback(async (page = 1, limit = itemsPerPage) => {
    if (searchText.trim() !== '') {
        try {
            const response = await fetch(`/acha-kvell/items/search?masterCode=${searchText}`)
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const thisJson = await response.json();
            setItems(thisJson.items);
            setFilteredItems(thisJson.items); // Initialize filtered items
            setCurrentPage(thisJson.currentPage);
            setTotalPages(thisJson.totalPages);
            if (thisJson.items.length > 0) {
                handleRowClick(this.Json.items[0].sku);
                setCurrentMasterCode(thisJson.items[0].masterCode);
                setSku(thisJson.items[0].sku);
                setSelectedRow(currentSku);
            }
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        }    
    }, [searchItems, itemsPerPage]);


        
const fetchItems = useCallback(async (page = 1, limit = itemsPerPage) => {
    try {
        const response = await fetch(`/acha-kvell/item?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }
        const thisJson = await response.json();
        setItems(thisJson.items);
        setFilteredItems(thisJson.items); // Initialize filtered items
        setCurrentPage(thisJson.currentPage);
        setTotalPages(thisJson.totalPages);
        if (thisJson.items.length > 0) {
            handleRowClick(this.Json.items[0].sku);
            setCurrentMasterCode(thisJson.items[0].masterCode);
            setSku(thisJson.items[0].sku);
            setSelectedRow(currentSku);
        }
    } catch (error) {
        console.error('Error fetching items:', error);
    }    
}, [itemsPerPage]);