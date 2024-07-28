import React, { useEffect, useState, useRef, useCallback } from 'react';
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
    const [selectedRow, setSelectedRow] = useState(null); // new variable to track selected row in the page
    const [isMouseOver, setIsMouseOver] = useState(false); // Track mouse position over "Master Code"
    const magnifierRef = useRef(null);
    const containerRef = useRef(null);

    const fetchItems = useCallback(async (page = 1, limit = itemsPerPage) => {
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
                handleRowClick(thisJson.items[0].sku);
                setCurrentMasterCode(thisJson.items[0].masterCode);
                setSku(thisJson.items[0].sku);
                setSelectedRow(currentSku);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }, [itemsPerPage]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                openNewTab();
            }
        };

        const openNewTab = () => {
            window.open('', '_blank').document.write(dynamic);
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleDoubleClick = () => {
        window.open('', '_blank').document.write('Master Code clicked twice');
    };
