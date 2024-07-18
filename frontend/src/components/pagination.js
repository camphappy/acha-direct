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


const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
};

return (
    <div className="pagination-container">
        <button className="pagination-button" onClick={() => goToPage(1)}>1</button>
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
);
};

export default Pagination;