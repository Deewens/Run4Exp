# API

Documentation expliquant les conventions et la structure de l'API utilisée par le mobile et le web.

Édité par: UKHANOV Ilya

Le: 20 juin 2020

## Technologies

### Java

Le langage de Java a été choisi principalement parce qu'on avait envie de choisir quelque chose de plus stable et statiquement typé au contraire de Javascript ou autres langages qui deviennent de plus en plus populaires sur le backend. De plus, on a déjà eu de l'expérience positive avec le module JEE en licence pro.

Pour autant, on pourrait noter que lors de ce projet on n'as pas utilisé le potentiel de Java à son potentiel, notamment sa notion de 1 thread par requête, parce que l'API s'est avérée d'être peu friande en puissance de calculs. Un potentiel usage était le traitement de la résolution des images pour optimiser les performances de l'appli mobile, mais on n'as malheureusement pas eu assez de temps pour coder cette fonctionnalité

### Spring Boot

Spring boot est un framework Java qui facilite grandement le développement des applications web. Il est notable pour ses fonctionnalités avancées pour sécuriser les API, sa structure MVC assez simple et sa librairies d'ORM Hibernate tellement puissante que même les dotneteurs l'ont reproduit en C# en créant le NHibernate! Ha!

Malgré la structure complexe du projet, je n'ai utilisé qu'une infime partie de la puissance du framework, comme Spring Webflux, le OAuth, les connecteurs de Cloud, les connecteurs de Redis, etc. Et j'ai donc hâte de continuer à l'utiliser dans mes projets persos pour découvrir ces fonctionnalités.

### Structure approximative du framework

Comme dans la plupart des frameworks web, il y a un Conteneur qui contient tous les autres composants. Chaque composant est un JavaBean qui peut être traité de façon différente en fonction de comment on le déclare:

@Repository pour les repositories de l'ORM

@Entity pour les entité de l'ORM

@Controller pour les controlleurs qui reçoivent des requêtes

@Service pour les services qui contiennent des fonctions métier

Chaque composant peut donc après être Autowired (injecté) dans les autres composants pour assurer leurs liaison. Pour faciliter cela et la définition des composants on utilise une lib qui s'appelle Project Lombok

### Project Lombok

Cela permets de générer automatiquement beaucoup de code répétitif dans les classes java, comme les toString, les constructeurs, les get/set, etc

Sa principale utilisateur dans Spring Boot était pour générer les constructeurs automatiquement avec les bons paramètres pour que Spring Boot sache quel composants il faut Autowire. Par exemple:

```java
@Controller
@RequiredArgsConstructor // Dit à Lombok de générer un constructeur pour les final
public class ChallengeController {
	private final ChallengeService challengeService; // Le déclarer en final dit à Lombok que c'est 	  											     // un required Args - donc l'inclure dans le 														 // constructeur généré automatiquement.
													 // Donc il va être Autowired
	
	// Nous permets d'exécuter du code après le constructeur du Lombok
	@PostConstruct
    public void initialize() {

    }
}
```

Cette approche permets d'économiser beaucoup de temps lors de la création de nouveaux composants

## Organisation

### Les fichiers

L'API est placée dans le dossier backend du projet Acrobatt.

Le code est placé dans src/main/java/com/g6/acrobatteAPI (nommont-le $SRC)

Les classes compilées sont dans le dossier target

La structure des packages dans $SRC:

- configuration/    Les composants de config Spring Boot
- controllers/ 	   Les controlleurs REST 
- entities/             Les entités de l'ORM	
  - events/      À la base utilisé pour séparer des nombreuses classes des événements dans les UserSessions du reste des entités. Depuis qu'on a transféré la gestion de la course sur le mobile, le dossier est gardé que pour la rétrocompatibilité

* exceptions/     Les exceptions custom utilisées pour gérer les erreurs de l'API et montrer des jolis messages à ces frontenders qui savent pas report correctement des bugs!
* hateoas/          On a voulu implémenter les vraies conventions de REST dans l'API en rajoutant le HATEOAS dans les réponses, mais ce système s'est avéré être trop complexe pour très peu de gains pour une API qui n'est utlisée que par deux applications. Est gardé pour la rétrocompatibilité avec les applis
* models/           Arnaud Schieber, le C-sharper dans le cœur refusait qu'on appelle ce dossier les DTOs malgré toutes les conventions de Java. Mais la fonction est toujours la même: les modèles sont des classes qui forment une couche qui se mets entre les entités et l'utilisateur de l'API, permettant à nous de moduler les informations qu'on lui envoie. Par exemple, si on veux pas envoyer le MDP de l'entité User dans la réponse, on crée un modèle UserResponse sans le champs password. Sont rangés par dossier, chaque dossier corresponds à une entité
* projections/     Une forme de mapping des entités de l'ORM dans les modèles pour les envoyer aux utilisateurs. S'est avéré d'être difficilement gérable pour des cas vraiment complexes, et donc j'ai choisi la lib ModelMapper à la place qui est beaucoup plus modulable. Il en en reste encore des traces dans l'API mais très peu.
* repositories/   Des repositories Spring Boot. Un système assez spécifique qui se base sur les conventions de nommage pour atteindre l'objectif zéro code. S'est avéré d'être une sacrée usine à gaz, avec beaucoup trop de magie boite-noire. Je conseillerai pas d'utiliser ça dans un projet vraiment complexe
* security/          La sécutité de Spring Boot. On n'a utilisé rien de fou, la plupart des beans sont pareil qu'en JEE, sauf que tout est orchestré par des SecurityFilters de Spring.

* typemaps/     Les typemaps custom du ModelMapper dont on a parlé récemment. Permets au modelmapper de mapper les modèles plus complexes que les modèles REST lambda.

### Conventions de nommage

Pour les composants c'est simple: on rajoute le type de composant à la fin, comme par exemple ChallengeService, UserSessionController, UserRepository, etc

Pour les modèles il y a des noms plus spécifiques:

*Entity*ResponseModel: la réponse générique qu'on envoie presque partout dans le REST

*Entity*CreateModel: le modèle qui contient les données envoyées par le client de l'API pour créer l'entité. Est validé par le validateur javax et ses annotations

*Entity*UpdateModel: idem pour le update

Etc... Vous avez compris le principe

### Les entités

Si on doit définir en grosses lignes:

Les Users peuvent avoir des role: ROLE_CLIENT et ROLE_ADMIN, aussi appelés les superadmins. Les superadmins peuvent créer des challenges et être admin des challenges pour les modifier

L'entité Challenge référence tout: Segments, Checkpoints, Users - administrateurs du challenge qui peuvent le modifier

Les Checkpoints sont organisés comme des nœuds d'un graphe dirigé - avec les relation OneToMany: segmentsStarts et segmentsEnds

Le Segment contient des obstacles 

Les UserSessions sont des sessions de courses qui parcourent le Challenge depuis le début jusqu'à sa fin. Ils contiennent la liste des Events, qui sont des actions que l'utilisateur fait lors de son parcours

On stock les coordonnées de la map dans nos entités mais on les traite (quasiment) pas dans l'API

## Difficultés rencontrées 

1. Les difficultés d'organisation avec Arnaud pendant le premier sprint avant qu'il est parti dans le dév de l'appli mobile. Principalement à cause des conventions de nommage, mais aussi on était deux à avoir beaucoup d'idées farfelues ce qui a résulté dans beaucoup de changements de systèmes et donc dans beaucoup de legacy code (les projections, HATEOAS, etc)

2. La nouveauté du framework. On s'attendait à cette difficulté car elle était voulue: découvrir un nouveau framework est toujours passionnant. Mais du coup le premier temps on devait passer plus de temps à lire la doc que de coder.

3. Le rush du premier sprint: fallait faire du Blietzkrieg du code pour que les applis web et mobile puissent commencer à utiliser l'API au plus vite.

4. Est-ce que ce p'ti bug c'est de la faute de l'API ou de mon application? Naaaan, c'est forcément la faute du back! 

   ​																																	- Jean-Michel Frontender