import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { GetProductsByGmachCode } from "../redux/api/productsGmachAPI";

export const GmachDetails = () => {
    const { itemId } = useParams();
    const dispatch = useDispatch();
    const details = useSelector((state) => state.productsGmach.productsByCodeGmach);
    const gmachName = useSelector((state) => state.productsGmach.gmachName);
    const status = useSelector((state) => state.productsGmach.status);
    const loadError = useSelector((state) => state.productsGmach.error);

    useEffect(() => {
        dispatch(GetProductsByGmachCode(itemId));
    }, [dispatch, itemId]);

    const rows = Array.isArray(details) ? details : [];
    const pending = status === "idle" || status === "loading";
    const failed = status === "failed";

    return (
        <main className="page-shell">
            <h1 className="page-heading">
                מוצרי גמ&quot;ח {gmachName ? gmachName : itemId}
            </h1>
            {failed && loadError ? (
                <Alert severity="error" sx={{ mb: 2 }} role="alert">
                    {typeof loadError === "string" ? loadError : String(loadError ?? "")}
                </Alert>
            ) : null}
            {pending ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
                    <CircularProgress aria-label="טוען מוצרים" />
                </div>
            ) : !failed && rows.length === 0 ? (
                <p className="category-filter-empty" role="status">
                    אין מוצרים להצגה עבור גמ״ח זה.
                </p>
            ) : !failed ? (
                <div className="table-section table-scroll">
                    <TableContainer component={Paper}>
                        <Table aria-label="טבלת מוצרים לפי גמח">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">פריט</TableCell>
                                    <TableCell align="right">כמות</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((detail, index) => (
                                    <TableRow key={`product-${index}`}>
                                        <TableCell align="right">{detail.productName}</TableCell>
                                        <TableCell align="right">{detail.productCount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            ) : null}
        </main>
    );
};
