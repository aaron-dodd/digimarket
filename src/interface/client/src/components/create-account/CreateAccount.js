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

export default function CreateAccount() {
    const classes = useStyles();
    const [enableNext, setEnableNext] = React.useState(false);
    const [values, setValues] = React.useState({
        username: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
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

    const handleClickShowConfirmPassword = () => {
        setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
    };
    
    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };

    React.useEffect(() => {
        setEnableNext(
            (values.username.length > 0) &&
            (values.password === values.confirmPassword) &&
            (values.password.length > 0) &&
            (values.confirmPassword.length > 0)
        );
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('/api/user/signup', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: values.username,
                password: values.password,
            }),
        });
    };

    return (
        <div className={classes.root}>
            <form autoComplete="off" onSubmit={onSubmit}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" gutterBottom>
                        Create Account
                    </Typography>
                    <TextField
                        normal fullWidth
                        className={classes.margin}
                        label="Username"
                        type="text"
                        value={values.username}
                        onChange={handleChange('username')}
                        variant="outlined"
                        placeholder="sample_username"
                        tabIndex="0"
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
                        value={values.password}
                        onChange={handleChange('password')}
                        variant="outlined"
                        placeholder="password"
                        tabIndex="1"
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
                        label="Confirm Password"
                        type={values.showConfirmPassword ? 'text' : 'password'}
                        autocomplete="new-password"
                        value={values.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        variant="outlined"
                        placeholder="password"
                        tabIndex="2"
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
                                        onClick={handleClickShowConfirmPassword}
                                        onMouseDown={handleMouseDownConfirmPassword}
                                    >
                                        {values.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Grid container justify="space-between">
                        <Link to="/login" component={RouteLink}>
                            <Button color="primary" tabIndex="3">Back</Button>
                        </Link>
                        <Button type="submit" variant="contained" color="primary" tabIndex="4" disabled={!enableNext}>Next</Button>
                    </Grid>
                </Paper>
            </form>
        </div>
    );
}