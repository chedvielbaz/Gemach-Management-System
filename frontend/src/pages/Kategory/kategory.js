import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllGmachKindsApi } from "../../redux/api/gmachimAPI";
import { updateTypeGmach } from "../../redux/slices/gmachim";
import { pathCategory } from "../../constants/routes";
import "./kategory.css";

/** מסיר רווחים מיותרים ותווי כיוון Unicode שמקלקלים התאמה */
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

/** שם הקטגוריה כפי שמגיע מה־API (camelCase או PascalCase) — לסינון ולתצוגה */
function categoryLabel(row) {
    if (!row || typeof row !== "object") return "";
    const raw = row.gmachTypes ?? row.GmachTypes;
    if (raw == null) return "";
    return typeof raw === "string" ? raw : String(raw);
}

/** כל מילה בקלט חייבת להופיע בשם הקטגוריה (חיפוש חלקי, למשל «תרופ» מתאים ל«תרופות») */
function categoryMatchesQuery(rawLabel, rawQuery) {
    const label = normalizeSearchText(rawLabel ?? "");
    const query = normalizeSearchText(rawQuery ?? "");
    if (!query) return true;
    if (!label) return false;
    const tokens = query.split(" ").filter(Boolean);
    if (tokens.length === 0) return true;
    return tokens.every((t) => label.includes(t));
}

export const Kategory = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const listCategries = useSelector((state) => state.gmachim.gmachimTypes);
    const kindsLoading = useSelector((state) => state.gmachim.gmachKindsLoading);
    const kindsFetched = useSelector((state) => state.gmachim.gmachKindsFetched);
    const kindsError = useSelector((state) => state.gmachim.gmachKindsError);

    const [filterQuery, setFilterQuery] = useState("");

    /** נטען מהשרת רק אם עדיין אין רשימה ולא סיימנו ניסיון טעינה — חוסך זמן בכניסות חוזרות */
    useLayoutEffect(() => {
        const cached =
            Array.isArray(listCategries) && listCategries.length > 0;
        if (cached || kindsFetched) return;
        dispatch(getAllGmachKindsApi());
    }, [dispatch, listCategries, kindsFetched]);

    const filteredCategories = useMemo(() => {
        const list = Array.isArray(listCategries) ? listCategries : [];
        const q = normalizeSearchText(filterQuery);
        if (!q) return list;
        return list.filter((k) => categoryMatchesQuery(categoryLabel(k), q));
    }, [listCategries, filterQuery]);

    const pathto = useCallback(
        (kategory) => {
            const code = kategory.gmachKindCode ?? kategory.GmachKindCode;
            dispatch(updateTypeGmach(kategory));
            navigate(pathCategory(code));
        },
        [dispatch, navigate]
    );

    const hasActiveFilter = normalizeSearchText(filterQuery).length > 0;

    const showKindsSpinner =
        !hasActiveFilter &&
        filteredCategories.length === 0 &&
        (!kindsFetched || kindsLoading);

    return (
        <main className="page-shell gmachkategory">
            <h1 className="page-heading category-intro">קטגוריות גמ&quot;חים</h1>

            {kindsFetched && kindsError ? (
                <Alert severity="error" sx={{ mb: 2 }} role="alert">
                    {kindsError}
                </Alert>
            ) : null}

            <section className="category-toolbar category-toolbar--compact" aria-label="סינון קטגוריות">
                <div className="category-search-row">
                    <label className="category-search-label" htmlFor="category-filter-input">
                        סינון קטגוריות
                    </label>
                    <TextField
                        id="category-filter-input"
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        placeholder="למשל: תרופות, תינוקות..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="none"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <span className="pi pi-search category-search-icon" aria-hidden />
                                </InputAdornment>
                            ),
                            endAdornment: filterQuery ? (
                                <InputAdornment position="end">
                                    <button
                                        type="button"
                                        className="category-filter-clear"
                                        onClick={() => setFilterQuery("")}
                                        aria-label="ניקוי הסינון"
                                    >
                                        ×
                                    </button>
                                </InputAdornment>
                            ) : undefined,
                        }}
                        inputProps={{
                            "aria-label": "סינון רשימת קטגוריות לפי שם",
                            dir: "rtl",
                            autoComplete: "off",
                        }}
                    />
                </div>
            </section>

            <h2 className="section-label">
                קטגוריות
                {hasActiveFilter && (
                    <span className="section-label-filter-hint"> — מוצגות רק הקטגוריות התואמות</span>
                )}
            </h2>
            <div className="category-cards-grid">
                {showKindsSpinner ? (
                    <div className="category-loading" role="status" aria-busy="true" aria-live="polite">
                        <CircularProgress size={36} thickness={4} sx={{ color: "#6366f1" }} />
                        <span className="category-loading-text">טוען קטגוריות…</span>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <p className="category-filter-empty" role="status">
                        {hasActiveFilter
                            ? "אין קטגוריה התואמת למה שהקלדת. נסו טקסט אחר או מחקו את השדה כדי לראות את כל הקטגוריות."
                            : "אין קטגוריות להצגה."}
                    </p>
                ) : (
                    filteredCategories.map((kategory) => (
                        <button
                            key={kategory.gmachKindCode ?? kategory.GmachKindCode}
                            type="button"
                            className="category-card"
                            onClick={() => pathto(kategory)}
                        >
                            <h3 className="category-card-title">{categoryLabel(kategory)}</h3>
                            <p className="category-card-hint">לצפייה ברשימת הגמ&quot;חים בקטגוריה זו</p>
                            <span className="category-card-cta">כניסה לקטגוריה ←</span>
                        </button>
                    ))
                )}
            </div>
        </main>
    );
};
