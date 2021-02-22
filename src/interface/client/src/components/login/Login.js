import React, { useContext } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Button from '@material-ui/core/Button';
import EmailIcon from '@material-ui/icons/Email';
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

import { AuthContext } from '../../contexts/AuthContext';

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

export default function Login(props) {
    const {login} = useContext(AuthContext);
    const classes = useStyles();
    const [values, setValues] = React.useState({
        username: '',
        password: '',
        showPassword: false,
        walletFile: '',
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };
    
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(document.getElementById("loginForm"));
        const response = await fetch('/api/user/login', {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",
            },
            body: formData,
        }).then(async (response) => {
            return response.json();
        }).then(async (result) => {
            console.log(result);
            if (result.authenticated) {
                login("Bearer " + result.token);
            }
        });
    };

    const { username, password } = values;
    const { walletFile } = values;
    const enableNext = (username.length > 0 && password.length > 0) || (walletFile.length > 0);

    return (
        <div className={classes.root}>
            <form id="loginForm" autoComplete="off" onSubmit={onSubmit}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" gutterBottom>
                        Login
                    </Typography>
                    <TextField
                        normal fullWidth
                        className={classes.margin}
                        label="Username"
                        type="text"
                        onChange={handleChange('username')}
                        value={values.username}
                        variant="outlined"
                        placeholder="sample_username"
                        name="username"
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon />
                            </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        normal fullWidth
                        className={classes.margin}
                        label="Password"
                        type={values.showPassword ? 'text' : 'password'}
                        autocomplete="new-password"
                        onChange={handleChange('password')}
                        value={values.password}
                        variant="outlined"
                        placeholder="password"
                        name="password"
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <LockOpenIcon />
                            </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        normal fullWidth
                        className={classes.margin}
                        label="Wallet File"
                        type="file"
                        onChange={handleChange('walletFile')}
                        value={values.file}
                        variant="outlined"
                        placeholder="Wallet File"
                        name="walletFile"
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <AttachFileIcon />
                            </InputAdornment>
                            ),
                        }}
                    />
                    <Grid container justify="space-between">
                        <Link to="/create-account" component={RouteLink}>
                            <Button color="primary">Create account</Button>
                        </Link>
                        <Button type="submit" variant="contained" color="primary" disabled={!enableNext}>Next</Button>
                    </Grid>
                </Paper>
            </form>
        </div>
    );
}