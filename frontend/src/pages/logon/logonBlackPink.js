import React, { useState } from 'react';
//import Logobar from '../../components/Logobar';
//import '../../styles/itemMgmt.css';           //Item Management screen
//import ItemMgmt from '../item/itemManagement';


const LogonFrm = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status*/}

    const handleLogin = (e) => {
        e.preventDefault();
        
        // Check if the first image is selected and the username and password are filled
        if (selectedImage === 'LisaBlackPink' && username && password) {
            // Placeholder logic for launching app.js (replace this with actual logic)
            console.log('Logging in:', username, password);
            onLogin();
        } else {
            alert('Please select the first image and fill in both fields to login');
        }
    };

    const selectImage = (imageId) => {
        setSelectedImage(imageId);
    };

    {/*if (isLoggedIn) {
        return (
        <>
        <Logobar />  
        <ItemMgmt /> 
        </>
        )
    } */}

    return (
        <div className="logon-container">
            <form onSubmit={handleLogin} className="logon-form">
                <img src="/pics/logo.webp"
                     alt="Acha Direct Logo"
                     className = "logo"
                />
                <div className="gif-container">
                    <img src="/pics/LisaBlackPink.gif"
                         alt="BlackPink"
                         id="LisaBlackPink"
                         class="selectable-image"
                         onClick={() => selectImage('LisaBlackPink')}  // select the image on click
                         className={`logo-gif selectable-image ${selectedImage === 'LisaBlackPink' ? 'selected' : ''}`} // Apply 'selected' class if selected    
                    />
                    <img src="/pics/JennieBlackPink.gif"
                         alt="BlackPink"
                         id="JennieBlackPink"
                         class="selectable-image"
                         onClick={() => selectImage('JennieBlackPink')}  // select the image on click
                         className={`logo-gif selectable-image ${selectedImage === 'JennieBlackPink' ? 'selected' : ''}`} // Apply 'selected' class if selected    
                    />
                    
                    <img src="/pics/RoseBlackPink.gif"
                         alt="BlackPink"
                         class="selectable-image"
                         onClick={() => selectImage('RoseBlackPink')}  // select the image on click
                         className={`logo-gif selectable-image ${selectedImage === 'RoseBlackPink' ? 'selected' : ''}`} // Apply 'selected' class if selected    
                    />
                    <img src="/pics/JisooBlackPink.gif"
                         alt="BlackPink"
                         id="JisooBlackPink"
                         class="selectable-image"
                         onClick={() => selectImage('JisooBlackPink')}  // select the image on click
                         className={`logo-gif selectable-image ${selectedImage === 'JisooBlackPink' ? 'selected' : ''}`} // Apply 'selected' class if selected    


                    />
                </div>
                <p></p>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="logon-button">Login to CAPIS</button>
            </form>
        </div>
    );
};

export default LogonFrm;
