# 🚀 ROADMAP : KeepAlive Server (Ping & Uptime Monitor)

Plateforme automatisée de ping et de monitoring HTTP/HTTPS pour maintenir en éveil les serveurs déployés gratuitement (Render, Railway, Fly.io, etc.) et éviter les démarrages à froid (*cold starts*).

---

## 🛠️ Stack Technique & Architecture

- **Frontend** : Next.js (App Router, TypeScript, Tailwind CSS, Lucide React, Recharts)
- **Backend** : NestJS (TypeScript, `@nestjs/schedule` / BullMQ, Axios, Passport JWT)
- **Base de Données** : MongoDB (MongoDB Atlas via Mongoose ODM)
- **UI/UX Design** : Neubrutalism (Bordures épaisses `border-4 border-black`, ombres dures `box-shadow: 4px 4px 0px #000`, couleurs néon saturées sur fond crème `#F4F0EA`).

---

## 📅 Roadmap Globale du Projet

[Phase 1] ──► [Phase 2] ──► [Phase 3] ──► [Phase 4] ──► [Phase 5] ──► [Phase 6]
Setup & Env    Auth & DB     Cron Engine   Neubrutalism   Dashboard     Alertes & Deploy

---

## 📋 Jalons & Tâches Détaillées

### 🟢 Phase 1 : Initialisation de l'Environnement & Architecture (J1)
- [ ] **1.1 Structure du Projet (Monorepo ou Repos Séparés)**
  - [ ] Initialiser le dossier racine du projet `keepalive-server`.
  - [ ] Créer le sous-dossier `backend` (NestJS) et `frontend` (Next.js).
- [ ] **1.2 Backend NestJS Initialisation**
  - [ ] Générer l'application NestJS : `nest new backend`.
  - [ ] Installer les dépendances core : `@nestjs/mongoose`, `mongoose`, `@nestjs/config`, `@nestjs/schedule`, `@nestjs/axios`, `axios`, `class-validator`, `class-transformer`.
  - [ ] Configurer les variables d'environnement (`.env.example` et `.env`).
- [ ] **1.3 Cluster MongoDB Atlas**
  - [ ] Configurer la base de données sur MongoDB Atlas.
  - [ ] Tester la connexion Mongoose dans NestJS via `MongooseModule.forRootAsync`.
- [ ] **1.4 Frontend Next.js Initialisation**
  - [ ] Initialiser Next.js : `npx create-next-app@latest frontend --typescript --tailwind --app`.
  - [ ] Installer `lucide-react`, `recharts`, `axios`, `clsx`, `tailwind-merge`.

---

### 🔵 Phase 2 : Backend — Modélisation & Authentification (J2-J3)
- [ ] **2.1 Schemas Mongoose**
  - [ ] `User` : `email`, `passwordHash`, `fullName`, `apiKey`, `role`, `createdAt`.
  - [ ] `Monitor` : `userId`, `name`, `url`, `method`, `intervalMinutes`, `headers`, `body`, `isActive`, `lastStatus`, `lastPingAt`, `lastResponseTimeMs`, `uptimePercentage`.
  - [ ] `PingLog` : `monitorId`, `statusCode`, `responseTimeMs`, `isSuccess`, `errorMessage`, `executedAt`.
  - [ ] `NotificationChannel` : `userId`, `type` (Discord/Slack/Email), `target`, `isEnabled`.
- [ ] **2.2 AuthModule (JWT & API Keys)**
  - [ ] Implémenter le hachage des mots de passe (Bcrypt ou Argon2).
  - [ ] Configurer `PassportModule` et `JwtModule`.
  - [ ] Créer la stratégie JWT (`JwtStrategy`) et les Guards (`JwtAuthGuard`).
  - [ ] Créer les DTOs d'authentification (`RegisterDto`, `LoginDto`).
  - [ ] Implémenter les Endpoints :
    - [ ] `POST /api/v1/auth/register`
    - [ ] `POST /api/v1/auth/login`
    - [ ] `GET /api/v1/auth/me`
    - [ ] `POST /api/v1/auth/api-key` (Régénération de clé d'API)

---

### 🟡 Phase 3 : Backend — Matrice CRUD & Moteur Cron (J4-J5)
- [ ] **3.1 MonitorModule (CRUD)**
  - [ ] Créer `MonitorController` et `MonitorService`.
  - [ ] Implémenter les Endpoints REST :
    - [ ] `POST /api/v1/monitors` (Créer un moniteur)
    - [ ] `GET /api/v1/monitors` (Lister les moniteurs de l'utilisateur)
    - [ ] `GET /api/v1/monitors/:id` (Détails d'un moniteur)
    - [ ] `PATCH /api/v1/monitors/:id` (Mettre à jour)
    - [ ] `DELETE /api/v1/monitors/:id` (Supprimer + nettoyage des logs)
    - [ ] `POST /api/v1/monitors/:id/pause` (Mise en pause / Réactivation)
    - [ ] `POST /api/v1/monitors/:id/ping-now` (Exécution de ping immédiat)
- [ ] **3.2 PingSchedulerService (Moteur Cron)**
  - [ ] Activer `ScheduleModule.forRoot()` dans `AppModule`.
  - [ ] Créer la tâche planifiée récurrente (ex: exécution chaque minute).
  - [ ] Récupérer les moniteurs actifs dont le délai `intervalMinutes` est écoulé.
  - [ ] Exécuter la requête HTTP asynchrone via `HttpService` / Axios.
  - [ ] Calculer le temps de réponse (latence en ms) et intercepter les erreurs HTTP/Timeout.
  - [ ] Enregistrer le résultat dans la collection `PingLog`.
  - [ ] Mettre à jour les champs `lastStatus`, `lastPingAt`, `lastResponseTimeMs` du moniteur.

---

### 🔴 Phase 4 : Frontend — Design System Neubrutaliste (J6-J7)
- [ ] **4.1 Config Tailwind CSS (Neubrutalism)**
  - [ ] Configurer les thèmes de couleurs dans `tailwind.config.js` :
    - Background : `#F4F0EA` (Crème)
    - Primary Yellow : `#FFD166`
    - Success Green : `#A3E635`
    - Error Red : `#FF6B6B`
    - Info Blue : `#4ECDC4`
  - [ ] Configurer les bordures noires épaisses (`border-3`, `border-4`, `border-black`).
  - [ ] Ajouter les ombres dures : `shadow-brutal: 4px 4px 0px 0px #000000`.
- [ ] **4.2 Composants UI de base (Atoms)**
  - [ ] `Button` (effets au survol/clic `active:translate-x-1 active:translate-y-1 active:shadow-none`).
  - [ ] `Card` (fond blanc/couleur avec ombre dure et bordure noire).
  - [ ] `Input` / `Select` (champs Neubrutalistes).
  - [ ] `BadgeStatus` (`UP`, `DOWN`, `PAUSED`, `PENDING`).
  - [ ] `Navbar` & `Sidebar` / Header Neubrutaliste.

---

### 🟣 Phase 5 : Frontend — Dashboard & Intégration API (J8-J9)
- [ ] **5.1 Authentification Frontend**
  - [ ] Page Connexion (`/login`).
  - [ ] Page Inscription (`/register`).
  - [ ] Client HTTP avec intercepteur (Axios/Fetch) pour injecter le token JWT.
- [ ] **5.2 Tableau de Bord (Dashboard)**
  - [ ] Vue d'ensemble des statistiques (Total Moniteurs, Moniteurs `UP`, Moniteurs `DOWN`, Uptime moyen).
  - [ ] Grille / Liste des Moniteurs avec statut en direct.
  - [ ] Modal de création / édition de Moniteur (Nom, URL, Méthode HTTP, Intervalle, Headers JSON).
  - [ ] Bouton d'action "Ping Immédiat" sur chaque moniteur.
- [ ] **5.3 Vue Détaillée d'un Moniteur (`/monitors/[id]`)**
  - [ ] Graphique de latence récents avec `Recharts`.
  - [ ] Table d'historique des pings paginée (`PingLogs`).

---

### 🟤 Phase 6 : Notifications, Polissage & Déploiement (J10)
- [ ] **6.1 Alertes & Webhooks**
  - [ ] Intégration des webhooks Discord / Slack en cas d'échec de ping (`consecutiveFailures >= threshold`).
- [ ] **6.2 Polissage UI/UX**
  - [ ] Gestion des états de chargement (Skeletons / Spinners Neubrutalistes).
  - [ ] Gestion des erreurs API avec notifications Toasts.
- [ ] **6.3 Déploiement**
  - [ ] Déploiement du Backend NestJS sur Render / Railway.
  - [ ] Déploiement du Frontend Next.js sur Vercel.
  - [ ] Configuration des variables d'environnement de production.