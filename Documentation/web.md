# Application Web
Documentation de l'application web expliquant l'organisation, les conventions de codage, et certains guides.

## Organisation des fichiers
L'application web dispose d'une organisation spécifique dans src/.
* **api/ :** contient tous les fichiers utilisés pour la liaison à l'API
  * **hooks/ :** les répertoires de ce dossier contiennent chacun un hook permettant d'effectuer une requête à l'API.
Les dossiers sont triés par entités.
  * **entities/ :** classes décrivant les entités de l'API
  * **axiosConfig.ts :** fichier de configuration axios permettant de donner des paramètres par défaut pour chaque requête effectuée avec axios.
  * **queryKeys.ts :** objet contenant les différentes clés utilisées pour les requêtes React-Query.
  * **type.d.ts :** types TypeScript
* **hooks/ :** différentes hooks utiles
* **images/ :** stocke toutes les images utilisées dans l'application.
* **pages/ :** composants et "pages" de l'application
  * **public/ :** composants accessibles lorsque l’on n’est pas connecté à l’application. Ce répertoire stocke
    principalement les composants de la page vitrine
  * **shared/ :** contient les composants qui sont utilisables par les composants *publics* et
    les composants du *dashboard*
  * **ucp/ :** contient les composants accessibles uniquement lorsque l’on est
    connecté à l’application.
* **types/ :** déclaration de certains types TypeScript de l'application et des bibliothèques ne possédant pas de type
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
Pour résumé, un fichier peut contenir plusieurs composants s'ils sont directement liés entre eux. À partir du moment où un des composants est nécessaire ailleurs, il doit avoir son propre fichier.  
Les composants doivent tous avoir l'extension *.tsx*.

### Description des composants principaux

La création du challenge est la partie la plus complexe de l'application, c'est pourquoi voici la description de chaque composant :
* Editor
  * ImageOverlay : composant permettant d’afficher l’image dans le MapContainer de Leaflet
  * MapEditor
    * ControlButtons : contient les boutons de contrôle affichés sur la carte
    * Segment : affiche les segments et permet également leur suppression et modification
    * SegmentCreation : permet de créer un segment
    * Checkpoint : affiche les checkpoints et permet également leur suppression et modification
    * CheckpointCreation : permet de créer un checkpoint
    * Obstacles : affiche les obstacles sur la carte en plus d'un Dialog permettant de modifier la question et la réponse
    * MoveObstacle : permet de modifier la position d'un obstacle sur un segment
  * UpdateChallengeInfosDialog : dialog permettant de modifier les informations du challenge (Scale, nom, description, RichText description)
* ImageUpload : permet d’uploader l’image à mettre dans l’éditeur
* ChallengeList : affiche la liste des challenges dans des cards
* CreateChallengeDialog : dialog permettant de créer le challenge
* ChallengeCard : card d’un challenge affiché dans la liste

### Création d'un composant
#### Composant de rendu
Un composant de rendu est un composant qui rend et traite les données à afficher à l’écran.
L’application étant écrite en Typescript, chaque fichier de composant doit posséder
l’extension *.tsx*.
L'arborescence de ces composants est séparée en différents dossiers :
* **public :** composants accessibles lorsque l’on n’est pas connecté à l’application (mais
les composants restent accessibles même en étant connectés). Ce dossier stocke
principalement les composants de la page vitrine
* **shared :** contient les composants qui sont utilisables par les composants publics et
les composants du dashboard
* **ucp :** contient les composants accessibles uniquement lorsque l’on est
connecté à l’application.  
  
Au sein de ces dossiers, on sépare les composants en deux groupes : “page” et
“components”.
* **pages :** contient les composants permettant d’afficher une page entière
* **components :** peut contenir les composants de traitement de données et les
composants utilisables sur les pages.
  
Donc, lorsque l'on crée un composant, il faut d’abord réfléchir s’il sera accessible sur le
dashboard ou sur la page vitrine, ou les deux. Ensuite, on réfléchit si l’on fait une nouvelle
page ou un composant simple.

#### Création “page”
Pour créer une page, on fait un dossier du nom du composant, et dans ce dossier, on crée
fichier : index.tsx qui sera l’hôte principal de la page.
Ensuite, on peut séparer la page en plusieurs composants à créer dans ce même dossier.

#### Création “component”
Un component se crée plus simplement. On crée simplement le fichier avec le nom du
composant.

## API
### Schéma des entités
Pour convertir les données provenant de l’API, des classes JS ont été créées et ont
pratiquement toujours la même forme.  
Les classes ressemblent un peu aux entités du back-end mais sont adaptées pour être
utilisées dans l’application web. L’application utilisant Typescript, on a la possibilité de créer
des interfaces.  
L’Interface TypeScript contient le schéma de la donnée en elle-même.
La class contient l’objet de la donnée ainsi que les méthodes utiles pouvant être effectuées
sur la donnée ainsi que son id (qui ne doit pas faire partie du schéma de données dans
l’interface).  

```typescript
export interface ICheckpoint {
  name: string
  coordinate: Point
  challengeId: number
  segmentsStartsIds: number[]
  segmentsEndsIds: number[]
  checkpointType: 'BEGIN' | 'MIDDLE' | 'END'
}

export class Checkpoint {
  public readonly attributes: ICheckpoint
  constructor(data: Partial<ICheckpoint>, public readonly id?: number) {
    this.attributes = {
      name: "",
      challengeId: 0,
      checkpointType: "MIDDLE",
      coordinate: {x: 0, y: 0},
      segmentsEndsIds: [],
      segmentsStartsIds: [],
      ...data
    }
  }
}
```
*Exemple de la classe Checkpoint</p>*

### Conversion des données
Lors du fetching des données à l’aide d’Axios et React-Query, il faut transformer les
données du format JSON provenant de l’API, vers le format défini dans l’application Web.Pour ce faire, la première chose est de décrire le schéma des données reçues à l’aide d’une
interface Typescript.

```typescript
export type SegmentApi = {
  id: number,
  name: string,
  coordinates: Point[]
  checkpointStartId: number
  checkpointEndId: number
  challengeId: number
  length: number
}
```
*Exemple de schématisation d’un Segment en fonction du format de données de l’API*

Une fois les données de l’API typées, il faut les convertir dans le format de l’entité décrit
dans la première partie. Voici encore un exemple pour la récupération des Segments :

```typescript
const getSegments = async (challengeId: number): Promise<Segment[]> => {
  return await axios.get<SegmentApi[]>(`/segments?challengeId=${challengeId}`,)
    .then(response => {
      let segments: Segment[] = response.data.map(segmentApi => {
        return new Segment({
        name: segmentApi.name,
        challengeId: segmentApi.challengeId,
        coordinates: segmentApi.coordinates,
        checkpointStartId: segmentApi.checkpointStartId,
        checkpointEndId: segmentApi.checkpointEndId,
        length: segmentApi.length
        }, segmentApi.id)
    })
    return segments
  })
}
```
*Conversion du schéma de données de l’API vers notre class schématisé dans l’application*

Comme on peut le voir ici, l’API renvoie un format précis schématisé par l’Interface
“SegmentApi” et doit ensuite être convertie en l’objet “Segment” qui est décrit dans
l’application web par une class. C’est ce qui se produit ici.  
Avec cette méthode, il est beaucoup plus facile d’utiliser les données provenant de l’API car
elles sont maintenant FORTEMENT typées et le fait d’avoir décrit notre propre format de
données dans l’application web nous offre beaucoup plus de liberté.
