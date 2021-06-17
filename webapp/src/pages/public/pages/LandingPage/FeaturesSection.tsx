import {Box, Container, Typography} from "@material-ui/core";
import SignalWifiConnectedNoInternet4Icon from "@material-ui/icons/SignalWifiConnectedNoInternet4";
import BarChartIcon from "@material-ui/icons/BarChart";
import * as React from "react";
import TravelExploreIcon from '@material-ui/icons/TravelExplore';

export default function FeaturesSection() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        mb: 5,
      }}
    >
      <FeatureItem
        logo={<SignalWifiConnectedNoInternet4Icon sx={{fontSize: 75,}} color="primary" />}
        title="Mode hors-ligne"
        content="L'application Run4Exp est prévu pour fonctionner dans un environnement hors connexion"
      />
      <FeatureItem
        logo={<BarChartIcon sx={{fontSize: 75,}} color="primary" />}
        title="Vos performances"
        content="Des graphiques sur le tableau de bord vous permettent de visualiser votre performance sur les challenges"
      />
      <FeatureItem
        logo={<TravelExploreIcon sx={{fontSize: 75,}} color="primary" />}
        title="Voyager"
        content="Partez à l'aventure dans des environnements virtuels que vous n'imaginez même pas"
      />
    </Container>
  )
}

type FeatureItemProps = {
  logo: React.ReactNode,
  title: string
  content: string
}

function FeatureItem(props: FeatureItemProps) {
  const {
    logo,
    title,
    content,
  } = props

  return (
    <Box
      sx={{
        display: 'flex',
        textAlign: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        px: 5,
        maxWidth: 350,
      }}
    >
      {logo}
      <Typography variant="h5">{title}</Typography>
      <Typography variant="subtitle1">{content}</Typography>
    </Box>
  )
}