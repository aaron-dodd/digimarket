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
    const [values, setValues] = React.useState({
        email: '',
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

    const onSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('/api/user/create', {
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
                        label="Email"
                        type="email"
                        value={values.email}
                        onChange={handleChange('email')}
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
                        value={values.password}
                        onChange={handleChange('password')}
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
                    <TextField
                        normal fullWidth
                        className={classes.margin}
                        label="Confirm Password"
                        type={values.showConfirmPassword ? 'text' : 'password'}
                        autocomplete="new-password"
                        value={values.confirmPassword}
                        onChange={handleChange('confirmPassword')}
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
                            <Button color="primary">Back</Button>
                        </Link>
                        <Button type="submit" variant="contained" color="primary">Next</Button>
                    </Grid>
                </Paper>
            </form>
        </div>
    );
}