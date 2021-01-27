import React from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
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

export default function Login() {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        email: '',
        password: '',
        showPassword: false,
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
        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: values.email,
                password: values.password,
            }),
        });
    };

    const { email, password } = values;
    const enableNext = email.length > 0 && password.length > 0;

    return (
        <div className={classes.root}>
            <form autoComplete="off">
                <Paper className={classes.paper}>
                    <Typography variant="h4" gutterBottom>
                        Login
                    </Typography>
                    <TextField
                        normal fullWidth
                        className={classes.margin}
                        label="Email"
                        type="email"
                        onChange={handleChange('email')}
                        value={values.email}
                        variant="outlined"
                        placeholder="mail@example.com"
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
                    <Grid container justify="space-between">
                        <Link to="/create-account" component={RouteLink}>
                            <Button color="primary">Create account</Button>
                        </Link>
                        <Button variant="contained" color="primary" disabled={!enableNext}>Next</Button>
                    </Grid>
                </Paper>
            </form>
        </div>
    );
}