import React from 'react';
import { withStyles, Paper, Grid, Box, Chip, Link, Typography, Card, CardActions, CardContent } from "@material-ui/core";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import DemandDashoardStyles from './DemandDashoardStyles';

const CardView = ({classes, individualReport, category, chartValue}) => {

    const viewDetails = (name, label) => {
        chartValue({
            name: `${label} ${name}`,
            label
        })
    }
    return (
        <div className="">
          <Grid container style={{ margin: 0 }}>
            {individualReport.map(item =>
              <Grid item xs={6} sm={3} key={item.label} style={{ padding: 10 }}>
                <Paper className={classes.paper}>
                  <Card className={classes.root} variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between">
                        <Typography> {item.label} {category.label} </Typography>
                        <Chip label={item.arrLen} color="primary" />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                            viewDetails(category.label, item.label)
                        }}
                      >View Details <ArrowForwardIosIcon style={{ position: "relative", bottom: 2, fontSize: 14 }} /></Link>
                    </CardActions>
                  </Card>
                </Paper>
              </Grid>)}
          </Grid>
        </div>
    )
}

export default React.memo(withStyles(DemandDashoardStyles, { withTheme: true })(CardView));
