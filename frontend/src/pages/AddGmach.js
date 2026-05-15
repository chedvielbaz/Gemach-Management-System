import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { AddDetails } from '../components/addDetails';
import { SelectGmachType } from '../components/selectGmachType';
import { useDispatch, useSelector } from 'react-redux';
import { setStatusToIdle } from '../redux/slices/gmachim';
import { useNavigate } from 'react-router-dom';
import { addGmachAPI, getMyGmachesApi } from '../redux/api/gmachimAPI';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { RtlMuiShell } from '../components/RtlMuiShell';
import { ROUTES } from '../constants/routes';
import { useOwnerEmail } from '../hooks/useOwnerEmail';

export const AddGmach = () => {
    const [listProduct, setProducts] = useState([]);
    const [gmachKindCode, setGmachKindCode] = useState('');
    const [gmachName, setGmachName] = useState("");
    const [gmachAddrres, setGmachAddress] = useState("");
    const [gmachPhone, setGmachPhone] = useState("");
    const [numDays, setNumDays] = useState("");
    const [comments, setComments] = useState("");
    const [gmachTimes, setGmachTimes] = useState("");
    const [gmachPikadon, setGmachPikadon] = useState(false);
    const [clickAdd, setClickAdd] = useState(false);
    const [validationError, setValidationError] = useState(null);

    const status = useSelector((state) => state.gmachim.addGmachStatus);
    const addError = useSelector((state) => state.gmachim.addGmachError);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const ownerEmail = useOwnerEmail();

    const addGmach = () => {
        setValidationError(null);
        if (!ownerEmail) {
            setValidationError(
                "יש להתחבר לאזור האישי לפני שמירת גמ״ח, כדי לשייך אותו לחשבון ולאפשר מחיקה עתידית."
            );
            return;
        }

        const kind = Number.parseInt(String(gmachKindCode).trim(), 10);
        if (!Number.isFinite(kind)) {
            setValidationError("נא לבחור סוג גמ״ח מהרשימה.");
            return;
        }

        const nameTrim = String(gmachName).trim();
        const addrTrim = String(gmachAddrres).trim();
        const timesTrim = String(gmachTimes).trim();
        if (!nameTrim || !addrTrim || !timesTrim) {
            setValidationError("נא למלא שם גמ״ח, כתובת ושעות פעילות.");
            return;
        }

        const phoneDigits = String(gmachPhone).replace(/\D/g, "");
        let gmachPhoneVal = null;
        if (phoneDigits.length > 0) {
            gmachPhoneVal = Number.parseInt(phoneDigits, 10);
            if (!Number.isFinite(gmachPhoneVal)) {
                setValidationError("מספר טלפון לא תקין.");
                return;
            }
        }

        const daysRaw = String(numDays).trim();
        let numDaysVal = null;
        if (daysRaw !== "") {
            numDaysVal = Number.parseInt(daysRaw, 10);
            if (!Number.isFinite(numDaysVal) || numDaysVal < 0) {
                setValidationError("מספר ימי השאלה חייב להיות מספר שלם חיובי.");
                return;
            }
        }

        const normalizedProducts = [];
        for (let i = 0; i < listProduct.length; i += 1) {
            const p = listProduct[i];
            const pname = String(p.productName ?? "").trim();
            const cnt = Number(p.productCount);
            if (!pname) {
                setValidationError("יש פריט ברשימה בלי שם — תקנו או מחקו אותו.");
                return;
            }
            if (!Number.isFinite(cnt) || cnt < 0 || !Number.isInteger(cnt)) {
                setValidationError(
                    `כמות המלאי חייבת להיות מספר שלם חיובי (פריט: "${pname}").`
                );
                return;
            }
            normalizedProducts.push({ productName: pname, productCount: cnt });
        }

        const gmach = {
            gmachName: nameTrim,
            gmachAddrres: addrTrim,
            gmachPikadon: Boolean(gmachPikadon),
            gmachTimes: timesTrim,
            gmachPhone: gmachPhoneVal,
            gmachKindCode: kind,
            comments: String(comments ?? "").trim() || null,
            numDays: numDaysVal,
            custEmail: ownerEmail,
        };

        setClickAdd(true);
        dispatch(addGmachAPI({ gmach, listProduct: normalizedProducts }));
    };

    const saveFailedMessage =
        typeof addError === 'string' && addError.trim()
            ? addError.trim()
            : 'שמירת הגמ״ח נכשלה. ודאו שכל השדות תקינים ושהשרת רץ.';

    useEffect(() => {
        if (!clickAdd || status !== 'succeeded') return;
        const redirectMs = 1700;
        const t = window.setTimeout(() => {
            const finish = async () => {
                try {
                    await dispatch(getMyGmachesApi(ownerEmail)).unwrap();
                } catch {
                    /* באזור האישי תתבצע טעינה מחדש */
                }
                dispatch(setStatusToIdle());
                setClickAdd(false);
                navigate(ROUTES.MY_GMACHES);
            };
            void finish();
        }, redirectMs);
        return () => window.clearTimeout(t);
    }, [clickAdd, status, dispatch, navigate, ownerEmail]);

    return (
        <RtlMuiShell>
        <main className="page-shell add-gmach-shell" dir="rtl" lang="he">
            <div className="surface-card add-gmach-card" style={{ maxWidth: 720, margin: "0 auto" }}>
            <Typography variant="h4" component="h1" gutterBottom>
                הוספת גמ&quot;ח
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b", mb: 2 }}>
                מלאו את פרטי הגמ&quot;ח והוסיפו רשימת מוצרים לפני השמירה.
            </Typography>
            {validationError && (
                <Alert
                    severity="warning"
                    sx={{ mb: 2 }}
                    role="alert"
                    onClose={() => setValidationError(null)}
                >
                    {validationError}
                </Alert>
            )}
            {clickAdd && status === 'succeeded' && (
                <Alert severity="success" sx={{ mb: 2 }} role="status">
                    הגמ״ח נשמר בהצלחה. מעבירים לאזור האישי…
                </Alert>
            )}
            {clickAdd && status === 'failed' && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    role="alert"
                    onClose={() => {
                        dispatch(setStatusToIdle());
                        setClickAdd(false);
                    }}
                >
                    {saveFailedMessage}
                </Alert>
            )}
            <TextField
                label="שם גמח"
                value={gmachName}
                onChange={(e) => setGmachName(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="כתובת"
                value={gmachAddrres}
                onChange={(e) => setGmachAddress(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="טלפון"
                value={gmachPhone}
                onChange={(e) => setGmachPhone(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="שעות הגמח"
                value={gmachTimes}
                onChange={(e) => setGmachTimes(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="מספר ימי השאלה"
                value={numDays}
                onChange={(e) => setNumDays(e.target.value)}
                fullWidth
                margin="normal"
            />
            <SelectGmachType type={gmachKindCode} setType={setGmachKindCode} />
            <TextField
                label="הערות"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                fullWidth
                margin="normal"
            />
            <FormControlLabel 
                control={<Checkbox onChange={(e) => setGmachPikadon(e.target.checked)} checked={gmachPikadon} />} 
                label="יש להביא צ'ק פיקדון" 
            />
            <AddDetails products={listProduct} setProducts={setProducts} />
            <Button
                variant="contained"
                color="primary"
                onClick={addGmach}
                disabled={status === 'loading' || (clickAdd && status === 'succeeded')}
                sx={{ mt: 2, borderRadius: "10px", fontWeight: 600, textTransform: "none", px: 3 }}
            >
                שמירת גמ&quot;ח
            </Button>
            </div>
        </main>
        </RtlMuiShell>
    );
};
