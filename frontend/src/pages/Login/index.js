import './style.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GetCustomerByPassword } from '../../redux/api/usersApi';
import { RtlMuiShell } from '../../components/RtlMuiShell';
import { ROUTES } from '../../constants/routes';


export const Login = () => {

    const [custEmail, setEmail] = useState("");
    const [custPasswword, setcustPasswword] = useState("");
    const [isValidValues, setIsValidValues] = useState(true);
    const [clickEnter, setClickEnter] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state)=>state.users.isAuthenticated);
    const isLoading = useSelector((state)=>state.users.isLoading);


    const checkValues = () => {
        const email = custEmail.trim();
        const passDigits = String(custPasswword).trim();
        if (!email || !passDigits) {
            setIsValidValues(false);
            return;
        }
        if (!/^\d+$/.test(passDigits)) {
            setIsValidValues(false);
            return;
        }
        const custPassNum = Number(passDigits);
        if (!Number.isSafeInteger(custPassNum)) {
            setIsValidValues(false);
            return;
        }
        const user = {
            custEmail: email,
            custName: "",
            custPasswword: custPassNum,
        };
        setIsValidValues(true);
        dispatch(GetCustomerByPassword(user));
        setClickEnter(true);
    };

    useEffect(()=>{
    
        if(isAuthenticated){
            navigate(ROUTES.MY_GMACHES);
        }
        else if(!isLoading && !isAuthenticated && clickEnter){
            setIsValidValues(false)
        }
    }, [isAuthenticated, isLoading, navigate, clickEnter])


    return (
        <RtlMuiShell>
        <div className="auth-page page-shell" dir="rtl" lang="he">
            <div className="surface-card auth-card">
                <h1 className="page-heading">התחברות</h1>
                <p className="page-lead">הזינו מייל וסיסמה כדי לגשת לאזור האישי ולהוסיף גמ&quot;ח.</p>
                <form
                    className="auth-form-stack"
                    onSubmit={(e) => {
                        e.preventDefault();
                        checkValues();
                    }}
                    noValidate
                >
                    <TextField
                        id="login-email"
                        label="מייל"
                        type="email"
                        variant="outlined"
                        fullWidth
                        required
                        value={custEmail}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        id="login-password"
                        label="סיסמה (ספרות בלבד)"
                        type="password"
                        variant="outlined"
                        fullWidth
                        required
                        inputMode="numeric"
                        autoComplete="current-password"
                        value={custPasswword}
                        onChange={(e) => setcustPasswword(e.target.value)}
                    />
                    <div className="auth-actions">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                        >
                            כניסה
                        </Button>
                    </div>
                </form>
                {!isValidValues && (
                    <div className="auth-error" role="alert">
                        המשתמש אינו קיים במערכת או שהפרטים שגויים. ודאו שהסיסמה היא ספרות בלבד, כמו בהרשמה.
                    </div>
                )}
            </div>
        </div>
        </RtlMuiShell>
    )
}