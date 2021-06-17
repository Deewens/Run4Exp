import * as React from 'react'
import {Box, Button, CircularProgress, Grid, Pagination, Typography} from "@material-ui/core";
import PublishedChallengeCard from "../../components/PublishedChallengeCard";
import {Challenge} from "../../../../api/entities/Challenge";
import useChallenges from "../../../../api/challenges/useChallenges";
import useChallengesInfinite from "../../../../api/challenges/useChallengesInfinite";
import useUrlParams from "../../../../hooks/useUrlParams";
import ChallengeEntryCard from "../../components/ChallengeEntryCard";
import ChallengeDetailsDialog from "./ChallengeDetailsDialog";
import {useEffect, useState} from "react";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import useCreateUserSession from "../../../../api/user_sessions/useCreateUserSession";
import {useRouter} from "../../../../hooks/useRouter";
import {useSnackbar} from "notistack";

/**
 * Page permettant à un utilisateur de rechercher des challenges publiés pour lesquels il souhaite participer
 */
export default function Index() {
  const router = useRouter()
  const urlParams = useUrlParams()
  const challenges = useChallenges({page: parseInt(urlParams.get("p") ?? "1")-1, publishedOnly: true, size: 20,}, {
    keepPreviousData: true,
  })

  const { enqueueSnackbar } = useSnackbar()

  const createSession = useCreateUserSession()

  const [challengeIdDetailsDialog, setChallengeIdDetailsDialog] = useState<number | null>(null)

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  // ID du challenge sur lequel l'utilisateur va s'inscrire (nécessaire pour le garder en mémoire à cause de la modal de confirmation)
  const [challengeToRegisterId, setChallengeToRegisterId] = useState(0)

  const handleRegisterClick = (challengeId: number) => {
    setConfirmationDialogOpen(true)
    setChallengeToRegisterId(challengeId)
  }

  const handleRegisterConfirm = () => {
    createSession.mutate({challengeId: challengeToRegisterId}, {
      onError() {
        setChallengeToRegisterId(0)
        setChallengeIdDetailsDialog(null)
        setConfirmationDialogOpen(false)
        enqueueSnackbar("Impossible de vous inscrire, une erreur est survenue.", {variant: 'error'})
      },
      onSuccess(data) {
        setChallengeIdDetailsDialog(null)
        setConfirmationDialogOpen(false)
        enqueueSnackbar("Vous venez de vous inscrire au challenge ! Redirection...", {variant: 'success'})
        router.push('/ucp/my-challenges/' + challengeToRegisterId + '?session=' + data.id)
        setChallengeToRegisterId(0)
      }
    })
  }

  const handleDetailsClick = (challengeId: number) => {
    setChallengeIdDetailsDialog(challengeId)
  }

  useEffect(() => {
    if (challenges.isSuccess) {
      console.log(challenges.data)
    }
  }, [challenges.isSuccess])

  return (
    <>
      <Box
        sx={{
          margin: theme => theme.spacing(4),
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(345px, 1fr))',
            justifyItems: 'center',
            justifyContent: 'center',
            gridGap: '1rem',
            pb: 3,
          }}
        >
          {challenges.isSuccess && (
            challenges.data.page.totalElements == 0 ? (
              <Typography variant="body1">Aucun challenge n'a encore été publié. Revenez voir plus tard !</Typography>
            ) : (
              challenges.data.data.map(challenge => (
                <ChallengeEntryCard
                  key={challenge.id!}
                  challengeId={challenge.id!}
                  onRegisterClick={() => handleRegisterClick(challenge.id!)}
                  onDetailsClick={() => handleDetailsClick(challenge.id!)}
                />
              ))
            )
          )}
        </Box>

        {challenges.isSuccess && (
          <Pagination
            sx={{display: 'flex', justifyContent: 'center',}}
            count={challenges.data.page.totalPages}
            onChange={(e, page) => {
              //urlParams.append('p', page.toString())
              router.history.push({
                pathname: '/ucp/find-challenge',
                search: `p=${page}`,
              })
            }}
          />
        )}

        {challenges.isLoading || challenges.isError && (
          <Pagination count={10} disabled />
        )}
      </Box>

      {challengeIdDetailsDialog && (
        <ChallengeDetailsDialog
          challengeId={challengeIdDetailsDialog}
          onClose={() => setChallengeIdDetailsDialog(null)}
          open={challengeIdDetailsDialog === null ? false : true}
          onRegisterClick={handleRegisterClick}
        />
      )}

      <ConfirmationDialog
        open={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
        actions={
          <>
            <Button onClick={() => setConfirmationDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleRegisterConfirm}>S'inscrire</Button>
          </>
        }
      >
        Vous allez vous inscrire à ce challenge. Vous allez être redirigé vers celui-ci.
      </ConfirmationDialog>
    </>
  )
}