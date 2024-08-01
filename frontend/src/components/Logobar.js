import barHeaderText from '../components/logobarConfig.json';

const Logobar = () => {
    return (
        <header className="header">
                
                <img src="https://www.achadirect.com/static/version1716261394/frontend/store/acha/en_US/images/logo.webp"
                     alt="Acha Direct Logo"
                     className = "logo"
                />
                <div className = "headerScreenTitle">   
                    {barHeaderText.itemHeaderText}
                </div>
        </header>
    );
}

export default Logobar;
