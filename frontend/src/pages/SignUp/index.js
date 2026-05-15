
import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import './style.css'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUserApi } from '../../redux/api/usersApi';
import { resetAuthFormStatus } from '../../redux/slices/users';
import { RtlMuiShell } from '../../components/RtlMuiShell';
import { ROUTES } from '../../constants/routes';



export const SignUp = () => {
    
const [custPhone, setcustPhone] = useState("");
const [custEmail, setcustEmail] = useState("");
const [custName, setcustName] = useState("");
const [custPasswword, setcustPasswword] = useState("");
const [clientError, setClientError] = useState(null);
const status = useSelector((state)=>state.users.status)
const signupError = useSelector((state)=>state.users.error)
const navigate = useNavigate();
const dispatch = useDispatch();

const MAX_NAME_LEN = 15;

const enterValues = (e) => {
    if (e?.preventDefault) e.preventDefault();

    const email = custEmail.trim();
    const name = custName.trim();
    setClientError(null);
    if (!email || !name) {
        setClientError("נא למלא מייל ושם משתמש.");
        return;
    }
    if (name.length > MAX_NAME_LEN) {
        setClientError(`שם המשתמש ארוך מדי — במערכת ניתן עד ${MAX_NAME_LEN} תווים.`);
        return;
    }

    const passDigits = String(custPasswword).trim();
    if (!/^\d+$/.test(passDigits)) {
        setClientError(
            "הסיסמה במערכת זו נשמרת כמספר בלבד. הזינו ספרות בלבד (ללא אותיות וסימנים)."
        );
        return;
    }
    const custPasswwordNum = Number(passDigits);
    if (!Number.isSafeInteger(custPasswwordNum)) {
        setClientError("ערך הסיסמה לא תקין.");
        return;
    }

    let custPhoneNum = null;
    const phoneDigits = String(custPhone).replace(/\D/g, "");
    if (phoneDigits.length > 0) {
        custPhoneNum = Number.parseInt(phoneDigits, 10);
        if (!Number.isFinite(custPhoneNum)) {
            setClientError("מספר טלפון לא תקין.");
            return;
        }
    }

    dispatch(
        addUserApi({
            custEmail: email,
            custName: name,
            custPhone: custPhoneNum,
            custPasswword: custPasswwordNum,
        })
    );
};

const signupFailedMessage =
    signupError && typeof signupError.message === 'string'
        ? signupError.message
        : 'לא הצלחנו ליצור את החשבון. ודאו שהמייל לא רשום כבר, שהשם עד 15 תווים, ושהסיסמה מורכבת מספרות בלבד.';

useEffect(() => {
    dispatch(resetAuthFormStatus());
}, [dispatch]);

useEffect(() => {
    if (status !== 'succeeded') return;
    const redirectMs = 1700;
    const t = window.setTimeout(() => navigate(ROUTES.MY_GMACHES), redirectMs);
    return () => window.clearTimeout(t);
}, [status, navigate]);

    return (
        <RtlMuiShell>
        <div className="auth-page page-shell" dir="rtl" lang="he">
            <div className="surface-card auth-card">
                <h1 className="page-heading">הרשמה</h1>
                <p className="page-lead">
                    פתחו חשבון כדי לפרסם גמ&quot;ח ולנהל את הרשומות שלכם במקום אחד.
                </p>
                {clientError && (
                    <Alert
                        severity="warning"
                        sx={{ mb: 2 }}
                        role="alert"
                        onClose={() => setClientError(null)}
                    >
                        {clientError}
                    </Alert>
                )}
                {status === 'succeeded' && (
                    <Alert severity="success" sx={{ mb: 2 }} role="status">
                        נרשמת בהצלחה. מעבירים אתכם לאזור האישי…
                    </Alert>
                )}
                {status === 'failed' && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        onClose={() => dispatch(resetAuthFormStatus())}
                        role="alert"
                    >
                        {signupFailedMessage}
                    </Alert>
                )}
                <form
                    className="auth-form-stack"
                    onSubmit={enterValues}
                    noValidate
                >
                    <TextField
                        id="signup-name"
                        label="שם משתמש"
                        variant="outlined"
                        fullWidth
                        required
                        inputProps={{ maxLength: MAX_NAME_LEN }}
                        helperText={`עד ${MAX_NAME_LEN} תווים`}
                        value={custName}
                        onChange={(e) => setcustName(e.target.value)}
                    />
                    <TextField
                        id="signup-email"
                        label="מייל"
                        type="email"
                        variant="outlined"
                        fullWidth
                        required
                        value={custEmail}
                        onChange={(e) => setcustEmail(e.target.value)}
                    />
                    <TextField
                        id="signup-phone"
                        label="טלפון"
                        variant="outlined"
                        fullWidth
                        inputMode="numeric"
                        value={custPhone}
                        onChange={(e) => setcustPhone(e.target.value)}
                    />
                    <TextField
                        id="signup-password"
                        label="סיסמה (ספרות בלבד)"
                        type="password"
                        variant="outlined"
                        fullWidth
                        required
                        inputMode="numeric"
                        autoComplete="new-password"
                        value={custPasswword}
                        onChange={(e) => setcustPasswword(e.target.value)}
                    />
                    <div className="auth-actions">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={status === 'loading' || status === 'succeeded'}
                        >
                            הרשמה והמשך
                        </Button>
                    </div>
                </form>
            </div>
        </div>
        </RtlMuiShell>
    )
}