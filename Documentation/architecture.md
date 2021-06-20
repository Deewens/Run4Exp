# Architecture matérielle et logicielle

Le projet est constitué de 3 applications : une API, un client mobile et un client web.

![Main Architecture](img/main_architecture.png)  

## Client mobile
L'application mobile étant l'application principale du projet,
son but est de permettre aux utilisateurs inscrits de pouvoir lancer et suivre leur progression sur des challenges.  

Celle-ci a été développée en React Native à l'aide du framework Expo. Ces deux technologies utilisés conjointement
permettent une création et un lancement très rapide du projet, de plus, il existe de nombreuses bibliothèques installable
fonctionnant sous Expo' qui permettent d'accélérer encore plus le développement de l'application.

### Bibliothèques principales
blabla

## Client web
L'application web vient accompagner l'application dans son rôle auprès des utilisateurs, mais est l'application principale
utilisable par les administrateurs de challenge.  

React JS a été utilisé pour son développement, par préférence personnelle afin notamment de voir ce qu'il est possible
de faire avec React JS pour développer une application complexe. De plus, l'application mobile étant également développé
en React, il est ainsi plus simple de partager du code entre les deux applications, mais aussi, une personne sachant développer
en React JS pourra s'adapter au React Native très facilement.

### Bibliothèques principales
* **React Leaflet :** c'est la bibliothèque principale de l'application web, elle est la base de l'éditeur de challenge et permet
l'affichage des données sur une carte facilement personnalisable pour afficher notre propre "fond" de carte par exemple.
  son 
Lien vers la documentation : https://react-leaflet.js.org/
* **Material-UI :** c'est une bibliothèque de composant stylisé (respectant les normes du Material Design préconisé par Google).
 Cette bibliothèque est donc utilisé pour faciliter le design de l'application sans avoir besoin de créer les différents composants.
  De plus, elle intègre un système permettant de créer son propre design si besoin sans avoir à transformer les composants un par un.
  Un dark-mode est nativement intégré. Pour ce projet, Material-UI v5 a été utilisé, c'est la version Alpha qui devrait sortir cette année.
  Comme l'application a été développé d'abord avec Material-UI V4, certaine partie utilisent encore du code de la V4 qui est maintenant déprécié, 
  la conversion est toujours en cours.  
  Lien vers la documentation : https://next.material-ui.com/ (v5)
* **Recharts :** bibliothèque permettant de créer des graphiques.  
Lien vers la documentation : https://recharts.org/en-US/