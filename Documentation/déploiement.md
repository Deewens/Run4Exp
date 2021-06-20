# Déploiement des applications

## Environnement de développement
Pour mettre en place son environnement de développement sur son PC personnel, il a quelques étapes à suivre.  

### API
Il est possible de créer votre environnement à l'aide de docker, bien que cela ne soit pas obligatoire.
Dans tous les cas, vous devez avoir un serveur MySQL que vous pouvez installer à partir de Docker.

1. Cloner la branch **develop** du repository
2. Démarrer le serveur MySQL (soit votre propre serveur, soit à partir d'une image Docker dont la mise en place est expliquée sur le wiki de gitlab : https://git.unistra.fr/acrobatt-equipe-6/acrobatt/-/wikis/Base-de-donn%C3%A9es)
3. Rendez-vous dans le fichier ``src/resources/application.properties``
4. Modifier les informations de connexion pour correspondre à votre serveur MySQL
5. Enregistrer et fermer le fichier

Ensuite, vous pourrez lancer l'API. L'API peut se lancer avec ou sans docker.

**Installation et lancement de l'API à partir de Docker**
1. Ouvrir un terminal de commande
2. Rendez-vous dans le dossier de l'API
3. Lancer la commande : ``mvnw.cmd spring-boot:build-image`` (rajouter ./ avant la commande sur Windows)
4. Attendre la fin de la création de l'image docker.
5. Lancer l'interface utilisateur de Docker
6. Lancer la commande ``docker-machine ip``, noter l'ip affiché
7. Déplacez-vous dans le dossier .git/ de l'API
8. Utiliser la commande ```docker-compose up```
9. Aller sur votre navigateur pour vérifier que l'API fonctionne en vous mettant comme URL l'IP que vou avez récupéré précédemment et en rajoutant :8080.

**Installation et lancement de l'API sans Docker**
1. Ouvrir un terminal de commande
2. Rendez-vous dans le dossier de l'API
3. Taper la commande : ``mvnw.cmd spring-boot:run``
4. Les fichiers de l'API vont être compilés, puis le serveur se connectera à 

### Application web
Le démarrage de l'application web en mode développement est très simple.  
Pensez régulièrement à effectuer la commande ```npm install``` dès que vous récupérez sur le repo gitlab des changements.  

Rendez-vous dans le dossier de l'application et taper la commande ``npm run start``, ce qui va lancer le serveur de développement de react. 

### Application mobile
L'application mobile utilise yarn comme gestionnaire de paquet. Rendez-vous dans la racine de l'application mobile.  
Comme pour l'application mobile, utiliser la commande ``yarn install`` pour installer les éventuels nouveaux plugins.  
Ensuite, pour lancer le serveur de développement react-native, utiliser la commande ``expo start`` ou ``yarn start``.