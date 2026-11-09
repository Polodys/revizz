# Revizz

Une application web interactive de quiz (pour revoir les cours de Maths 3e, Maths 2e, Physique 3e, SVT 2de) conçue en JavaScript vanilla, HTML5 et CSS3. Transformée en **Progressive Web App (PWA)** pour pouvoir être installée et utilisée hors ligne. 

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## Fonctionnalités

- **Thèmes variés** : Maths (3e, 2de), Physique (3e) et SVT (2de).
- **Paramètres personnalisables** : Choix du nombre de questions (5, 10 ou 20) et sélection des thèmes.
- **Gestion des états** : Interface dynamique avec des retours visuels immédiats sur les bonnes et mauvaises réponses.
- **Correction détaillée** : Un récapitulatif complet de la partie est disponible à la fin du quiz.
- **Mode hors ligne (PWA)** : Grâce à l'intégration d'un Service Worker, l'appli peut fonctionner sans connexion internet et peut être installée directement sur ordinateur ou mobile.
- **Design responsive** : Optimisé pour une utilisation fluide sur ordinateur et smartphone.

## Technologies utilisées

- **HTML5**
- **CSS3**
- **JavaScript**

## Utiliser l'application (version en ligne / PWA)

Il est possible d'ouvrir directement l'application sans l'installer en cliquant sur https://polodys.github.io/revizz/.

Mais puisque **Revizz** est une Progressive Web App (PWA), il est aussi possible de l'installer directement (sur ordinateur, smartphone ou tablette) pour y accéder facilement et l'utiliser hors ligne, sans passer par un store d'applications :

1. Cliquer sur le lien déployé par **GitHub Pages** : https://polodys.github.io/revizz/
2. Sur Ordinateur (Chrome) : Cliquer sur l'icône d'installation située dans la barre d'adresse (un petit écran avec une flèche vers le bas), ou ouvrir le menu du navigateur et choisir Caster, enregistrer et partager > Installer Revizz.
3. Sur Mobile (Android) : Cliquer sur Installer et créer un raccourci dans le menu du navigateur (Chrome), puis choisir Installer.

## Lancer le projet en local (pour le développement)

Étant donné que le projet utilise des **modules JavaScript** (`type="module"`), il est recommandé de l'exécuter via un serveur de développement local pour éviter les restrictions de sécurité du navigateur.

1. Cloner le dépôt :
```bash
git clone https://github.com/Polodys/revizz.git
```
2. Ouvrir le dossier du projet dans VSCode.
3. Lancer le projet à l'aide de l'extension Live Server (clic droit sur `index.html` > *Open with Live Server*), ou via un outil en ligne de commande comme `npx serve` à la racine du projet.

## Licence

Ce projet est concédé sous licence selon les termes de la licence MIT  - voir le fichier [LICENSE](LICENSE).

---

Made with ❤ by [Polodys](https://github.com/Polodys)