import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import FileList from '../file-list/FileList';
import FileUpload from '../file-upload/FileUpload';

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

export default function ManageFiles() {
    const classes = useStyles();
    const [reload, setReload] = React.useState(false);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                    <FileUpload setReload={setReload} />
                    <br></br>
                    <FileList reload={reload} setReload={setReload} />
            </Paper>
        </div>
    )
}