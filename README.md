# CNA BACKOFFICE.

## Description du projet

C’est une plateforme de gestion de prépayés qui permet de suivre efficacement les vendeurs, leurs comptes, les services proposés ainsi que les détails des ventes et dépôts. Elle facilite la visualisation des informations clés, comme le solde du vendeur, les commissions, l’historique des transactions et les dépôts bancaires. Avec une interface intuitive et des tableaux de bord adaptés, l’application offre une solution idéale pour les administrateurs et les vendeurs souhaitant gérer et contrôler leurs opérations en toute simplicité.

## Prérequis

- **NodeJS**: 18.20
- **ReactJS**: >= 18
- **NextJS**: 14.0

## Installation

### Cloner le dépôt

```sh
git clone https://gitlab.ngser.com/maposte/module-prepaye-front-end.git
cd module-prepaye
```

### Configuration du projet

1. Installer les dépendances
   ```sh
   npm install
   ```

## Déploiement

### Étapes de déploiement

Utiliser le fichier Dockerfile pour le déploiement.
La commande `npx prisma migrate deploy` est utiliser pour executer les migrations

## Configuration pour le déploiement

Pour déployer l'application dans un environnement de production, vous devrez ajuster les variables d'environnement dans le fichier `.env` pour qu'elles correspondent aux configurations de production.
Utilise comme modèle `.env.example`.

## NB

La commande `npx prisma db seed` dans le dockerfile doit être lancer une seule fois, c'est à dire lors de la création de la base de données.
# backoffice-cnam
