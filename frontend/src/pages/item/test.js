import React, { useEffect, useState, useRef, useCallback} from 'react';
import debounce from 'lodash.debounce';

const Home = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentMasterCode, setCurrentMasterCode] = useState(null);
    const [currentFileLocation, setFileLocation] = useState('');
    const [currentSku, setSku] = useState('');
    const [imageExists, setImageExists] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50); // Default value
    const [selectedRow, setSelectedRow] = useState(null); // new variable to track selected row in the page
    const [hoveredRow, setHoveredRow] = useState(null); // new variable to track hovered row
    const [isMouseOver, setIsMouseOver] = useState(false); // Track mouse position
    const [dynamicMessage, setDynamicMessage] = useState('');
    const [title, setTitle] = useState('');
    const [searchText, setSearchText] = useState(''); // Search text state
    const [isSearching, setIsSearching] = useState(false); // Track if a search is active
    const magnifierRef = useRef(null);
    const containerRef = useRef(null);

    const fetchItems = useCallback(async (page = 1, limit = itemsPerPage, searchValue = '') => {
        try {
            let url = `/acha-kvell/item?page=${page}&limit=${limit}`;
            if (searchValue.trim() !== '') {
                url = `/acha-kvell/itemsSearch?masterCode=${searchValue}&page=${page}&limit=${limit}`;
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const thisJson = await response.json();
            setItems(thisJson.items);
            setFilteredItems(thisJson.items); // Initialize filtered items
            setCurrentPage(thisJson.currentPage);
            setTotalPages(thisJson.totalPages);
            if (thisJson.items.length > 0) {
                handleRowClick(thisJson.items[0].sku);
                setCurrentMasterCode(thisJson.items[0].masterCode);
                setSku(thisJson.items[0].sku);
                setSelectedRow(currentSku);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }, [itemsPerPage]);

    const handleRowClick = async (currentSku) => {
        try {
            const response = await fetch(`/acha-kvell/item/${currentSku}`);

            if (!response.ok) {
                throw new Error('Failed to fetch item details');
            }
            const thisJson = await response.json();
            setSelectedItem(thisJson);
            setCurrentMasterCode(thisJson.masterCode);
            setSku(thisJson.sku);
            setFileLocation(thisJson.fileLocation);
            setImageExists(thisJson.imageExists);
            setSelectedRow(currentSku); // Update the selectedRow state with the clicked sku   
        } catch (error) {
            console.error('Error fetching item details:', error);
        }
    };

    const goToPage = debounce((page) => {
        page = parseInt(page, 10);
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }, 300);

    const previousPage = debounce(() => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }, 300);

    const nextPage = debounce(() => {
        if (currentPage < totalPages) {
            handleRowClick(currentMasterCode,)
            setCurrentPage(currentPage + 1);
        }
    }, 300);

    useEffect(() => {
        fetchItems(currentPage, itemsPerPage, isSearching ? searchText : '');
    }, [currentPage, itemsPerPage, fetchItems, isSearching, searchText]);

    const handleItemsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value, 10);
        setItemsPerPage(newItemsPerPage);
        fetchItems(currentPage, newItemsPerPage, isSearching ? searchText : ''); // Fetch items based on the new itemsPerPage value
    };

    const handleMouseMove = (e) => {
        const magnifier = magnifierRef.current;
        const container = containerRef.current;
        const img = container.querySelector('img');
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x > 0 && y > 0 && x < rect.width && y < rect.height) {
            magnifier.style.display = 'block';
            magnifier.style.left = `${x - magnifier.offsetWidth / 3}px`;
            magnifier.style.top = `${y - magnifier.offsetHeight / 3}px`;
            magnifier.style.backgroundImage = `url(${img.src})`;
            magnifier.style.backgroundPosition = `-${x * 1.05 - magnifier.offsetWidth / 2}px -${y * 1.05 - magnifier.offsetHeight / 2}px`;
        } else {
            magnifier.style.display = 'none';
        }
    };

    const handleMouseLeave = () => {
        const magnifier = magnifierRef.current;
        magnifier.style.display = 'none';
    };

    const handleDoubleClick = useCallback((dynamicMessage, title) => {
        const newTab = window.open('', '_blank');
        newTab.document.write(dynamicMessage);
        newTab.document.title = title;
    }, []);

    const handleSearchSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (searchText.trim() !== '') {
            setIsSearching(true);
            try {
                const response = await fetch(`/acha-kvell/itemsSearch?masterCode=${searchText}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch items');
                }
                const thisJson = await response.json();
                setItems(thisJson.items);
                setFilteredItems(thisJson.items); // Initialize filtered items
                setCurrentPage(thisJson.currentPage);
                setTotalPages(thisJson.totalPages);
                if (thisJson.items.length > 0) {
                    handleRowClick(thisJson.items[0].sku);
                    setCurrentMasterCode(thisJson.items[0].masterCode);
                    setSku(thisJson.items[0].sku);
                    setSelectedRow(currentSku);
                }
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        } else {
            setIsSearching(false);
            fetchItems(currentPage, itemsPerPage); // Fetch all items if search text is empty
        }
    }, [itemsPerPage, searchText, fetchItems]);

} else if (search) {
    window.alert('No data found');
}

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <div className={"content"}>
            <div className="contentUtility">
                <p><br /> Utility Box Content. This is a sample text.</p>
            </div>
            <div className={"contentLeft"}>
                <div className="pagination-container">
                    <div>
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchText}
                                onChange={handleSearchChange}
                                style={{ width: '200px' }}
                            />
                            <button type="submit" style={{ position: 'relative', padding: '0', border: 'none', background: 'none' }}>
                                <img
                                    src="/pics/magnifier.png"
                                    alt="Search"
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '40%',
                                        transform: 'translateY(-75%)',
                                        width: '15px',
                                        height: '15px'
                                    }}
                                />
                            </button>
                        </form>
                    </div>
                    <div></div>
                    <div>
                        <button className="pagination-button" onClick={() => goToPage(1)}>{'<<'}</button>
                        <button className="pagination-button" onClick={previousPage}>{'<'}</button>
                        <input
                            type="number"
                            className="pagination-input"
                            value={currentPage}
                            min="1"
                            max={totalPages}
                            onChange={(e) => goToPage(Number(e.target.value))}
                        />
                        <button className="pagination-button" onClick={nextPage}>{'>'}</button>
                        <button className="pagination-button" onClick={() => goToPage(totalPages)}>{'>>'}</button>
                    </div>
                    <div className="rowsPerPage-dropdown">
                        <label>Rows PP</label>
                        <select value={itemsPerPage} on
