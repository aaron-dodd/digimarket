import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import AttachFileIcon from '@material-ui/icons/AttachFile';
import Button from '@material-ui/core/Button';
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

export default function FileUpload() {
    const classes = useStyles();
    const [enableUpload, setEnableUpload] = useState(true);
    const [values, setValues] = useState({
        productName: '',
        file: '',
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const onSubmit = async (event) => {
    };

    return (
        <div className={classes.root}>
            <Typography variant="h4" gutterBottom>
                Upload File
            </Typography>
            <form onSubmit={onSubmit}>
                <TextField
                    normal fullWidth
                    className={classes.margin}
                    label="Product Name"
                    type="text"
                    onChange={handleChange('productName')}
                    value={values.username}
                    variant="outlined"
                    placeholder="Product Name"
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <AttachFileIcon />
                        </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    normal fullWidth
                    className={classes.margin}
                    label="File"
                    type="file"
                    onChange={handleChange('file')}
                    value={values.username}
                    variant="outlined"
                    placeholder="File"
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
                    <Button type="submit" variant="contained" color="primary" disabled={!enableUpload}>Upload</Button>
                </Grid>
            </form>
        </div>
    )
}