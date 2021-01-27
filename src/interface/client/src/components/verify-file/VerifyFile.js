import React from 'react';
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

    return (
        <div className={classes.root}>
            <form autoComplete="off">
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
                        <Button variant="contained" color="primary">Verify</Button>
                    </Grid>
                </Paper>
            </form>
        </div>
    );
}