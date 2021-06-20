import * as React from 'react';
import {
  Box,
  Button,
  Fab,
  Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow,
  Theme,
  Typography,
} from "@material-ui/core";
import TablePagination from '@material-ui/core/TablePagination';
import {makeStyles} from "@material-ui/core/styles"
import AddIcon from '@material-ui/icons/Add'
import {useState} from "react"
import {Link, NavLink} from "react-router-dom"
import CreateChallengeDialog from "../../components/CreateChallengeDialog"
import useChallenges from "../../../../api/hooks/challenges/useChallenges"
import {Challenge} from "../../../../api/entities/Challenge";
import useUser from "../../../../api/hooks/user/useUser";

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
  middle: {
    height: `calc(100vh - 112px)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const ChallengeList = () => {
  const classes = useStyles();

  const [openDialogCreate, setOpenDialogCreate] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [page, setPage] = useState(0)

  const challenges = useChallenges({page: page, size: rowsPerPage, adminOnly: true,}, {
    keepPreviousData: true,
  })

  return (
    <Box sx={{padding: theme => theme.spacing(3),}}>
      <Typography variant="body1">
        Retrouvez ici la liste de vos challenges en cours de création.
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom du challenge</TableCell>
              <TableCell>Créateur</TableCell>
              <TableCell>Échelle (en m)</TableCell>
              <TableCell>Nombre de checkpoints</TableCell>
              <TableCell>Nombre de segments</TableCell>
              <TableCell>Publié</TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {challenges.isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>Chargement...</TableCell>
              </TableRow>
            ) : challenges.isError ? (
              <TableRow>
                <TableCell colSpan={6}>Erreur lors du chargement...</TableCell>
              </TableRow>
            ) : challenges.isSuccess && (
              challenges.data.page.totalElements > 0 ? (
                challenges.data.data.map(challenge => (
                  <ChallengeRow key={challenge.id} challenge={challenge}/>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>Vous n'avez créé aucun challenge</TableCell>
                </TableRow>
              )

            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              {challenges.isSuccess && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20]}
                  colSpan={6}
                  count={challenges.data.page.totalElements}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={e => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0)
                  }}
                />
              )}
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Fab color="primary" aria-label="Ajouter" className={classes.fab} onClick={() => setOpenDialogCreate(true)}>
        <AddIcon/>
      </Fab>
      <CreateChallengeDialog open={openDialogCreate} setOpen={setOpenDialogCreate}/>
    </Box>
  )
}

export default ChallengeList

interface ChallengeProps {
  challenge: Challenge
}

function ChallengeRow(props: ChallengeProps) {
  const {
    challenge
  } = props

  const user = useUser(challenge.attributes.creatorId)

  return (
    <TableRow>
      <TableCell>{challenge.attributes.name}</TableCell>
      <TableCell>{user.isLoading ? "Chargement..." : (user.isError ? "Une erreur s'est produite" : user.data?.firstName + " " + user.data?.name)}</TableCell>
      <TableCell>{challenge.attributes.scale}</TableCell>
      <TableCell>{challenge.attributes.checkpointsId.length}</TableCell>
      <TableCell>{challenge.attributes.segmentsId.length}</TableCell>
      <TableCell>{challenge.attributes.published ? "Oui" : "Non"}</TableCell>
      <TableCell><Button component={NavLink} to={`/ucp/challenge-editor/${challenge.id}`}>Editer</Button></TableCell>
    </TableRow>
  )
}