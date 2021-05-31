import * as React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia, CircularProgress,
  Container,
  Fab,
  Grid, Skeleton,
  Theme,
  Typography,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles"
import AddIcon from '@material-ui/icons/Add'
import {useEffect, useRef, useState} from "react"
import {Link} from "react-router-dom"
import CreateChallengeDialog from "./CreateChallengeDialog"
import useChallenges from "../../../../api/useChallenges"
import {useRouter} from "../../../../hooks/useRouter"
import NoImageFoundImage from "../../../../images/no-image-found-image.png"
import ChallengeCard from "./ChallengeCard";
import useChallengesInfinite from "../../../../api/useChallengesInfinite";
import useIntersectionObserver from "../../../../hooks/useIntersectionObserver";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    maxWidth: 345,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  media: {
    height: 140,
  },
  fab: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      bottom: theme.spacing(9),
    }
  },
  loading: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const ChallengeList = () => {
  const classes = useStyles();

  const [tabValue, setTabValue] = useState(0)
  const handleChangeTab = (e: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const [openDialogCreate, setOpenDialogCreate] = useState(false);
  const queryChallenges = useChallengesInfinite({size: 3,})

  const loadMoreButtonRef = useRef<HTMLButtonElement>(null)

  const entry = useIntersectionObserver(loadMoreButtonRef, {})
  useEffect(() => {
    if (!!entry?.isIntersecting && queryChallenges.hasNextPage) {
      queryChallenges.fetchNextPage()
    }
  })

  return (
    <Box sx={{padding: theme => theme.spacing(3),}}>
      <Grid container spacing={5} justifyContent="center">
        {queryChallenges.isLoading ? (
          <div className={classes.loading}>
            <CircularProgress size="large"/>
          </div>
        ) : queryChallenges.isError ? (
          <p>Il y a eu une erreur...</p>
        ) : (
          <>
            {queryChallenges.data?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.data.map(challenge => (
                  <Grid key={challenge.id} item>
                    <ChallengeCard challenge={challenge}/>
                  </Grid>
                ))}
              </React.Fragment>
            ))}
          </>
        )}
      </Grid>
      <Box sx={{mt: 4, display: 'flex', justifyContent: 'center',}}>
      <Button
        ref={loadMoreButtonRef}
        variant="contained"
        onClick={() => queryChallenges.fetchNextPage()}
        disabled={!queryChallenges.hasNextPage || queryChallenges.isFetchingNextPage}
      >
        Cliquer ici pour charger la suite...
      </Button>
      <Fab color="primary" aria-label="Ajouter" className={classes.fab} onClick={() => setOpenDialogCreate(true)}>
        <AddIcon/>
      </Fab>
      <CreateChallengeDialog open={openDialogCreate} setOpen={setOpenDialogCreate}/>
      </Box>
    </Box>
  )

  // return (
  //   <Box sx={{padding: theme => theme.spacing(3),}}>
  //     <Grid container spacing={5} justifyContent="center">
  //       {
  //         queryChallenges.isLoading && (
  //           <div className={classes.loading}>
  //             <CircularProgress size="large"/>
  //           </div>
  //         )
  //       }
  //       {queryChallenges.isSuccess &&
  //       (queryChallenges.data.page.totalElements === 0
  //         ? <p>Il n'y a aucun challenge à afficher.</p>
  //         : queryChallenges.data.data.map(challenge => {
  //           return (
  //             <Grid key={challenge.id} item>
  //               <ChallengeCard challenge={challenge}/>
  //             </Grid>
  //           )
  //         }))
  //       }
  //       {queryChallenges.isError && <p>Il y a eu une erreur...</p>}
  //     </Grid>
  //     <Fab color="primary" aria-label="Ajouter" className={classes.fab} onClick={() => setOpenDialogCreate(true)}>
  //       <AddIcon/>
  //     </Fab>
  //     <CreateChallengeDialog open={openDialogCreate} setOpen={setOpenDialogCreate}/>
  //   </Box>
  // )
}

export default ChallengeList