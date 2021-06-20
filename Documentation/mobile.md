# Application Mobile

Doc "développeur" de l'application mobile

## Organisation des fichiers

L'application mobile dispose d'une organisation dans le dossier src/.

- **api/ :** contient tous les fichiers utilisés pour la liaison à l'API
- **components/ :** fichiers de composants qui seront montés dans les pages
  - **ui/ :** fichiers de composants concernant l'interface graphique : boutton, avatar, image
- **context/ :** stocke tout les fichiers pour la création de contextes
- **database/ :** fichiers concernant la base de données local
- **navigation/ :** fichiers pour la création des menus
- **screens/ :** composants et "pages" de l'application
- **styles/ :** fichiers pour le thème de l'application
- **utils/ :** stocke les fichiers déclarant quelques fonctions utiles

Les images de l'application ce trouvent dans le dossier assets en dehors de src.

## Normes de nommage

### Variables, fonctions

Le camelCase est utilisé pour le nommage des variables et des fonctions

### Composants

Les composants sont nommés en UpperCamelCase

### Fichiers

Les fichiers de composants sont en UpperCamelCase, tout le reste doit être en simple camelCase.

## Composant

La plupart des composants sont en typeScript.

### ChallengeMap

Le composant **ChallengeMap** est le plus compliqué il utilise lui-même un composant enfant pour le rendu de la carte et 4 composant utils dédié pour la gestion des données : challengeData, challengeEvent, challengeModal, challengeStore.

challengeData : ce fichier contient les fonctions pour récupérer, synchroniser et modifier les données d'un challenge.

challengeEvent : ce fichier contient les fonctions pour calculer l'avancement de l'utilisateur et déterminer si l'utilisateur se trouve dans un cas de figure où il devrait être arreté.

challengeModal : ce fichier contient les fonctions que les modals appellerons.

challengeStore : ce fichier contient tous les states du challengeMap.
