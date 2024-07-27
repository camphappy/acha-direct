import debounce from 'lodash.debounce';

const itemFunction = {

    fetchItems: async (page = 1, limit = 50) => {
        try {
            const response = await fetch(`/acha-kvell/item?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const thisJson = await response.json();
            return thisJson;
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        }
    },

    goToPage: debounce((page) => {
        page = parseInt(page, 10);
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }, 300),

    previousPage: debounce(() => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }, 300),

    nextPage: debounce(() => {
        if (currentPage < totalPages) {
            handleRowClick(currentMasterCode,)
            setCurrentPage(currentPage + 1);
        }
    }, 300),

}

export default itemFunction