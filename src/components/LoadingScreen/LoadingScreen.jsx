import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './LoadingScreen.scss'

export default function LoadingScreen() {
    return (
        <div className='spinner-container'>
            <CircularProgress size={60} color="secondary" />
        </div>
    );
}