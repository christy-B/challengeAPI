
<div align="center">
<h1 align="center">
<img src="https://i.ibb.co/GxYVKYn/api.png" width="100" />

<br>ChallengeAPI
</h1>
<h3>challengeAPI MT4-HETIC</h3>
<h3>Made with 💚</h3>
<br>

<p align="center">
<img src="https://img.shields.io/badge/Nodemon-76D04B.svg?style&logo=Nodemon&logoColor=white" alt="Nodemon" />
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style&logo=TypeScript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/tsnode-3178C6.svg?style&logo=ts-node&logoColor=white" alt="tsnode" />
<img src="https://img.shields.io/badge/Ajv-23C8D2.svg?style&logo=Ajv&logoColor=white" alt="Ajv" />
<img src="https://img.shields.io/badge/JSON-000000.svg?style&logo=JSON&logoColor=white" alt="JSON" />
<img src="https://img.shields.io/badge/Express-000000.svg?style&logo=Express&logoColor=white" alt="Express" />
</p>
</div>

---

## 📒 Table des matières
- [📒 Table des matières](#-table-of-contents)
- [📍 Vue d'ensemble](#-overview)
- [⚙️ Fonctionnalités](#️-features)
- [📂Structure du Projet](#-project-structure)
- [🧩 Modules](#-modules)
- [🚀 Comment lancer le projet ?](#-getting-started)
  - [📦 Installation](#-installation)
  - [🎮 Utilisé challenge API](#-using-challengeapi)
  - [🧪 Running Tests](#-running-tests)
- [👏 Membre du groupe](#-acknowledgments)

---

<br>

## 📍 Vue d'ensemble

Challenge API est une API doter d'une interface front pour la gestion d'un **CHALLENGE SSH** au sein d'une ou plusieur promo dans une écoles. Il fournit différentes routes et gestionnaires pour l'authentification, la gestion des utilisateurs, les promotions, les défis, les questions, les scores et les instances. La base de code inclut également des classes utilitaires et des modèles pour interagir avec une base de données MySQL. Le projet vise à faciliter la création, la gestion et le suivi des défis, permettant aux utilisateurs de participer, de soumettre des scores et de consulter leur progression. Sa proposition de valeur réside dans son architecture robuste et évolutive, avec des fonctionnalités telles que l'authentification, la gestion des erreurs et l'abstraction de la base de données.

---

## ⚙️ Fonctionnalités

| Fonctionnalité                | Description                           |
| ---------------------- | ------------------------------------- |


| **⚙️ Architecture**     | 

On utilise une architecture modulaire pour la base du code, avec des fichiers séparés pour les différents composants tels que le serveur, les middlewares, les routes, les modèles, les utilitaires et les types. On utilise le framework Express.js pour construire le serveur API. Cette conception modulaire facilite la maintenance, l'évolutivité et la testabilité de la base de code. On suit également les principes RESTful pour la conception des routes de l'API. La base de code est organisée de manière claire et structurée.  

---

| **🔗 Dependences**    | 

Dans ce projet, on utilise plusieurs dépendances externes. Parmi celles-ci, on a choisi d'utiliser:
- `Typescript` pour.., 
- `Express.js` pour construire **notre serveur API, MySQL2** pour interagir avec notre base de données **MySQL**, 
- `Dotenv` pour gérer nos variables d'environnement, et ``` Node Mailjet``` pour l'envoi des e-mails.

On gère ces dépendances à l'aide d'un fichier package.json et on peut les installer facilement en utilisant npm ou yarn. Cependant, il serait bénéfique pour notre projet d'établir une stratégie de gestion des dépendances afin de s'assurer que celles-ci sont constamment mises à jour et sécurisées. 

---




## 📂 Structure du Projet


```bash
repo
├── README.md
├── dbms 📂
│   ├── Dockerfile.db
│   ├── database.sql
│   └── mariadb.cnf
├── docker 📂
│   ├── Dockerfile.dev
│   └── sources.list
├── docker-compose.dev.yml
├── nginx
│   └── api-dev.nginx.conf
├── package-lock.json
├── package.json
├── src 📂
│   ├── middleware
│   │   ├── auth.middleware.ts
│   │   └── error-handler.middleware.ts
│   ├── model 📂
│   │   ├── DbTable.ts
│   │   ├── IChallenge.ts
│   │   ├── IInstance.ts
│   │   ├── IPromo.ts
│   │   ├── IQuestion.ts
│   │   ├── IScore.ts
│   │   └── IUser.ts
│   ├── routes 📂
│   │   ├── Auth.ts
│   │   ├── Challenge.ts
│   │   ├── ChallengeAdmin.ts
│   │   ├── IScore.ts
│   │   ├── Instance.ts
│   │   ├── Promo.ts
│   │   ├── Question.ts
│   │   └── User.ts
│   ├── server.ts
│   ├── test 📂
│   │   └── postman
│   │       └── api.postman_collection.json
│   ├── types 📂
│   │   ├── ICreateResponse.ts
│   │   ├── IDeleteResponse.ts
│   │   ├── IIndexQuery.ts
│   │   ├── IUpdateResponse.ts
│   │   └── auth
│   │       ├── IAccessToken.ts
│   │       └── IRequestMagicLink.ts
│   └── utility 📂
│       ├── Crud.ts
│       ├── DB.ts
│       ├── Email.ts
│       ├── Error
│       │   ├── ApiError.ts
│       │   ├── ErrorCode.ts
│       │   ├── IApiError.ts
│       │   └── StructuredErrors.ts
│       └── JWT.ts
└── tsconfig.json

14 directories, 44 files
```




---

## 🧩 Nos Modules


<details open><summary>Docker</summary>

| Fichier           |  Résumé du fonctionnement du fichier.                                                                                                                                                                                                                                                                         |
| ---            | ---                                                                                                                                                                                                                                                                |
| sources.list   | Dans notre projet, on fournit un extrait de code représentant un fichier de configuration pour les dépôts de packages dans Debian. Celui-ci accorde la priorité aux miroirs français pour le téléchargement des packages, et en cas d'indisponibilité, il se tourne vers les dépôts principaux pour la version Bullseye de Debian.  
|
 Dockerfile.dev  | On configure une image Docker avec Node.js et on installe des packages supplémentaires tels que sudo, less, mycli, tzdata, typescript et ts-node. On définit également le fuseau horaire sur Europe/Paris et on spécifie le shell par défaut ainsi que le répertoire de travail.  |

</details>

<details open><summary>Dbms</summary>

| Fichier          | Résumé du fonctionnement du fichier.                                                                                                                                                                                                                                                   |
| ---           | ---                                                                                                                                                                                                                                                       |
| Dockerfile.db | L'extrait de code qui permet de configurer notre conteneur MariaDB qui nous permet de copier un fichier SQL pour la création de la base de données. Ce fichier sera ensuite exécuté pendant le processus de construction du conteneur.                                                                                         |
| mariadb.cnf   | Cet extrait de code est un fichier de configuration pour MariaDB/MySQL. Il définit des options globales telles que l'emplacement du socket, le nombre maximal de connexions et le délai d'attente. De plus, il désactive le cache d'hôte et la résolution des noms.                                                     |
| database.sql  | Le code crée une base de données MySQL et définit plusieurs tables pour une application de challenge. Il crée également un déclencheur pour imposer des contraintes de longueur de mot de passe et d'adresse IP. De plus, il crée un utilisateur et accorde des autorisations d'accès à l'API. |

</details>

<details open><summary>Nginx</summary>

| File               |  Description du fichier.                                                                                                                                                                                                  |
| ---                | ---                                                                                                                                                                                                      |
| api-dev.nginx.conf | Ce code configure un bloc serveur qui écoute sur le port 80 avec le nom de serveur "test.challenge.hetic.yes". Les requêtes à ce bloc serveur seront proxyfiées vers le serveur "vscode_api" sur le port 8000. |

</details>

<details open><summary>Src</summary>

| File      | Description du fichier.                                                                                                                                                                                                                                                                                      |
| ---       | ---                                                                                                                                                                                                                                                                           |
| server.ts | Ce code configure un serveur Express avec plusieurs routes pour gérer l'authentification, la gestion des utilisateurs, des promos, des challenges, des questions, des scores et des instances. Il inclut également des middlewares pour l'authentification et la gestion des erreurs. Le serveur écoute sur un port spécifié. |

</details>

<details open><summary>Middleware</summary>

| File                        | Description du fichier.                                                                                                                                                                                                                                                                                                                                                                          |
| ---                         | ---                                                                                                                                                                                                                                                                                                                                                                              |
| error-handler.middleware.ts | Ce code est un middleware par défaut pour la gestion des erreurs dans une application Express. Il gère différents types d'erreurs, y compris les erreurs liées à l'API et à la base de données, et renvoie une réponse d'erreur appropriée au client.                                                                                                                                   |
| auth.middleware.ts          | Ce code implémente un middleware appelé JWTAuthHandler qui gère l'authentification à l'aide de JSON Web Tokens (JWT) dans une application Express. Il vérifie le JWT dans l'en-tête d'autorisation, vérifie l'expiration du token, décode le payload du token, valide les scopes requis et enregistre l'ID de l'utilisateur décodé sur l'objet de réponse pour une utilisation ultérieure. |

</details>

<details open><summary>Types</summary>

| File               | Description du fichier.                                                                                                                                                                                                                                                                                                                                          |
| ---                | ---                                                                                                                                                                                                                                                                                                                                              |
| IIndexQuery.ts     | Ce code fournit des interfaces pour une requête d'index avec des paramètres de pagination, une condition de lecture et une réponse qui inclut la page, la limite, le total et les lignes. Il inclut également une interface pour une réponse de comptage de table à partir de MySQL.                                              |
| IUpdateResponse.ts | Ce code définit une interface nommée IUpdateResponse qui se compose de deux propriétés : id (un nombre ou une chaîne de caractères) et rows (un nombre). Cette interface peut être utilisée pour représenter la réponse d'une opération de mise à jour, en fournissant des informations sur l'identifiant de l'enregistrement mis à jour et le nombre de lignes affectées lors de la mise à jour. |
| IDeleteResponse.ts | Ce code définit l'interface "IDeleteResponse" qui a deux propriétés : "id" (de type nombre ou chaîne de caractères) et "rows" (de type nombre). Cette interface est utilisée pour définir l'objet de réponse lors de la suppression de données.                                                |
| ICreateResponse.ts | Ce code définit une interface appelée `ICreateResponse` avec une seule propriété `id` de type nombre. Cette interface est utilisée pour décrire la structure attendue d'un objet de réponse lors de la création d'une nouvelle entité.                                                            |

</details>

<details open><summary>Auth</summary>

| File                 | Description du fichier.                                                                                                                                                                                                                 |
| ---                  | ---                                                                                                                                                                                                                     |
| IRequestMagicLink.ts | Ce code définit deux interfaces, IRequestMagicLink et IRequestMagicLinkResponse. IRequestMagicLink comprend une propriété email de type chaîne de caractères, tandis que IRequestMagicLinkResponse comprend une propriété ok de type booléen. |
| IAccessToken.ts      | Ce code définit une interface pour un jeton d'accès, spécifiant l'ID de l'utilisateur et la portée de l'accès.                                                                                                                  |

</details>

<details open><summary>Model</summary>

| File          | Description du fichier.                                                                                                                                                                                                                                                                                                                                                                                       |
| ---           | ---                                                                                                                                                                                                                                                                                                                                                                                           |
| IPromo.ts     | Ce code définit des interfaces et des types d'utilité pour manipuler les données de promotion. Il comprend une interface pour les objets de promotion, des versions en lecture seule et en création/mise à jour de l'interface, ainsi que des types d'utilité pour manipuler ces interfaces.                                                                                                                                                       |
| IUser.ts      | Ce code définit une interface pour un objet utilisateur avec diverses propriétés. Il fournit également des types d'utilité pour créer et mettre à jour des utilisateurs, ainsi qu'une version en lecture seule de l'interface User.                                                                                                                                                                                             |
| IInstance.ts  | Ce code définit des interfaces et des types pour gérer les instances. Il comprend une interface pour une instance avec des champs facultatifs, des champs en lecture seule, des champs de création et des champs de mise à jour. Ces structures permettent une manipulation et une gestion sûres des données d'instance en TypeScript.                                                                                                |
| IScore.ts     | Ce code définit des interfaces et des types d'utilité pour manipuler les données de score. Il comprend la définition d'une structure de score avec des champs facultatifs, un type de score en lecture seule, un type de création de score et un type de mise à jour de score. Ces types permettent de garantir la sécurité des types et de manipuler facilement les données de score.                                                                             |
| IQuestion.ts  | Ce code fournit des interfaces pour représenter les questions. Il comprend une interface pour un objet de question, avec des propriétés telles que l'identifiant, le texte, la description, la réponse correcte, l'état actif et le score. Il définit également des alias de type pour les questions en lecture seule, la création de nouvelles questions et la mise à jour des questions existantes. Ces interfaces et types garantissent la cohérence et l'immutabilité des données. |
| DbTable.ts    | Ce code définit un type appelé `DbTable` qui représente différentes tables dans une base de données, telles que user, promo, challenge, question et score.                                                                                                                                                                                                                                          |
| IChallenge.ts | Ce code fournit des interfaces et des types d'utilité pour manipuler les objets de challenge. Il définit la structure d'un objet de challenge, y compris ses propriétés telles que l'ID, le nom, la date de début, l'ID promotionnel et l'état actif. Il fournit également des types d'utilité pour créer et mettre à jour des objets de challenge, en rendant certains champs en lecture seule ou facultatifs.                                  |

</details>

<details open><summary>Routes</summary>

| File              | Description du fichier.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---               | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Challenge.ts      | Ce code est un routeur Express pour gérer les points d'extrémité liés aux challenges. Il inclut les routes GET et POST. La route GET récupère une liste paginée de challenges à partir d'une base de données MySQL et renvoie les données sous forme de réponse JSON. La route POST insère un challenge dans la base de données et renvoie l'ID du challenge inséré.                                                                                                                                         |
| ChallengeAdmin.ts | Ce code définit des routes pour gérer les opérations CRUD sur une entité "Challenge" dans une application Express. Le code inclut un point d'extrémité GET pour récupérer une liste de challenges avec pagination, un point d'extrémité POST pour créer un challenge et un point d'extrémité DELETE pour supprimer un challenge par son ID. Ces routes sont combinées et exportées sous forme de `ROUTES_ACHALLENGE` pour une utilisation dans d'autres parties de l'application.                                                                    |
| Question.ts       | Ce code est un routeur pour gérer les points d'extrémité liés aux questions. Il comprend un gestionnaire de requêtes GET qui récupère une liste paginée de questions à partir d'une base de données, en fonction des paramètres de requête fournis. Le gestionnaire renvoie les résultats ainsi que le nombre total de questions dans la réponse.                                                                                                                                                                            |
| IEScore.ts         | Ce code fournit des routes pour les opérations CRUD sur les scores. Il utilise Express et MySQL2. Le point d'extrémité GET récupère des scores paginés à partir de la base de données. Le point d'extrémité POST crée un nouveau score dans la base de données. Le point d'extrémité PUT met à jour un score existant dans la base de données. Les routes sont regroupées dans les objets "routerScore" et "routerScore_", qui sont ensuite combinés dans l'objet "routerScores".                                                                            |
| User.ts           | Ce code définit les routes et les fonctionnalités pour gérer les opérations

<br><br>


## 🚀 Comment lancer le projet ?

<br>

### 📦 Installation

1. Cloner le dépôt challengeAPI :
```sh
git clone /Users/ousmanesalamatao/docAI/challengeAPI
```
---

2. Se rendre dans le répertoire du projet :
```sh
cd challengeAPI
```

3. Installer les dépendances :
```sh
npm install
```

---

### 🎮 Lancer l'API

```sh
npm run build && node dist/main.js
```

### 🧪 Running Tests
```sh
npm test
```

---
<br>

# 👏 Membres du groupe

> ## `ℹ️ contributors`
> 
    ◦ Ebou Christelle
    ◦ Thomas Dias
    ◦ Florand Richard
    ◦ Salamatao Ousmane
---
