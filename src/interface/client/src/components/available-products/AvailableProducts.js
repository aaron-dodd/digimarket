import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import ProductListing from '../../components/product-listing/ProductListing';

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

export default function AvailableProducts() {
    const classes = useStyles();

    const products = async () => {
        await fetch("/api/products/", {
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token")
            },
        });
    };

    return (
        <Grid container className={classes.root} xs={12} spacing={2}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Typography variant="h4">
                        Available Products
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={4} md={12} lg={4}>
                <ProductListing />
            </Grid>
            <Grid item xs={12} sm={4} md={12} lg={4}>
                <ProductListing />
            </Grid>
            <Grid item xs={12} sm={4} md={12} lg={4}>
                <ProductListing />
            </Grid>
            <Grid item xs={12} sm={4} md={12} lg={4}>
                <ProductListing productTitle={"foobar"} productDetails={"sample"} />
            </Grid>
        </Grid>
    )
}