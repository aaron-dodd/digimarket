import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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

export default function ProductListing(props) {
    const handleOrderClick = async (event) => {
        event.preventDefault();
        await fetch("/api/product/license/add", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
                productid: props.productId,
                producthash: props.productHash,
                productversion: props.productVersion,
            }),
        }).then(async (response) => {
            return response.json();
        }).then(async (data) => {
            // do stuff with data
        });
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {props.productTitle}
                </Typography>
                <Typography paragraph>
                    hash: {props.productHash}
                </Typography>
                <Typography paragraph>
                    Version: {props.productVersion}
                </Typography>
            </CardContent>
            <CardActions>
                <Grid container justify="space-between">
                    <span></span>
                    <Button variant="contained" color="primary" onClick={handleOrderClick}>
                        Order
                    </Button>
                </Grid>
            </CardActions>
        </Card>
    )
}