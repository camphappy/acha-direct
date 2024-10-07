import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/logon.css';              //This screen


import LogonApp from './LogonApp';        //import the LogonApp into this module

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(                              //Launch the LogonA
  <React.StrictMode>
    <LogonApp />
  </React.StrictMode>
);