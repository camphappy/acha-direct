import React from 'react';

const ItemList = ({ items, handleRowClick }) => {
    return (
        <div className="scrollable">
            {items.map((item) => (
                <div key={item.sku} className="rowList">
                    <div>{item.masterCode}</div>
                    <div>{item.oldCode}</div>
                    <div>{item.sku}</div>
                    <div className="infoButton">
                        <button onClick={() => handleRowClick(item.sku)}>
                            Click for info
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItemList;
