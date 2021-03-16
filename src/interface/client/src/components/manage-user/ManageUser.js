import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
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

export default function ManageUser() {
    const classes = useStyles();
    const [enableChangePassword, setEnableChangePassword] = React.useState(false);
    const [values, setValues] = React.useState({
        currentPassword: '',
        confirmPassword: '',
        newPassword: '',
        showCurrentPassword: false,
        showConfirmPassword: false,
        showNewPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowCurrentPassword = () => {
        setValues({ ...values, showCurrentPassword: !values.showCurrentPassword });
    };
    
    const handleMouseDownCurrentPassword = (event) => {
        event.preventDefault();
    };

    const handleClickShowConfirmPassword = () => {
        setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
    };
    
    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };

    const handleClickShowNewPassword = () => {
        setValues({ ...values, showNewPassword: !values.showNewPassword });
    };
    
    const handleMouseDownNewPassword = (event) => {
        event.preventDefault();
    };

    React.useEffect(() => {
        setEnableChangePassword(
            (values.currentPassword === values.confirmPassword) &&
            (values.currentPassword !== values.newPassword) &&
            (values.currentPassword.length > 0) &&
            (values.confirmPassword.length > 0) &&
            (values.newPassword.length > 0)
        );
    });

    const submitPasswordChange = async (event) => {
        event.preventDefault();
        await fetch("/api/user/update-password", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            })
        });
    }

    const deleteAccount = async (event) => {
        event.preventDefault();
        await fetch("/api/user/delete", {
            method: "DELETE",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token")
            },
        }).then((response) => {
            localStorage.removeItem("token");
        });
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Typography variant="h4" gutterBottom>Manage Account</Typography>
                <Typography variant="h5" gutterBottom>Change Password</Typography>
                <form onSubmit={submitPasswordChange}>
                    <TextField
                        normal fullWidth
                        className={classes.margin}
                        label="Current Password"
                        type={values.showCurrentPassword ? 'text' : 'password'}
                        autocomplete="current-password"
                        value={values.currentPassword}
                        onChange={handleChange('currentPassword')}
                        variant="outlined"
                        placeholder="current password"
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
                                        onClick={handleClickShowCurrentPassword}
                                        onMouseDown={handleMouseDownCurrentPassword}
                                    >
                                        {values.showCurrentPassword ? <Visibility /> : <VisibilityOff />}
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
                        autocomplete="confirm-password"
                        value={values.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        variant="outlined"
                        placeholder="confirm password"
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
                    <TextField
                        normal fullWidth
                        className={classes.margin}
                        label="New Password"
                        type={values.showNewPassword ? 'text' : 'password'}
                        autocomplete="new-password"
                        value={values.newPassword}
                        onChange={handleChange('newPassword')}
                        variant="outlined"
                        placeholder="new password"
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
                                        onClick={handleClickShowNewPassword}
                                        onMouseDown={handleMouseDownNewPassword}
                                    >
                                        {values.showNewPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Grid container justify="space-between">
                        <Button type="submit" variant="contained" color="primary" disabled={!enableChangePassword}>Update password</Button>
                        <span></span>
                    </Grid>
                </form>
                <Typography variant="h5" gutterBottom>Delete Account</Typography>
                <Grid container justify="space-between">
                    <Button variant="contained" color="secondary" onClick={deleteAccount}>Delete Account</Button>
                    <span></span>
                </Grid>
            </Paper>
        </div>
    )
}