import React, { useContext } from "react";
import Fab from '@mui/material/Fab';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { DarkModeContext } from "../../context/DarkModeContext";
import "./MainContainer.scss"

export default function MainContainer(props) {
    const {darkMode, toggleDarkMode} = useContext(DarkModeContext)
    return (
        <div className="main-container" style={{ backgroundImage: darkMode ? "url(/bg-dark.png)" : "url(/bg-light.png)" }}>
            {props.children}
            <Fab onClick={() => {toggleDarkMode()}} style={{ position: 'fixed', bottom: 10, right: 10 }} aria-label="dark-theme-toggle">
                {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </Fab>
        </div>
    )
}