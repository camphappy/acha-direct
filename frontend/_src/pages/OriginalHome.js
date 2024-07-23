import React, { useEffect, useState, useRef } from 'react';
import debounce from 'lodash.debounce';


const Home = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentMasterCode, setCurrentMasterCode] = useState(null);
    const [currentFileLocation, setFileLocation] = useState('');
    const [currentSku, setSku] = useState(null);
    const [imageExists, setImageExists] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50); // Default value
    const magnifierRef = useRef(null);
    const containerRef = useRef(null);
   
    const fetchItems = async (page = 1, limit = itemsPerPage) => {
        try {
            const response = await fetch(`/acha-kvell/item?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const thisJson = await response.json();
            setItems(thisJson.items);
            setCurrentPage(thisJson.currentPage);
            setTotalPages(thisJson.totalPages);
            if (thisJson.items.length > 0) {
                handleRowClick(this.Json.items[0].masterCode);
                {/*setSelectedItem(thisJson.items[0]); // Set the first item as the default selected item*/}
                setCurrentMasterCode(thisJson.items[0].masterCode);
                setSku(thisJson.items[0].sku);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        }    
    };

    const handleRowClick = async (masterCode) => {
        try {
            const response = await fetch(`/acha-kvell/item/${masterCode}`);

            if (!response.ok) {
                throw new Error('Failed to fetch item details');
            }
            const thisJson = await response.json();
                setSelectedItem(thisJson);
                setCurrentMasterCode(thisJson.masterCode);
                setSku(thisJson.sku);
                setFileLocation(thisJson.fileLocation);
                setImageExists(thisJson.imageExists);  
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
        fetchItems(currentPage);
    }, [currentPage]);

    const handleItemsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value, 10);
        setItemsPerPage(newItemsPerPage);
        fetchItems(currentPage, newItemsPerPage); // Fetch items based on the new itemsPerPage value
    
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
            magnifier.style.left = `${x - magnifier.offsetWidth / 2}px`;
            magnifier.style.top = `${y - magnifier.offsetHeight / 2}px`;
            magnifier.style.backgroundImage = `url(${img.src})`;
            magnifier.style.backgroundPosition = `-${x * 1.5 - magnifier.offsetWidth / 2}px -${y * 1.5 - magnifier.offsetHeight / 2}px`;
        } else {
            magnifier.style.display = 'none';
        }
    };

    const handleMouseLeave = () => {
        const magnifier = magnifierRef.current;
        magnifier.style.display = 'none';
    };

    //Images must always be under MernStart/frontend/public/
    // for this project, it is stored in 
    //const getImagePath = (thisMasterCode) => {
    //    return currentFileLocation;
    //};

    return (
        <div className={"content"}>
            <div className={"contentLeft"}>
                <div className="pagination-container">
                    <button className="pagination-button" onClick={() => goToPage(1)}>First Page</button>
                    <button className="pagination-button" onClick={previousPage}>Previous</button>
                    <input
                        type="number"
                        className="pagination-input"
                        value={currentPage}
                        min="1"
                        max={totalPages}
                        onChange={(e) => goToPage(Number(e.target.value))}
                    />
                    <button className="pagination-button" onClick={nextPage}>Next</button>
                    <button className="pagination-button" onClick={() => goToPage(totalPages)}>Last</button>
                    <div>
                        <label>Rows PP</label><br/>
                        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="75">75</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                </div>
                <div className={"menuField"}>
                   <div>Master Code</div>
                   <div>Old Code</div>
                   <div>SKU</div>
                    <div>Link</div>
                </div>
                <div className={"scrollable"}>
                    {items.map((item) => (
                        <div key={item.sku} className={"rowList"}>
                            <div>{item.masterCode}</div>
                            <div>{item.oldCode}</div>
                            <div>{item.sku}</div>
                            <div classname={"infoButton"}>
                                <button onClick={() => handleRowClick(item.sku)}>
                                     Click for info
                                </button>
                            </div>
                        </div>
                    ))} 
                </div>
                  
            </div>
            
            {imageExists && (
                <div className="contentRight">
                    {/* Display the selected item JSON */}
                    {selectedItem && <pre>{JSON.stringify(selectedItem, null, 2)}</pre>}
                        <div>
                            {currentMasterCode && `Current Master Code: ${currentFileLocation}, ${currentMasterCode}`}
                        </div>
                <div>
                            {imageExists ? (
                                <div
                                className="container"
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                ref={containerRef}>
                                <img
                                        src={(currentFileLocation)}
                                        alt={`Master Code Image not loaded {currentFileLocation}`}
                                    />
                                    <div className="magnifier" ref={magnifierRef}></div>
                                </div>
                            ) : (

                                'Image not found'
                            )}
                </div>
                </div>
            )}
        </div>
    );
};
export default Home;
