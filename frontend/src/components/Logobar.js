import barHeaderText from './logobarConfig.json';

const Logobar = () => {
    return (
        <header className="header">
                <img src="/pics/logo.webp"
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
