import React, { useRef } from 'react';

const ImageDisplay = ({ currentFileLocation, imageExists }) => {
    const magnifierRef = useRef(null);
    const containerRef = useRef(null);

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

    return (
        <div className="contentRight">
            {imageExists ? (
                <div
                    className="container"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    ref={containerRef}>
                    <img
                        src={currentFileLocation}
                        alt={`Master Code Image not loaded ${currentFileLocation}`}
                    />
                    <div className="magnifier" ref={magnifierRef}></div>
                </div>
            ) : (
                'Image not found'
            )}
        </div>
    );
};

export default ImageDisplay;
