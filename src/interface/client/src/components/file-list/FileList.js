import React, { useContext, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import GavelIcon from '@material-ui/icons/Gavel';
import GetAppIcon from '@material-ui/icons/GetApp';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
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

function LicenseDialog(props) {
    return (
        <Dialog>
            <DialogContent>
                <DialogTitle>Example</DialogTitle>
            </DialogContent>
            <DialogActions>
                <Button>Cancel</Button>
                <Button>Update</Button>
            </DialogActions>
        </Dialog>
    )
}

export default function FileList() {
    const classes = useStyles();
    const [files, setFiles] = useState([]);
    const [licenseDialogOpen, setLicenseDialogOpen] = React.useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleLicenseClick = (index) => {
        setSelectedFile(index);
        setLicenseDialogOpen(true);
    };

    const handleDownloadClick = async (index) => {
        setSelectedFile(index);
        await fetch("/api/product/download", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                productid: files[index].uuid,
            }),
        }).then(async (response) => {
            return await response.blob();
        }).then(async (blob) => {
            console.log(blob);
            let url = window.URL.createObjectURL(
                new Blob([blob]),
            );
            let anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = files[index].filename;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.parentNode.removeChild(anchor);
        });
    }

    const handleDialogClose = () => {
        setLicenseDialogOpen(false);
    }

    const fetchFiles = async () => {
        await fetch("/api/product/query/user", {
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
            setFiles(data);
        });
    }

    const addLicense = async () => {
        await fetch("/api/product/license/add", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                username: "username",
                password: "password",
            }),
        }).then(async (response) => {
            if (response) {
                return response.json();
            }
            return null;
        }).then(async (data) => {
            setLicenseDialogOpen(false);
        }).catch((error) => {
            setLicenseDialogOpen(false);
        });
    }

    useEffect(() => {
        fetchFiles();
    }, []);


    return (
        <Grid container className={classes.root} xs={12} spacing={2}>
            <Typography variant="h4" gutterBottom className={classes.paper}>
                File List
            </Typography>
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
                            files.map((file, index) => (
                            <TableRow>
                                <TableCell>{file.uuid}</TableCell>
                                <TableCell>{file.filename}</TableCell>
                                <TableCell>{file.filehash}</TableCell>
                                <TableCell>{file.timestamp}</TableCell>
                                <TableCell>{file.version}</TableCell>
                                <TableCell>
                                    <ButtonGroup>
                                        <IconButton onClick={() => {handleLicenseClick(index); }}>
                                            <GavelIcon />
                                        </IconButton>
                                        <IconButton onClick={() => {handleDownloadClick(index); }}>
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
            { files !== 'undefined' && selectedFile !== null && (
                <Dialog open={licenseDialogOpen} onClose={handleDialogClose}>
                    <DialogContent>
                        <Typography variant="h5" gutterBottom>
                            Add license to {files[selectedFile].filename}
                        </Typography>
                        <TextField
                            normal fullWidth
                            id="date"
                            label="Expiration Date"
                            type="date"
                            defaultValue="2020-01-01"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={addLicense}>
                            Add License
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Grid>
    )
}