# Acrobatte API

## 1. Installation

Pour installer et lancer l'API localement sur votre ordinateur, vous devez avoir une installation de Docker et de docker-compose sur votre ordinateur.

### Pour Windows:

- Ouvrir cmd dans le dossier de l'API
- lancer la commande: mvnw.cmd spring-boot:build-image
- Attendre la fin de la création de l'image Docker. Votre Docker aura maintenant l'image acrobatte.api
- Lancer Docker Quickstart Terminal
- Lancer la commande docker-machine ip: noter le IP affiché par docker
- Naviguer dans le dossier git de l'API
- lancer la commande docker-compose up
- Pour tester la connectivité, connectez-vous à l'IP que vous avez noté, avez le port 8080