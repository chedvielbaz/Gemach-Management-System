import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const AddDetails = (props) => {
    const {products, setProducts} = props
    const [productName, setProductName] = useState("");
    const [productCount, setProductCount] = useState("");
    const [quantityError, setQuantityError] = useState(null);
   
    const addItem = () => {
        setQuantityError(null);
        const name = String(productName).trim();
        const countRaw = String(productCount).trim();
        if (!name || !countRaw) {
            return;
        }
        const cnt = Number.parseInt(countRaw, 10);
        if (!Number.isFinite(cnt) || cnt < 0) {
            setQuantityError("הכמות חייבת להיות מספר שלם (0 ומעלה).");
            return;
        }
        setProducts([...products, { productName: name, productCount: cnt }]);
        setProductName("");
        setProductCount("");
    };

    const updateRow = (index, field, rawValue) => {
        setProducts(
            products.map((p, i) => {
                if (i !== index) return p;
                if (field === "productName") {
                    return { ...p, productName: rawValue };
                }
                const v = String(rawValue).trim();
                if (v === "") {
                    return { ...p, productCount: "" };
                }
                const n = Number.parseInt(v, 10);
                if (!Number.isFinite(n) || n < 0) {
                    return p;
                }
                return { ...p, productCount: n };
            })
        );
    };

    const removeRow = (index) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    return (
        <div className="add-details-grid">
            {quantityError ? (
                <Alert
                    severity="warning"
                    sx={{ gridColumn: "1 / -1", mb: 1 }}
                    onClose={() => setQuantityError(null)}
                    role="alert"
                >
                    {quantityError}
                </Alert>
            ) : null}
            <div className="add-details-fields">
                <TextField label="שם פריט" value={productName} onChange={(e) => setProductName(e.target.value)} fullWidth />
                <TextField label="כמות" value={productCount} onChange={(e) => setProductCount(e.target.value)} fullWidth inputMode="numeric" />
                <Button variant="contained" color="primary" onClick={addItem}>
                    הוספת פריט לרשימה
                </Button>
            </div>
            <div className="table-scroll">
                <TableContainer component={Paper}>
                    <Table aria-label="רשימת פריטים לגמח">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">שם פריט</TableCell>
                                <TableCell align="right" sx={{ width: 120 }}>
                                    כמות
                                </TableCell>
                                <TableCell align="right" sx={{ width: 96 }}>
                                    פעולות
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((item, index) => (
                                <TableRow key={`product-row-${index}`}>
                                    <TableCell align="right" sx={{ py: 1 }}>
                                        <TextField
                                            value={item.productName ?? ""}
                                            onChange={(e) =>
                                                updateRow(index, "productName", e.target.value)
                                            }
                                            variant="standard"
                                            fullWidth
                                            size="small"
                                            margin="none"
                                            inputProps={{ dir: "rtl" }}
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 1 }}>
                                        <TextField
                                            value={
                                                item.productCount === "" ||
                                                item.productCount === undefined
                                                    ? ""
                                                    : String(item.productCount)
                                            }
                                            onChange={(e) =>
                                                updateRow(
                                                    index,
                                                    "productCount",
                                                    e.target.value
                                                )
                                            }
                                            variant="standard"
                                            fullWidth
                                            size="small"
                                            margin="none"
                                            inputMode="numeric"
                                            sx={{ maxWidth: 100 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 1 }}>
                                        <Button
                                            size="small"
                                            color="error"
                                            variant="text"
                                            onClick={() => removeRow(index)}
                                        >
                                            מחק
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};





