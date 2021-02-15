import React, { useState, useContext, useMemo } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, useTheme, } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListIcon from '@material-ui/icons/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

import AvailableProducts from './components/available-products/AvailableProducts';
import BlockchainStatus from './components/blockchain-status/BlockchainStatus';
import CreateAccount from './components/create-account/CreateAccount';
import Home from './components/home/Home';
import LicensedProducts from './components/licensed-products/LicensedProducts';
import Login from './components/login/Login';
import ManageFiles from './components/manage-files/ManageFiles';
import TransactionHistory from './components/transaction-history/TransactionHistory';
import VerifyFile from './components/verify-file/VerifyFile';

import { AuthContext } from './contexts/AuthContext';

import ProtectedRoute from './components/protected-route/ProtectedRoute';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    downloadWallet: {
        color: "#FFF",
        marginRight: theme.spacing(2),
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
}));

export default function App(props) {
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    const [userToken, setUserToken] = useState(localStorage.getItem("token"));
    const authContext = useMemo(() => ({
        login: (token) => {
            localStorage.setItem("token", token);
            setUserToken(token);
        },
        logout: () => {
            localStorage.removeItem("token");
            setUserToken(null);
        }
    }));

    const downloadWallet = async (event) => {
        event.preventDefault();
        fetch("/api/user/wallet/download", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token")
            },
            body: null,
        }).then(async (response) => {
            return response.blob();
        }).then(async (blob) => {
            let url = URL.createObjectURL(
                new Blob([blob]),
            );
            let anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "wallet.id"
            document.body.appendChild(anchor);
            anchor.click();
            anchor.parentNode.removeChild(anchor);
        });
    }

    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <div className={classes.toolbar} />
            <Divider />
            <List>
                {[
                    {icon: <HomeIcon />, text: 'Home', href: "/", protect: false },
                    {icon: <AccountCircleIcon />, text: 'Login', href: "/login", protect: false, login: true },
                    {icon: <VerifiedUserIcon />, text: 'Verify File', href: "/verify-file", protect: true },
                    {icon: <ListIcon />, text: 'View Available Products', href: "/available-products", protect: true },
                    {icon: <ListIcon />, text: 'Download Licensed Products', href: "/licensed-products", protect: true },
                    {icon: <ListIcon />, text: 'View Transaction History', href: "/transaction-history", protect: true },
                    {icon: <ListIcon />, text: 'View Blockchain Status', href: "/blockchain-status", protect: true },
                    {icon: <ListIcon />, text: 'Manage Files', href: "/manage-files", protect: true },
                ].map((pair) => {
                    if (pair.protect) {
                        if (userToken !== null) {
                            return (
                                <Link component={RouterLink} color="inherit" variant="body2" to={pair.href}>
                                    <ListItem button key={pair.text}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                {pair.icon}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={pair.text} />
                                    </ListItem>
                                </Link>
                            )
                        }
                    } else {
                        if (!pair.login || userToken === null) {
                            return (
                                <Link component={RouterLink} color="inherit" variant="body2" to={pair.href}>
                                    <ListItem button key={pair.text}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                {pair.icon}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={pair.text} />
                                    </ListItem>
                                </Link>
                            )
                        }
                    }
                })};
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <AuthContext.Provider value={authContext}>
        <div className={classes.root}>
            <Router>
                <AppBar className={classes.appBar}>
                    <Toolbar style={{justifyContent: "space-between"}}>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            Digi Market
                        </Typography>
                        { userToken !== null ?
                            <div>
                                <Button className={classes.downloadWallet} onClick={downloadWallet}>download wallet</Button>
                                <Button variant="contained" color="secondary" onClick={() => { authContext.logout() }}>Logout</Button>
                            </div> : <span></span>
                        }
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer} aria-label="mailbox folders">
                    <Hidden mdUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true,
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden smDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>

                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/create-account" authenticated={userToken === null} component={CreateAccount} />
                        <ProtectedRoute exact path="/login" authenticated={userToken === null} component={Login} />
                        <ProtectedRoute exact path="/available-products" authenticated={userToken !== null} component={AvailableProducts} />
                        <ProtectedRoute exact path="/blockchain-status" authenticated={userToken !== null} component={BlockchainStatus} />
                        <ProtectedRoute exact path="/licensed-products" authenticated={userToken !== null} component={LicensedProducts} />
                        <ProtectedRoute exact path="/manage-files" authenticated={userToken !== null} component={ManageFiles} />
                        <ProtectedRoute exact path="/transaction-history" authenticated={userToken !== null} component={TransactionHistory} />
                        <ProtectedRoute exact path="/verify-file" authenticated={userToken !== null} component={VerifyFile} />
                    </Switch>
                </main>
            </Router>
            </div>
        </AuthContext.Provider>
    );
}
