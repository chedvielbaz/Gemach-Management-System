import React from "react";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export const LoginOrSighUp = () => {
    const navigate = useNavigate();

    const harshama = () => {
        navigate(ROUTES.SIGN_UP); 
    }
  
    const hitchabrut = () => {
        navigate(ROUTES.LOGIN);
    }

    return (
        <main className="page-shell auth-page">
            <div className="surface-card auth-gateway-card">
                <img src="/images/smalllogo.svg" alt="" className="auth-gateway-logo" />
                <h1 className="page-heading">ברוכים הבאים</h1>
                <p className="page-lead">
                    התחברו או הירשמו כדי להוסיף גמ&quot;ח ולעדכן את הקהילה.
                </p>
                <div className="auth-gateway-actions">
                    <Button variant="contained" color="primary" onClick={() => harshama()}>
                        הרשמה
                    </Button>
                    <Button variant="outlined" onClick={() => hitchabrut()}>
                        התחברות
                    </Button>
                </div>
            </div>
        </main>
    )
}