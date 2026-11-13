# Revizz

Une application web interactive de quiz pour réviser les cours de Maths (3e et 2de), Physique (3e) et SVT (2de). Développée en JavaScript vanilla, HTML5 et CSS3, elle a été transformée en **Progressive Web App (PWA)** pour pouvoir être installée et utilisée hors ligne. 

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Version](https://img.shields.io/badge/version-1.1.0-green.svg)

## Fonctionnalités

- **Thèmes variés** : Maths (3e, 2de), Physique (3e) et SVT (2de).
- **Paramètres personnalisables** : Choix du nombre de questions (5, 10 ou 20) et sélection des thèmes.
- **Gestion des états** : Interface dynamique avec des retours visuels immédiats sur les bonnes et mauvaises réponses.
- **Correction détaillée** : Un récapitulatif complet de la partie est disponible à la fin du quiz.
- **Mode hors ligne (PWA)** : Grâce à l'intégration d'un Service Worker, l'application peut fonctionner sans connexion internet et peut être installée directement sur ordinateur ou mobile.
- **Notification de mise à jour (PWA)** : Une bannière informe l'utilisateur quand une nouvelle version de l'application est disponible. Il peut choisir de lancer la mise à jour, suivie d'une rechargement automatique de l'application.
- **Design responsive** : Interface optimisée pour une utilisation fluide sur ordinateur et smartphone.

## Technologies utilisées

- **HTML5**
- **CSS3**
- **JavaScript**

## Utiliser l'application (version en ligne / PWA)

Il est possible d'ouvrir directement l'application sans l'installer en cliquant sur https://polodys.github.io/revizz/.

Mais puisque **Revizz** est une Progressive Web App (PWA), il est aussi possible de l'installer directement (sur ordinateur, smartphone ou tablette) pour y accéder facilement et l'utiliser hors ligne, sans passer par un store d'applications :

1. Cliquer sur ce lien : https://polodys.github.io/revizz/
2. Sur Ordinateur (Chrome) : Cliquer sur l'icône d'installation située dans la barre d'adresse ou ouvrir le menu du navigateur et choisir Caster, enregistrer et partager > Installer Revizz.
3. Sur Mobile (Android) : Utiliser l'option d'installation proposée par le navigateur (sous Chrome : cliquer sur Installer et créer un raccourci dans le menu du navigateur, puis choisir Installer).

## Gestion des mises à jour

Quand une nouvelle version de Revizz est disponible :

1. Le navigateur détecte et installe le Service Worker en arrière-plan.
2. Une fois cette installation terminée, le nouveau Service Worker reste en attente et unebannière informe l'utilisateur qu'une mise à jour est disponible.
3. L'utilisateur clique sur **Mettre à jour** quand il souhaite appliquer la mise à jour.
4. Le nouveau Service Worker est alors activé. Il prend le contrôle de l'application et provoque le rechargement automatique de la page.

Ceci permet à l'utilisateur de choisir quand il souhaite appliquer une mise à jour, sans devoir interrompre sa session en cours.

## Lancer le projet en local (pour le développement)

Étant donné que le projet utilise des **modules JavaScript** (`type="module"`) et un Service Worker, il est recommandé de l'exécuter via un serveur de développement local pour éviter les restrictions de sécurité du navigateur.

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