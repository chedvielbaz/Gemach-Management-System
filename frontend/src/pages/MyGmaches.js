import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { logout } from '../redux/slices/users';
import { updateGmachName } from '../redux/slices/productsGmach';
import {
    DeleteGmach,
    getAllGmachKindsApi,
    getMyGmachesApi,
    updateGmachApi,
} from '../redux/api/gmachimAPI';
import {
    GetProductsByGmachCode,
    replaceProductsForGmach,
} from '../redux/api/productsGmachAPI';
import { SelectGmachType } from '../components/selectGmachType';
import { AddDetails } from '../components/addDetails';
import { gf, kindLabel } from '../utils/gmachDto';
import { ROUTES, pathCategoryGmach } from '../constants/routes';
import { useOwnerEmail } from '../hooks/useOwnerEmail';

export function MyGmaches() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const ownerEmail = useOwnerEmail();
    const gmachimTypes = useSelector((state) => state.gmachim.gmachimTypes);
    const kindsFetched = useSelector((state) => state.gmachim.gmachKindsFetched);
    const myList = useSelector((state) => state.gmachim.myGmachesList);
    const listLoading = useSelector((state) => state.gmachim.myGmachesLoading);
    const listError = useSelector((state) => state.gmachim.myGmachesError);

    const [editOpen, setEditOpen] = useState(false);
    const [editSaving, setEditSaving] = useState(false);
    const [editCode, setEditCode] = useState(null);

    const [gmachName, setGmachName] = useState('');
    const [gmachAddrres, setGmachAddrres] = useState('');
    const [gmachPhone, setGmachPhone] = useState('');
    const [gmachTimes, setGmachTimes] = useState('');
    const [numDays, setNumDays] = useState('');
    const [gmachKindCode, setGmachKindCode] = useState('');
    const [comments, setComments] = useState('');
    const [gmachPikadon, setGmachPikadon] = useState(false);
    const [editProducts, setEditProducts] = useState([]);
    const [editProductsLoading, setEditProductsLoading] = useState(false);
    const [editFormError, setEditFormError] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [deleteBusy, setDeleteBusy] = useState(false);
    const [deleteDialogError, setDeleteDialogError] = useState(null);

    const reloadMine = useCallback(() => {
        if (ownerEmail) dispatch(getMyGmachesApi(ownerEmail));
    }, [dispatch, ownerEmail]);

    useEffect(() => {
        if (!ownerEmail) {
            navigate(ROUTES.LOGIN);
            return;
        }
        reloadMine();
    }, [navigate, ownerEmail, reloadMine]);

    useEffect(() => {
        if (!ownerEmail) return;
        const hasTypes = Array.isArray(gmachimTypes) && gmachimTypes.length > 0;
        if (!hasTypes && !kindsFetched) {
            dispatch(getAllGmachKindsApi());
        }
    }, [dispatch, ownerEmail, kindsFetched, gmachimTypes]);

    const addanothergmach = () => {
        navigate(ROUTES.ADD_GMACH);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate(ROUTES.HOME);
    };

    const openEdit = async (g) => {
        const code = g.gmachCode ?? g.GmachCode;
        setEditCode(code);
        setGmachName(String(gf(g, 'gmachName', 'GmachName')));
        setGmachAddrres(String(gf(g, 'gmachAddrres', 'GmachAddrres')));
        const phone = g.gmachPhone ?? g.GmachPhone;
        setGmachPhone(phone != null ? String(phone) : '');
        setGmachTimes(String(gf(g, 'gmachTimes', 'GmachTimes')));
        const nd = g.numDays ?? g.NumDays;
        setNumDays(nd != null ? String(nd) : '');
        const k = g.gmachKindCode ?? g.GmachKindCode;
        setGmachKindCode(k != null ? String(k) : '');
        setComments(String(gf(g, 'comments', 'Comments')));
        const pik = g.gmachPikadon ?? g.GmachPikadon;
        setGmachPikadon(pik === true);
        setEditFormError(null);
        setEditProducts([]);
        setEditOpen(true);
        setEditProductsLoading(true);
        try {
            const data = await dispatch(GetProductsByGmachCode(code)).unwrap();
            const raw = Array.isArray(data) ? data : [];
            setEditProducts(
                raw.map((p) => ({
                    productName: String(p.productName ?? p.ProductName ?? '').trim(),
                    productCount: Number(p.productCount ?? p.ProductCount ?? 0),
                })).filter((p) => p.productName.length > 0)
            );
        } catch {
            setEditProducts([]);
        } finally {
            setEditProductsLoading(false);
        }
    };

    const closeEdit = () => {
        setEditOpen(false);
        setEditCode(null);
        setEditProducts([]);
        setEditFormError(null);
    };

    const saveEdit = async () => {
        setEditFormError(null);
        const kind = Number.parseInt(String(gmachKindCode).trim(), 10);
        if (!Number.isFinite(kind)) {
            setEditFormError('נא לבחור סוג גמ״ח מהרשימה.');
            return;
        }
        const nameTrim = String(gmachName).trim();
        const addrTrim = String(gmachAddrres).trim();
        const timesTrim = String(gmachTimes).trim();
        if (!nameTrim || !addrTrim || !timesTrim) {
            setEditFormError('נא למלא שם גמ״ח, כתובת ושעות פעילות.');
            return;
        }
        const phoneDigits = String(gmachPhone).replace(/\D/g, '');
        let gmachPhoneVal = null;
        if (phoneDigits.length > 0) {
            gmachPhoneVal = Number.parseInt(phoneDigits, 10);
            if (!Number.isFinite(gmachPhoneVal)) {
                setEditFormError('מספר טלפון לא תקין.');
                return;
            }
        }
        const daysRaw = String(numDays).trim();
        let numDaysVal = null;
        if (daysRaw !== '') {
            numDaysVal = Number.parseInt(daysRaw, 10);
            if (!Number.isFinite(numDaysVal) || numDaysVal < 0) {
                setEditFormError('מספר ימי השאלה חייב להיות מספר שלם חיובי.');
                return;
            }
        }

        const normalizedProducts = [];
        for (let i = 0; i < editProducts.length; i += 1) {
            const p = editProducts[i];
            const pname = String(p.productName ?? '').trim();
            const cnt = Number(p.productCount);
            if (!pname) {
                setEditFormError('יש פריט ברשימה בלי שם — תקנו או מחקו אותו.');
                return;
            }
            if (!Number.isFinite(cnt) || cnt < 0 || !Number.isInteger(cnt)) {
                setEditFormError(
                    `כמות המלאי חייבת להיות מספר שלם חיובי (פריט: "${pname}").`
                );
                return;
            }
            normalizedProducts.push({ productName: pname, productCount: cnt });
        }

        const gmach = {
            gmachCode: editCode,
            gmachName: nameTrim,
            gmachAddrres: addrTrim,
            gmachPikadon: Boolean(gmachPikadon),
            gmachTimes: timesTrim,
            gmachPhone: gmachPhoneVal,
            gmachKindCode: kind,
            comments: String(comments ?? '').trim() || null,
            numDays: numDaysVal,
            custEmail: ownerEmail,
        };

        setEditSaving(true);
        try {
            await dispatch(updateGmachApi({ gmach, custEmail: ownerEmail })).unwrap();
            await replaceProductsForGmach(editCode, normalizedProducts);
            closeEdit();
            reloadMine();
        } catch (err) {
            const msg =
                err && typeof err.message === 'string'
                    ? err.message
                    : 'עדכון הגמ״ח או המוצרים נכשל.';
            setEditFormError(msg);
        } finally {
            setEditSaving(false);
        }
    };

    const openDeleteDialog = (g) => {
        setDeleteDialogError(null);
        setPendingDelete(g);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        if (deleteBusy) return;
        setDeleteDialogOpen(false);
        setPendingDelete(null);
        setDeleteDialogError(null);
    };

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        const code = pendingDelete.gmachCode ?? pendingDelete.GmachCode;
        setDeleteBusy(true);
        setDeleteDialogError(null);
        try {
            await dispatch(
                DeleteGmach({ id: code, custEmail: ownerEmail })
            ).unwrap();
            closeDeleteDialog();
            reloadMine();
        } catch {
            setDeleteDialogError(
                'לא ניתן למחוק את הגמ״ח — ודאו שאתם הבעלים הרשומים.'
            );
        } finally {
            setDeleteBusy(false);
        }
    };

    const seeProducts = (g) => {
        const code = g.gmachCode ?? g.GmachCode;
        const kind = g.gmachKindCode ?? g.GmachKindCode;
        dispatch(updateGmachName(gf(g, 'gmachName', 'GmachName')));
        navigate(pathCategoryGmach(kind, code));
    };

    const rows = Array.isArray(myList) ? myList : [];

    return (
        <main className="page-shell">
            <div className="surface-card">
                <h1 className="page-heading">האזור האישי שלי</h1>
                <p className="page-lead">כאן מנהלים את הגמ״חים שלכם.</p>
                <div className="personal-area-actions">
                    <button
                        type="button"
                        className="btn-page-primary"
                        onClick={addanothergmach}
                    >
                        להוספת גמ&quot;ח
                    </button>
                    <button
                        type="button"
                        className="btn-page-secondary"
                        onClick={handleLogout}
                    >
                        התנתקות מהאזור האישי
                    </button>
                </div>

                <Typography
                    variant="h6"
                    component="h2"
                    sx={{ mt: 4, mb: 1.5, fontWeight: 700, color: '#0f172a' }}
                >
                    הגמ״חים שלך
                </Typography>

                {listError ? (
                    <Alert severity="error" sx={{ mb: 2 }} role="alert">
                        {listError}
                    </Alert>
                ) : null}

                {listLoading ? (
                    <div
                        className="gmach-list-loading"
                        role="status"
                        aria-busy="true"
                        aria-live="polite"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '24px 0',
                        }}
                    >
                        <CircularProgress size={32} sx={{ color: '#6366f1' }} />
                        <span>טוען את הגמ״חים שלך…</span>
                    </div>
                ) : (
                    <div className="table-section table-scroll">
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="טבלת הגמחים שלי">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">שם</TableCell>
                                        <TableCell align="right">כתובת</TableCell>
                                        <TableCell align="right">קטגוריה</TableCell>
                                        <TableCell align="right">טלפון</TableCell>
                                        <TableCell align="right">פעולות</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#64748b' }}>
                                                עדיין לא פרסמת גמ״ח מהחשבון הזה. לחצו
                                                &quot;להוספת גמ״ח&quot; למעלה.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        rows.map((g) => {
                                            const code =
                                                g.gmachCode ?? g.GmachCode;
                                            const kind =
                                                g.gmachKindCode ??
                                                g.GmachKindCode;
                                            return (
                                                <TableRow key={code}>
                                                    <TableCell align="right">
                                                        {gf(
                                                            g,
                                                            'gmachName',
                                                            'GmachName'
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {gf(
                                                            g,
                                                            'gmachAddrres',
                                                            'GmachAddrres'
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {kindLabel(
                                                            gmachimTypes,
                                                            kind
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {gf(
                                                            g,
                                                            'gmachPhone',
                                                            'GmachPhone'
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() =>
                                                                openEdit(g)
                                                            }
                                                            sx={{ ml: 1 }}
                                                        >
                                                            עריכה
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() =>
                                                                seeProducts(g)
                                                            }
                                                            sx={{ ml: 1 }}
                                                        >
                                                            מוצרים
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="error"
                                                            onClick={() =>
                                                                openDeleteDialog(g)
                                                            }
                                                        >
                                                            מחיקה
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                )}
            </div>

            <Dialog
                open={editOpen}
                onClose={editSaving ? undefined : closeEdit}
                fullWidth
                maxWidth="md"
                aria-labelledby="edit-gmach-title"
            >
                <DialogTitle id="edit-gmach-title">עריכת גמ״ח</DialogTitle>
                <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {editFormError ? (
                        <Alert severity="error" onClose={() => setEditFormError(null)}>
                            {editFormError}
                        </Alert>
                    ) : null}
                    {editProductsLoading ? (
                        <Typography variant="body2" color="text.secondary">
                            טוען רשימת מוצרים…
                        </Typography>
                    ) : null}
                    <TextField
                        label="שם גמח"
                        value={gmachName}
                        onChange={(e) => setGmachName(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="כתובת"
                        value={gmachAddrres}
                        onChange={(e) => setGmachAddrres(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="טלפון"
                        value={gmachPhone}
                        onChange={(e) => setGmachPhone(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="שעות הגמח"
                        value={gmachTimes}
                        onChange={(e) => setGmachTimes(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="מספר ימי השאלה"
                        value={numDays}
                        onChange={(e) => setNumDays(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <SelectGmachType type={gmachKindCode} setType={setGmachKindCode} />
                    <TextField
                        label="הערות"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={gmachPikadon}
                                onChange={(e) =>
                                    setGmachPikadon(e.target.checked)
                                }
                            />
                        }
                        label={`יש להביא צ'ק פיקדון`}
                    />
                    <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 700 }}>
                        מוצרים בגמ״ח
                    </Typography>
                    <AddDetails products={editProducts} setProducts={setEditProducts} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeEdit} disabled={editSaving}>
                        ביטול
                    </Button>
                    <Button
                        variant="contained"
                        onClick={saveEdit}
                        disabled={editSaving}
                    >
                        {editSaving ? 'שומר…' : 'שמירה'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteDialogOpen}
                onClose={deleteBusy ? undefined : closeDeleteDialog}
                aria-labelledby="delete-gmach-title"
            >
                <DialogTitle id="delete-gmach-title">מחיקת גמ״ח</DialogTitle>
                <DialogContent>
                    {deleteDialogError ? (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {deleteDialogError}
                        </Alert>
                    ) : null}
                    <Typography variant="body1">
                        האם אתם בטוחים שברצונכם למחוק את הגמ״ח הזה?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeDeleteDialog} disabled={deleteBusy}>
                        ביטול
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={confirmDelete}
                        disabled={deleteBusy}
                    >
                        {deleteBusy ? 'מוחק…' : 'מחיקה'}
                    </Button>
                </DialogActions>
            </Dialog>
        </main>
    );
}
