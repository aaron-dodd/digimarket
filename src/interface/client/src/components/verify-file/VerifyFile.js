import React, { useState } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Button from '@material-ui/core/Button';
import GavelIcon from '@material-ui/icons/Gavel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@material-ui/core/Link';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

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

export default function VerifyFile() {
    const classes = useStyles();
    const [license, setLicense] = useState("");
    const [validation, setValidation] = useState({});

    const onSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch("/api/license/verify", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
                licensekey: license,
            }),
        }).then(async (response) => {
            return response.json();
        }).then(async (result) => {
            console.log(result);
            setValidation(result);
        });
    };

    const changeLicense = (event) => {
        setLicense(event.target.value);
    }

    return (
        <div className={classes.root}>
            <form autoComplete="off" onSubmit={onSubmit}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" gutterBottom>
                        Verify File
                    </Typography>
                    <TextField
                        normal fullWidth
                        className={classes.margin}
                        label="License UUID"
                        type="text"
                        variant="outlined"
                        placeholder="00000000-0000-0000-0000-000000000000"
                        value={license}
                        onChange={changeLicense}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <GavelIcon />
                            </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        normal fullWidth
                        className={classes.margin}
                        label="File"
                        type="file"
                        variant="outlined"
                        placeholder="sample.file"
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <AttachFileIcon />
                            </InputAdornment>
                            ),
                        }}
                    />
                    <Grid container justify="space-between">
                        <span></span>
                        <Button type="submit" variant="contained" color="primary">Verify</Button>
                    </Grid>
                    { validation !== 'undefined' && (
                        <p>{validation.Reason}</p>
                    )}
                </Paper>
            </form>
        </div>
    );
}