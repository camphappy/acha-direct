//Includes page listing.
import React, { useEffect, useState, useRef, useCallback} from 'react';
import debounce from 'lodash.debounce';
import lSidebar from '../../components/common/lSidebar.json';



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
    const [fileSelected, setFileSelected] = useState(null); // New state for file upload
    const magnifierRef = useRef(null);
    const containerRef = useRef(null);
    const images = [
        'http://192.168.101.48:3000/pics/DaGang1.png',
        'http://192.168.101.48:3000/pics/DaGang4.png',
        'http://192.168.101.48:3000/pics/DaGang5.png',
        'http://192.168.101.48:3000/pics/DaGang6.png',
        'http://192.168.101.48:3000/pics/DaGang7.png',
        'http://192.168.101.48:3000/pics/DaGang8.png'
      ];
    
    const randomImage = images[Math.floor(Math.random() * images.length)];
    
      // Dynamic styles for the contentLeft div
    const dynamicContentLeftBackgroundStyle = {
        backgroundImage: `url('${randomImage}')`
    };

    const fetchItems = useCallback(async (page = 1, limit = itemsPerPage, searchValue = '') => {
        try {
            let url = `/acha-kvell/item?page=${page}&limit=${limit}`;
            if (searchValue.trim() !== '') {
                url = `/acha-kvell/itemSpecial/search?reqmasterCode=${searchValue}&page=${page}&limit=${limit}`;
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const thisJson = await response.json();
            setItems(thisJson.items);
            setFilteredItems(thisJson.items); // Initialize filtered items
            setCurrentPage(page);
            setTotalPages(thisJson.totalPages || Math.ceil(thisJson.items.length / limit)); // Update total pages);
            if (thisJson.items.length > 0) {
                handleRowClick(thisJson.items[0].sku);
                setCurrentMasterCode(thisJson.items[0].masterCode);
                setSku(thisJson.items[0].sku);
                setSelectedRow(currentSku);
            } else {
                window.alert('No data found');
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
        if (isSearching && searchText.trim() !== '') {
            fetchItems(1, newItemsPerPage, searchText); // Fetch filtered items based on the new itemsPerPage value
        } else {
            fetchItems(1, newItemsPerPage); // Fetch all items based on the new itemsPerPage value
        }
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
        
        // Convert searchText to uppercase
        const upperCaseSearchText = searchText.trim().toUpperCase();
    
        // Check if the searchText is empty
        if (upperCaseSearchText === '') {
            window.alert('Enter data in Search field');
            return;}

        try {
            const response = await fetch(`/acha-kvell/itemSpecial/search?reqmasterCode=${upperCaseSearchText}`);
            if (response.status === 404) {
                const data = await response.json();
                window.alert(data.message);
                return;
            }
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const thisJson = await response.json();
            if (thisJson.items.length > 0) {
            setIsSearching(true);
            setFilteredItems(thisJson.items); // Initialize filtered items
            setItems(thisJson.items);
            setCurrentPage(1);
            setTotalPages(Math.ceil(thisJson.items.length / itemsPerPage)); // Update the total pages based on filtered results
                handleRowClick(thisJson.items[0].sku);
                setCurrentMasterCode(thisJson.items[0].masterCode);
                setSku(thisJson.items[0].sku);
                setSelectedRow(currentSku);
            } else {
                window.alert('No data found')
            }
        }
        catch (error) {
                console.error('Error fetching items:', error);
        }
    }, [itemsPerPage, searchText]);
    
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        console.log('Search text changed:', e.target.value);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' && isMouseOver) {
                handleDoubleClick(dynamicMessage, title);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMouseOver, dynamicMessage, title, handleDoubleClick]);

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        setFileSelected(selectedFile);

        // Directly show the file information in alert
        if (!selectedFile) {
            window.alert('No file selected');
        }

        // Log the file information to the console
        console.log('File selected:', selectedFile);
    };  

    const handleUpload = async () => {
        if (!fileSelected) {
            window.alert('Please do select a file first');
            return;
        }
        const formData = new FormData();
            formData.append('file', fileSelected);

        try {
            let errNo
            const uploadResponse = await fetch('/acha-kvell/upload', {
                method: 'POST',
                body: formData});
            const backendUploadResponse = await uploadResponse.json();
            if (backendUploadResponse.responseNo = "409") {
                //file already exists
                const overwrite = window.confirm(`${backendUploadResponse.message409}`);
                if (!overwrite) {
                    window.alert('File upload canceled.');
                    return;
                }else{
                    window.alert(`${fileSelected.name} ready for processing`);
                } 
            }
            window.alert(`Processing: ${fileSelected.name}`);
            const updateResponse = await fetch('/acha-kvell/upload/update', {
                method: 'POST',
                body: formData
            });
            const backendUpdateResponse = await updateResponse.json();
            if (backendUpdateResponse.data) {    
                // Format the data as JSON
                const formattedData = JSON.stringify(backendUpdateResponse.data, null, 2);
                // Compose html content
                const htitle = `Read Only - ${fileSelected.name}`;
                const htmlContent = `
                    <html>
                        <head>
                            <title>${htitle}</title>
                            <style>
                                body { font-family: Arial, sans-serif; margin: 20px; }
                                pre { white-space: pre-wrap; word-wrap: break-word; }
                            </style>
                        </head>
                        <body>
                            <pre>${formattedData}</pre>
                        </body>
                    </html>
                `;
                //construct new Window for RO output
                const newWindow = window.open('', '_blank', 'width=600,height=400,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes');
                newWindow.document.write(htmlContent);
                newWindow.document.close();
            } else {
                window.alert('Error: No data received from the server');
            }

            //if (backendUpdateResponse.responseNo = "200") {
            //    window.alert(`${backendUpdateResponse.message}`);
            //}
        }
        catch (error) {
            console.error('Error:', error);
            //window.alert('home.js: File SELECTED upload failed');
        }
        // Proceed with the file upload if the user confirms or if the file doesn't exist
        //window.alert('File upload will proceed.');
    };


    return (
        <div className={"content"}>
            <div className = "contentUtilty">
                <p><h2>Utility</h2></p>
                <div>
                <p>Bulk Update</p>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                    /><br/>
                    <button onClick={handleUpload}>Upload and Process</button>
                </div>
            </div>
            <div className={"contentLeft"}>
            {/*<div className={"contentLeft"} style={dynamicContentLeftBackgroundStyle}> */}
                <div className="pagination-container"> {/* Existing pagination and item list */}
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
                    <div className ={"rowsPerPage-dropdown"}>
                        <label>Rows PP</label>
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
                    <div>Attr1</div>
                    <div>Val1</div>
                    <div>Attr2</div>
                    <div>Val2</div>
                    <div>Stock Qty</div>
                </div>
                <div className={"scrollable"}>
                    {filteredItems.map((item, index) => (
                        <div
                            key={item.sku}
                            className={`rowList ${selectedRow === item.sku ? 'selected' : ''}`}
                            onClick={() => handleRowClick(item.sku)}
                            onMouseEnter={() => setHoveredRow(item.sku)}
                            onMouseLeave={() => setHoveredRow(null)}
                            style={{
                                backgroundColor: selectedRow === item.sku ? 'lightblue' : hoveredRow === item.sku ? 'lightgrey' : 'white'
                                }}> {/* Apply background color based on selection */}
                            <div
                                onMouseEnter={() => {
                                    setIsMouseOver(true)
                                    setDynamicMessage('masterCode was double clicked')
                                    setTitle(item.masterCode)
                                }}
                                onMouseLeave={() => setIsMouseOver(false)}
                                onDoubleClick={() => handleDoubleClick(dynamicMessage,`masterCode:${item.masterCode}`)}>
                                {item.masterCode}
                            </div>
                            <div
                                onMouseEnter={() => {
                                    setIsMouseOver(true)
                                    setDynamicMessage('oldCode was double clicked')
                                }}
                                onMouseLeave={() => setIsMouseOver(false)}
                                onDoubleClick={() => handleDoubleClick(dynamicMessage,`oldCode:${item.oldCode}`)}>
                                {item.oldCode}
                            </div>
                            <div
                                onMouseEnter={() => {
                                setIsMouseOver(true)
                                setDynamicMessage('sku was double clicked')
                                }}
                                onMouseLeave={() => setIsMouseOver(false)}
                                onDoubleClick={() => handleDoubleClick(dynamicMessage,`sku:${item.sku}`)}>
                                {item.sku}
                            </div>
                            <div>{item.Attribute1}</div>
                            <div>{item.Value1}</div>
                            <div>{item.Attribute2}</div>
                            <div>{item.Value2}</div>
                            <div className="qty-container">
                                {item.itemQty.map((qty, idx) => (
                                      <div key={idx} className="qty-item">
                                          {qty.itemQty}
                                          <div className="tooltip">
                                              <div>On Order Qty: {qty.onOrderQty}</div>
                                              <div>QC Qty: {qty.qcQty}</div>
                                              <div>Trashy Trashybox Qty: {qty.trashyTrashybox}</div>
                                          </div>
                                      </div>
                                ))}
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
                            {imageExists ? (
                                <div
                                className="container"
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                ref={containerRef}>
                                <img
                                        src={(currentFileLocation)}
                                        alt={`Master Code not loaded ${currentFileLocation}`}
                                    />
                                    <div className="magnifier" ref={magnifierRef}></div>
                                    {/*{`Current Master Code: ${currentFileLocation}, ${currentMasterCode}`}*/}
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