import React, { useEffect, useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
//import styles from '../styles/home.module.css'; // Correct import path

const Home = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentMasterCode, setCurrentMasterCode] = useState(null);
    const [currentFileLocation, setFileLocation] = useState('');
    const [filePath, setfilePat] = useState('');
    const [currentSku, setSku] = useState(null);
    const [imageExists, setImageExists] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

    useEffect(() => {
        const fetchItems = async (sku) => {
            const response = await fetch('/acha-kvell/item/');
            const json = await response.json();
            if (response.ok) {
                setItems(json);
                setSelectedItem(json[0]); // Set the first item as the default selected item
                setCurrentMasterCode(json[0].masterCode);
                setSku(json[0].sku);
                setFileLocation(json[0].fileLocation);
                setImageExists(json[0].imageExists);                


            }
        };
        fetchItems();
    }, []);
    const handleRowClick = async (currentSku) => {
        const response = await fetch(`/acha-kvell/item/${currentSku}`);
        const thisJson = await response.json();
        if (response.ok) {
            setSelectedItem(thisJson);
            setCurrentMasterCode(thisJson.masterCode);
            setCurrentMasterCode(thisJson.masterCode);
            setSku(thisJson.sku);
            setFileLocation(thisJson.fileLocation);
            setImageExists(thisJson.imageExists);  
        }
    };

    //Images must always be under MernStart/frontend/public/
    // for this project, it is stored in 
    const getImagePath = (thisMasterCode) => {
        return currentFileLocation;
    };

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    return (
        <div className={"content"}>
            <div className={"contentLeft"}>
                <div className={"menuField"}>
                   <div>Master Code</div>
                   <div>Old Code</div>
                   <div>SKU</div>
                    <div>Link</div>
                </div>
                <div className={"scrollable"}>
                    {currentItems.map((item) => (
                        <div key={item.sku} className={"rowList"}>
                            <div>{item.masterCode}</div>
                            <div>{item.oldCode}</div>
                            <div>{item.sku}</div>
                            <div classname="infoButton">
                                <button onClick={() => handleRowClick(item.masterCode)}>
                                     Click for info
                                </button>
                            </div>
                        </div>
                    ))} 
                </div>       
            </div>
            <div className="contentRight">
                {/* Display the selected item JSON */}
                {selectedItem && <pre>{JSON.stringify(selectedItem, null, 2)}</pre>}
                <div>{currentMasterCode && `Current Master Code: ${currentFileLocation}, ${currentMasterCode}`}</div>
                <div>
                            {imageExists ? (
                                <img
                                    src={(currentFileLocation)}
                                    alt={`Master Code Image not loaded {currentFileLocation}`}
                                />
                            ) : (

                                'Image not found'
                            )}
                </div>

            </div>
        </div>
    );
};
export default Home;
