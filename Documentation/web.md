# Application Web

Documentation de l'application web expliquant l'organisation et les conventions de codages.

## Organisation des fichiers
L'application web dispose d'une organisation spécifique dans src/.
* **api/ :** contient tous les fichiers utilisés pour la liaison à l'API
    * **hooks/ :** les répertoires de ce dossier contiennent chacun un hook permettant d'effectuer une requête à l'API.
  Les dossiers sont triés par entités.
    * **entities/ :** classes décrivant les entités de l'API
    * **axiosConfig.ts :** fichier de configuration axios permettant de donner des paramètres par défaut pour chaque requête effectuée avec axios.
    * **queryKeys.ts :** objet contenant les différentes clés utilisée pour les requêtes React-Query.
    * **type.d.ts :** types TypeScript
* **hooks/ :** différentes hooks utiles
* **images/ :** stocke tout les images utilisées dans l'app'.
* **pages/ :** composants et "pages" de l'application
* **types/ :** déclaration de certains type TypeScript de l'application et des bibliothèques ne possédant pas de type
* **utils/ :** stocke les fichiers déclarant quelques fonctions utiles

## Normes de nommage
### Variables, fonctions
Le camelCase est utilisé pour le nommage des variables et des fonctions

### Composants
Les composants sont nommés en UpperCamelCase

### Fichiers
Les fichiers de composants sont en UpperCamelCase, tout le reste doit être en simple camelCase.

## Composants
Un composant par fichier est la norme. Il est possible cependant d'avoir des exceptions lorsque le composant doit en utiliser un autre exclusivement pour celui-ci.  
Pour résumé, un fichier peut contenir plusieurs composant s'ils sont directement liés entre eux. A partir du moment ou un des composants est nécessaire ailleurs, il doit avoir son propre fichier.  
Les composants doivent tous avoir l'extension *.tsx*.