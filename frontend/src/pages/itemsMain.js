import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import ItemList from '../components/ItemList';
import ImageDisplay from '../components/ImageDisplay';
import { fetchItems, fetchItemDetails } from '../utils/api';

const ItemsHome = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentMasterCode, setCurrentMasterCode] = useState(null);
    const [currentFileLocation, setFileLocation] = useState('');
    const [currentSku, setSku] = useState(null);
    const [imageExists, setImageExists] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    const handleRowClick = async (masterCode) => {
        try {
            const itemDetails = await fetchItemDetails(masterCode);
            setSelectedItem(itemDetails);
            setCurrentMasterCode(itemDetails.masterCode);
            setSku(itemDetails.sku);
            setFileLocation(itemDetails.fileLocation);
            setImageExists(itemDetails.imageExists);
        } catch (error) {
            console.error('Error fetching item details:', error);
        }
    };

    useEffect(() => {
        const loadItems = async () => {
            try {
                const data = await fetchItems(currentPage, itemsPerPage);
                setItems(data.items);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
                if (data.items.length > 0) {
                    handleRowClick(data.items[0].masterCode);
                }
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        loadItems();
    }, [currentPage, itemsPerPage]);

    return (
        <div className="content">
            <div className="contentLeft">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    setItemsPerPage={setItemsPerPage}
                />
                <div className="menuField">
                    <div>Master Code</div>
                    <div>Old Code</div>
                    <div>SKU</div>
                    <div>Link</div>
                </div>
                <ItemList items={items} handleRowClick={handleRowClick} />
            </div>
            {imageExists && (
                <ImageDisplay
                    currentFileLocation={currentFileLocation}
                    imageExists={imageExists}
                />
            )}
        </div>
    );
};

export default ItemsHome;
