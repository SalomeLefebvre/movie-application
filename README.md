
# 🎬 Movie Application API

Bienvenue sur le dépôt de l'API Movie Application ! Cette API est construite avec Next.js et utilise MongoDB comme base de données, hébergée sur Atlas. Elle est déployée sur Vercel et est accessible via [ce lien](https://movie-application-rosy.vercel.app/api-doc).

## 🚀 Fonctionnalités

- **Next.js** : Framework React pour le rendu côté serveur et les applications statiques.
- **MongoDB Atlas** : Base de données NoSQL hébergée dans le cloud.
- **Vercel** : Plateforme de déploiement pour les applications front-end.
- **Swagger** : Documentation interactive des API pour tester les routes.

## 🌐 Architecture Cloud

- **Frontend** : Hébergé sur Vercel, utilisant Next.js pour le rendu des pages.
- **Backend** : API construite avec Next.js, déployée sur Vercel.
- **Base de données** : MongoDB hébergée sur Atlas, accessible via des requêtes API.

## 🛠️ Installation Locale

Pour lancer l'application localement sans passer par Vercel, suivez ces étapes :

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/votre-utilisateur/movie-application.git
   cd movie-application
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   Créez un fichier `.env.local` à la racine du projet et ajoutez vos variables d'environnement, notamment l'URL de connexion à MongoDB Atlas.

   ```env
   MONGODB_URI="mongodb+srv://{user}:{password}@{url}/?retryWrites=true&w=majority"
   ```

4. **Lancer l'application** :
   ```bash
   npm run dev
   ```

5. **Accéder à l'application** :
   Ouvrez votre navigateur et allez à `http://localhost:3000`.

## 📚 Documentation API

L'API est documentée avec Swagger. Vous pouvez accéder à la documentation interactive et tester les routes via [ce lien](https://movie-application-rosy.vercel.app/api-doc).
