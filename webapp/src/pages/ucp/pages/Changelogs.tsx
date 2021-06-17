import {Box, Divider, Typography} from "@material-ui/core";

export default function Changelogs() {
  return (
    <Box sx={{padding: theme => theme.spacing(3)}}>
      Retrouvez la liste des mises à jours de l'application web Run4Exp sur cette page.
      <Typography variant="h5" component="h2">
        Version 3.1.0
      </Typography>
      <Divider />
      <Typography variant="body1">
        <ul>
          <li>Ajout de la publication d'un challenge</li>
          <li>Affichage de la carte du challenge pour les administrateurs</li>
          <li>Les administrateurs peuvent afficher la position des utilisateurs actuellement sur la carte</li>
          <li>Ajout de l'historique des actions d'un challenge</li>
        </ul>
      </Typography>

      <Typography variant="h5" component="h2">
        Version 3.0.0
      </Typography>
      <Divider />
      <Typography variant="body1">
        <ul>
          <li><b>Bug :</b> des changements dans le plugin de thème ont demandé à faire des corrections</li>
          <li>Ajout des statistiques (factices) sur l'accueil</li>
          <li>Ajout d'une page permettant de voir sa progression sur les challenges sur lesquels on est inscrit</li>
          <li><b>Éditeur de cartes :</b>
            <ul>
              <li>Ajout des obstacles (création, suppression et modification)</li>
              <li>Possibilité de modifier la position des points du segment</li>
            </ul>
          </li>
        </ul>
      </Typography>

      <Typography variant="h5" component="h2">
        Version 2.0.0
      </Typography>
      <Divider />
      <Typography variant="body1">
        <ul>
          <li>Ajout du thème sombre et possibilité de changer de thème</li>
          <li>Connexion automatique de l'utilisateur après inscription</li>
          <li><b>Éditeur de cartes :</b>
            <ul>
              <li>sélection/désélection d'un objet sur la carte</li>
              <li>possibilité d'ajouter un checkpoint sans segment</li>
              <li>ajout d'un fond personnalisé pour le challenge</li>
              <li>ajout du déplacement d'un checkpoint après l'avoir ajouté</li>
              <li>ajout du déplacement d'un checkpoint après l'avoir ajouté</li>
              <li>ajout d'un champ de description (version courte et texte riche)</li>
              <li>ajout du checkpoint de départ et d'arrivée</li>
            </ul>
          </li>
        </ul>
      </Typography>

      <Typography variant="h5" component="h2">
        Version 1.0.0
      </Typography>
      <Divider />
      <Typography variant="body1">
        <ul>
          <li>Ajout de l'inscription et de la connexion</li>
          <li>Ajout de l'éditeur de cartes (utilisant Leaflet)</li>
          <li><b>Éditeur de cartes :</b> ajouter de checkpoint et segment</li>
        </ul>
      </Typography>
    </Box>
  )
}