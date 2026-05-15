import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useDispatch, useSelector } from "react-redux";
import { DeleteGmach, GetGmachesByKind, getAllGmachKindsApi } from "../redux/api/gmachimAPI";
import { updateGmachName } from "../redux/slices/productsGmach";
import { gf, kindLabel } from "../utils/gmachDto";
import { pathCategoryGmach } from "../constants/routes";
import "./Kategory/kategory.css";

function rowOwnerEmail(gmach) {
    const v = gmach?.custEmail ?? gmach?.CustEmail;
    return typeof v === "string" ? v.trim() : "";
}

/** ניקוי טקסט לחיפוש — תואם ללוגיקת סינון הקטגוריות */
function normalizeSearchText(s) {
    if (s == null || typeof s !== "string") return "";
    let t = s
        .replace(/[\u200e\u200f\u202a-\u202e]/g, "")
        .trim()
        .replace(/\s+/g, " ");
    try {
        t = t.normalize("NFC");
    } catch {
        /* ignore */
    }
    return t;
}

function rowAddressText(gmach) {
    const raw = gf(gmach, "gmachAddrres", "GmachAddrres");
    return typeof raw === "string" ? raw : String(raw ?? "");
}

/** כל מילה בקלט חייבת להופיע בכתובת (חיפוש חלקי) */
function addressMatchesAreaQuery(rawAddress, rawQuery) {
    const addr = normalizeSearchText(rawAddress ?? "");
    const query = normalizeSearchText(rawQuery ?? "");
    if (!query) return true;
    if (!addr) return false;
    const tokens = query.split(" ").filter(Boolean);
    if (tokens.length === 0) return true;
    return tokens.every((t) => addr.includes(t));
}

export const GmachBycategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const gmachList = useSelector((state) => state.gmachim.gmachimByCategory);
    const typeGmach = useSelector((state) => state.gmachim.typeGmach);
    const gmachimTypes = useSelector((state) => state.gmachim.gmachimTypes);
    const kindsFetched = useSelector((state) => state.gmachim.gmachKindsFetched);
    const listLoading = useSelector((state) => state.gmachim.gmachByCategoryLoading);
    const listError = useSelector((state) => state.gmachim.gmachByCategoryError);
    const currentUser = useSelector((state) => state.users.currentUser);

    const viewerEmail = (
        currentUser?.custEmail ??
        currentUser?.CustEmail ??
        ""
    ).trim();

    const showDeleteColumn = viewerEmail.length > 0;

    const rows = useMemo(
        () => (Array.isArray(gmachList) ? gmachList : []),
        [gmachList]
    );
    const [areaFilterQuery, setAreaFilterQuery] = useState("");
    const [deleteDeniedMessage, setDeleteDeniedMessage] = useState(null);

    useEffect(() => {
        setAreaFilterQuery("");
    }, [id]);

    const filteredRows = useMemo(() => {
        return rows.filter((g) =>
            addressMatchesAreaQuery(rowAddressText(g), areaFilterQuery)
        );
    }, [rows, areaFilterQuery]);

    /** אחרי רענון דף אין typeGmach ב־Redux — משחזרים כותרת לפי רשימת הסוגים וה־id מה־URL */
    const categoryHeading = useMemo(() => {
        if (typeGmach) {
            const t = typeGmach.gmachTypes ?? typeGmach.GmachTypes;
            if (t != null && String(t).trim() !== "") return String(t);
        }
        const kindCode = Number(id);
        if (!Number.isFinite(kindCode)) return id;
        const types = Array.isArray(gmachimTypes) ? gmachimTypes : [];
        const lbl = kindLabel(types, kindCode);
        if (lbl !== "—" && String(lbl).trim() !== "") return String(lbl);
        return id;
    }, [typeGmach, id, gmachimTypes]);

    useLayoutEffect(() => {
        const cached =
            Array.isArray(gmachimTypes) && gmachimTypes.length > 0;
        if (cached || kindsFetched) return;
        dispatch(getAllGmachKindsApi());
    }, [dispatch, gmachimTypes, kindsFetched]);

    useLayoutEffect(() => {
        if (id === undefined || id === null || String(id).trim() === "") return;
        dispatch(GetGmachesByKind(Number(id)));
    }, [dispatch, id]);

    const deleteGmach = async (gmach) => {
        const code = gmach.gmachCode ?? gmach.GmachCode;
        try {
            await dispatch(
                DeleteGmach({ id: code, custEmail: viewerEmail })
            ).unwrap();
            setDeleteDeniedMessage(null);
            dispatch(GetGmachesByKind(Number(id)));
        } catch {
            setDeleteDeniedMessage(
                "אין הרשאה למחוק גמ״ח זה — ניתן למחוק רק גמ״ח שהוספתם לאחר התחברות."
            );
        }
    };

    const seeMore = (gmach) => {
        const code = gmach.gmachCode ?? gmach.GmachCode;
        dispatch(updateGmachName(gf(gmach, "gmachName", "GmachName")));
        navigate(pathCategoryGmach(id, code));
    };

    const canDeleteRow = (gmach) => {
        if (!showDeleteColumn) return false;
        const owner = rowOwnerEmail(gmach);
        return (
            owner.length > 0 &&
            owner.toLowerCase() === viewerEmail.toLowerCase()
        );
    };

    return (
        <main className="page-shell">
            <h1 className="page-heading">
                גמ&quot;ח —{" "}
                {categoryHeading}
            </h1>
            {listError ? (
                <Alert severity="error" sx={{ mb: 2 }} role="alert">
                    {listError}
                    <div style={{ marginTop: 10, fontSize: "0.9rem", fontWeight: 400 }}>
                        ודאו שהשרת רץ (
                        <code dir="ltr">dotnet run</code>
                        ), ובחלון רשת הדפדפן (
                        <span dir="ltr">Network</span>
                        ) בדקו אם הבקשה ל־
                        <code dir="ltr"> GetGmachesByKind </code>
                        מצליחה. אם יש חוסם על HTTPS, הקוד כבר מנסה גם כתובת HTTP על פורט 5118.
                    </div>
                </Alert>
            ) : null}
            {deleteDeniedMessage ? (
                <Alert
                    severity="warning"
                    sx={{ mb: 2 }}
                    role="alert"
                    onClose={() => setDeleteDeniedMessage(null)}
                >
                    {deleteDeniedMessage}
                </Alert>
            ) : null}
            {!listLoading && rows.length > 0 ? (
                <section
                    className="category-toolbar category-toolbar--compact gmach-by-category-filter"
                    aria-label="סינון גמחים לפי אזור או כתובת"
                    style={{ marginBottom: 16, maxWidth: "min(100%, 720px)" }}
                >
                    <div className="category-search-row">
                        <label className="category-search-label" htmlFor="gmach-area-filter-input">
                            סינון לפי אזור
                        </label>
                        <TextField
                            id="gmach-area-filter-input"
                            value={areaFilterQuery}
                            onChange={(e) => setAreaFilterQuery(e.target.value)}
                            placeholder="עיר, שכונה או חלק מהכתובת…"
                            variant="outlined"
                            size="small"
                            fullWidth
                            margin="none"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <span className="pi pi-map-marker category-search-icon" aria-hidden />
                                    </InputAdornment>
                                ),
                                endAdornment: areaFilterQuery ? (
                                    <InputAdornment position="end">
                                        <button
                                            type="button"
                                            className="category-filter-clear"
                                            onClick={() => setAreaFilterQuery("")}
                                            aria-label="ניקוי סינון האזור"
                                        >
                                            ×
                                        </button>
                                    </InputAdornment>
                                ) : undefined,
                            }}
                            inputProps={{
                                "aria-label": "סינון רשימת גמחים לפי עיר שכונה או כתובת",
                                dir: "rtl",
                                autoComplete: "off",
                            }}
                        />
                    </div>
                </section>
            ) : null}
            <div className="table-section table-scroll">
                {listLoading ? (
                    <div
                        className="gmach-list-loading"
                        role="status"
                        aria-busy="true"
                        aria-live="polite"
                    >
                        <CircularProgress size={36} thickness={4} sx={{ color: "#6366f1" }} />
                        <span>טוען גמ״חים…</span>
                    </div>
                ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="טבלת גמחים לפי קטגוריה">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">שם הגמ&quot;ח</TableCell>
                                <TableCell align="right">כתובת</TableCell>
                                <TableCell align="right">פיקדון</TableCell>
                                <TableCell align="right">זמני הגמח</TableCell>
                                <TableCell align="right">טלפון </TableCell>
                                <TableCell align="right">קוד</TableCell>
                                <TableCell align="right">הערות</TableCell>
                                <TableCell align="right">מספר ימי השאלה </TableCell>
                                <TableCell align="right">מוצרים</TableCell>
                                {showDeleteColumn && (
                                    <TableCell align="right">מחיקת גמח</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={showDeleteColumn ? 10 : 9}
                                        align="center"
                                        sx={{
                                            py: 4,
                                            color: "#64748b",
                                            fontSize: "1rem",
                                        }}
                                    >
                                        לא נמצאו גמ״חים בקטגוריה זו.
                                    </TableCell>
                                </TableRow>
                            ) : filteredRows.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={showDeleteColumn ? 10 : 9}
                                        align="center"
                                        sx={{
                                            py: 4,
                                            color: "#64748b",
                                            fontSize: "1rem",
                                        }}
                                    >
                                        אין גמ״חים התואמים לסינון האזור. נסו טקסט אחר או נקו את השדה.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRows.map((gmach) => {
                                    const gc =
                                        gmach.gmachCode ?? gmach.GmachCode;
                                    const pik =
                                        gmach.gmachPikadon ??
                                        gmach.GmachPikadon;
                                    return (
                                    <TableRow
                                        key={gc}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                { border: 0 },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {gf(gmach, "gmachName", "GmachName")}
                                        </TableCell>
                                        <TableCell align="right">
                                            {gf(
                                                gmach,
                                                "gmachAddrres",
                                                "GmachAddrres"
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {pik === true ? "✔" : "❌"}
                                        </TableCell>
                                        <TableCell align="right">
                                            {gf(
                                                gmach,
                                                "gmachTimes",
                                                "GmachTimes"
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {gf(
                                                gmach,
                                                "gmachPhone",
                                                "GmachPhone"
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {categoryHeading}
                                        </TableCell>
                                        <TableCell align="right">
                                            {gf(gmach, "comments", "Comments")}
                                        </TableCell>
                                        <TableCell align="right">
                                            {gf(gmach, "numDays", "NumDays")}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="outlined"
                                                onClick={() =>
                                                    seeMore(gmach)
                                                }
                                            >
                                                מוצרי הגמ&quot;ח
                                            </Button>
                                        </TableCell>
                                        {showDeleteColumn && (
                                            <TableCell align="right">
                                                {canDeleteRow(gmach) ? (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() =>
                                                            deleteGmach(
                                                                gmach
                                                            )
                                                        }
                                                        aria-label={`מחיקת גמ״ח ${gf(gmach, "gmachName", "GmachName")}`}
                                                    >
                                                        🗑
                                                    </Button>
                                                ) : (
                                                    <span
                                                        style={{
                                                            color: "#94a3b8",
                                                        }}
                                                        aria-hidden
                                                    >
                                                        —
                                                    </span>
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                )}
            </div>
        </main>
    );
};
