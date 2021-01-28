import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
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
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {props.productTitle}
                </Typography>
                <Typography paragraph>
                    {props.productDetails}
                </Typography>
            </CardContent>
            <CardActions>
                
            </CardActions>
        </Card>
    )
}