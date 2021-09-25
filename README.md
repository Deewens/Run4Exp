> I am currently translating the whole markdown documentation in english. For now, some part are still written in french.

# Run4Exp

Run4Exp is a running app where the player's real movements are transmitted to a virtual map.

## Table of contents

1. [App design](#archi)
2. [Development documentation](#developer)
3. [How to deploy the app?](#deploy)

## Context

This project was one of the biggest university project I made in team to get my third year diploma in Computer Science. The following paragraphs helps you to understand the purpose of the application.

Following a catastrophic report by Santé Publique France on the physiological state of students in France, the Ministry of Health wants to create an application to motivate youngs to do sports. 

The idea is to design an application that allows you to run a race in a virtual world. In order to progress in the virtual race, it is necessary to run or cycle in the real world, but also to solve puzzles or challenges in order to overcome certain obstacles that will be set up on the road.

# App design <a name="archi" ></a>

* Web app: written in TypeScript using ReactJS Framework.
* Mobile app: written in JavaScript and TypeScript using React Native framework.
* API : written using Spring Framework (Java Enterprise Edition)

For more information on the differents technologies used, see: [Architecture](./Documentation/architecture.md).

# Development documentation <a name="developer" ></a>

You will find the developer documentation for the different parts of the application with installation instructions for each app below.

## API

The API has been entirely developed by https://github.com/lousch3  
[API Documentation](./Documentation/api.md)

## Web application

The web app has been entirely developed by me (Adrien).  
[Web Documentation](./Documentation/web.md)

## Mobile application

The mobile app has been developed by https://github.com/Waytal and https://github.com/Praxo.  
[Mobile Documentation](./Documentation/mobile.md)

# How to deploy the apps on your machine? <a name="deploy" ></a>

[Deployement](./Documentation/d%C3%A9ploiement.md)
