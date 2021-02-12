import React, { useContext, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import GetAppIcon from '@material-ui/icons/GetApp';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    margin: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));

export default function LicensedProducts() {
    const classes = useStyles();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [licenseDialogOpen, setLicenseDialogOpen] = useState(false);
    const [license, setLicense] = useState(null);
    const [products, setProducts] = useState([]);

    const handleLicenseClick = async (index) => {
        setSelectedProduct(index);
        await fetch("/api/product/license/get", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                productid: products[index].uuid,
            }),
        }).then(async (response) => {
            return response.json();
        }).then(async (data) => {
            setLicense(data);
            setLicenseDialogOpen(true);
        });
    }

    const handleDownloadClick = async (index) => {
        setSelectedProduct(index);
        await fetch("/api/product/download", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                productid: products[index].uuid,
            }),
        }).then(async (response) => {
            return response.blob();
        }).then(async (blob) => {
            console.log(blob);
            let url = window.URL.createObjectURL(
                new Blob([blob]),
            );
            let anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = products[index].filename;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.parentNode.removeChild(anchor);
        });
    }

    const fetchProducts = async () => {
        await fetch("/api/product/query/licensed", {
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token")
            },
        }).then(async (response) => {
            return response.json();
        }).then(async (data) => {
            setProducts(data);
        });
    }

    const handleDialogClose = () => {
        setLicenseDialogOpen(false);
    }
    useEffect(() => {
        fetchProducts();
    }, []);


    return (
        <Paper className={classes.paper}>
            <Grid container className={classes.root} xs={12} spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h4">
                        Licensed Products
                    </Typography>
                </Grid>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>File ID</TableCell>
                                <TableCell>File Name</TableCell>
                                <TableCell>File Hash</TableCell>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Version</TableCell>
                                <TableCell colSpan="1">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                products.map((product, index) => (
                                    <TableRow>
                                        <TableCell>{product.uuid}</TableCell>
                                        <TableCell>{product.filename}</TableCell>
                                        <TableCell>{product.filehash}</TableCell>
                                        <TableCell>{product.timestamp}</TableCell>
                                        <TableCell>{product.version}</TableCell>
                                        <TableCell>
                                            <ButtonGroup>
                                                <IconButton onClick={() => { handleLicenseClick(index); }}>
                                                    <SearchIcon />
                                                </IconButton>
                                                <IconButton onClick={() => { handleDownloadClick(index); }}>
                                                    <GetAppIcon />
                                                </IconButton>
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                { products !== [] && selectedProduct !== null && license !== null && (
                <Dialog open={licenseDialogOpen} onClose={handleDialogClose}>
                    <DialogContent>
                        <Typography variant="h5" gutterBottom>
                            License key for {products[selectedProduct].filename}
                        </Typography>
                        <TextField
                            normal fullWidth aria-readonly
                            id="text"
                            label="License Key"
                            type="text"
                            value={license.uuid}
                        />
                    </DialogContent>
                </Dialog>
            )}
            </Grid>
        </Paper>
    )
}