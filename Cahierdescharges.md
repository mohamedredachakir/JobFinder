# 📋 CAHIER DES CHARGES — JobFinder
### Application de Recherche d'Emplois Multi-Sources

---

> **Version :** 1.0  
> **Date :** Avril 2026  
> **Statut :** Document de référence  
> **Stack :** Java 8 · Angular · Swagger (OpenAPI)

---

## TABLE DES MATIÈRES

1. [Présentation du Projet](#1-présentation-du-projet)
2. [Contexte et Problématique](#2-contexte-et-problématique)
3. [Objectifs](#3-objectifs)
4. [Périmètre Fonctionnel](#4-périmètre-fonctionnel)
5. [Acteurs et Cas d'Usage](#5-acteurs-et-cas-dusage)
6. [Spécifications Fonctionnelles](#6-spécifications-fonctionnelles)
7. [Spécifications Techniques](#7-spécifications-techniques)
8. [Architecture du Système](#8-architecture-du-système)
9. [API Publiques Intégrées](#9-api-publiques-intégrées)
10. [Modèle de Données](#10-modèle-de-données)
11. [Interfaces Utilisateur (UI/UX)](#11-interfaces-utilisateur-uiux)
12. [Sécurité](#12-sécurité)
13. [Performance et Scalabilité](#13-performance-et-scalabilité)
14. [Tests et Qualité](#14-tests-et-qualité)
15. [Documentation Swagger / OpenAPI](#15-documentation-swagger--openapi)
16. [Planning et Livrables](#16-planning-et-livrables)
17. [Contraintes et Risques](#17-contraintes-et-risques)
18. [Glossaire](#18-glossaire)

---

## 1. Présentation du Projet

### 1.1 Identification

| Champ              | Valeur                                      |
|--------------------|---------------------------------------------|
| **Nom du projet**  | JobFinder                                   |
| **Type**           | Application Web Full Stack                  |
| **Domaine**        | Emploi & Recrutement                        |
| **Technologie**    | Java 8 (Spring Boot) · Angular · Swagger    |
| **Nature**         | Agrégateur d'offres d'emploi multi-sources  |

### 1.2 Résumé Exécutif

**JobFinder** est une application web qui agrège et centralise des offres d'emploi provenant de plusieurs sources internationales (APIs publiques). Elle offre aux chercheurs d'emploi une interface unifiée pour rechercher, filtrer, sauvegarder et postuler à des offres issues de différentes plateformes telles que Indeed, Adzuna, JSearch, The Muse, etc.

L'objectif principal est de **réduire le temps de recherche d'emploi** en consolidant toutes les offres en un seul endroit, tout en offrant des outils de filtrage avancés, d'alertes et de suivi de candidatures.

---

## 2. Contexte et Problématique

### 2.1 Contexte

Le marché de l'emploi est fragmenté : les offres sont dispersées sur des dizaines de plateformes (LinkedIn, Indeed, Glassdoor, Monster, etc.). Les chercheurs d'emploi doivent consulter plusieurs sites individuellement, ce qui est chronophage et inefficace.

### 2.2 Problématique

- **Fragmentation** : les offres sont réparties sur plusieurs plateformes
- **Duplication** : une même offre peut apparaître sur plusieurs sites
- **Perte de temps** : navigation répétitive entre différents sites
- **Absence de centralisation** : aucun historique unifié ni suivi de candidatures

### 2.3 Solution Proposée

JobFinder résout ces problèmes en :
- Agrégeant les offres via plusieurs APIs publiques
- Déduplicant et normalisant les données
- Offrant une interface unique de recherche et de filtrage
- Permettant le suivi des candidatures et la configuration d'alertes

---

## 3. Objectifs

### 3.1 Objectifs Fonctionnels

- ✅ Permettre aux utilisateurs de **rechercher des offres d'emploi** issues de plusieurs sources
- ✅ Offrir un **système de filtres avancés** (localisation, secteur, salaire, type de contrat, etc.)
- ✅ Permettre la **sauvegarde des offres favorites**
- ✅ Gérer un **tableau de bord de suivi des candidatures**
- ✅ Configurer des **alertes emploi** personnalisées
- ✅ Afficher les **détails complets** de chaque offre

### 3.2 Objectifs Techniques

- ✅ Développer un **backend robuste** avec Java 8 / Spring Boot
- ✅ Construire un **frontend moderne** avec Angular
- ✅ Exposer et documenter toutes les APIs avec **Swagger / OpenAPI 3**
- ✅ Intégrer au moins **2 APIs d'emploi publiques internationales**
- ✅ Garantir un temps de réponse inférieur à **2 secondes** pour les recherches

### 3.3 Objectifs Métier

- ✅ Augmenter l'efficacité des chercheurs d'emploi
- ✅ Proposer une interface intuitive et responsive
- ✅ Construire une base évolutive pour futures intégrations

---

## 4. Périmètre Fonctionnel

### 4.1 Dans le Périmètre (In Scope)

| Module                   | Description                                                   |
|--------------------------|---------------------------------------------------------------|
| Authentification         | Inscription, connexion, gestion de profil                     |
| Recherche d'offres       | Recherche par mot-clé, localisation, catégorie                |
| Filtrage avancé          | Salaire, type de contrat, expérience, date, télétravail       |
| Détail d'une offre       | Affichage complet des détails, lien vers l'offre source       |
| Favoris                  | Sauvegarde et gestion des offres favorites                    |
| Suivi des candidatures   | Pipeline Kanban : Postulé > Entretien > Offre > Refusé        |
| Alertes emploi           | Notifications par email sur critères définis                  |
| Dashboard utilisateur    | Vue synthétique de l'activité de recherche                    |
| API REST documentée      | Endpoints documentés via Swagger UI                           |
| Intégration APIs externes | Indeed / Adzuna / JSearch / The Muse                         |

### 4.2 Hors Périmètre (Out of Scope)

- Paiement / abonnements premium
- Messagerie directe avec les recruteurs
- Création d'offres d'emploi par des recruteurs
- Application mobile native (iOS / Android)
- Intelligence artificielle de matching

---

## 5. Acteurs et Cas d'Usage

### 5.1 Acteurs Identifiés

| Acteur              | Rôle                                                                |
|---------------------|---------------------------------------------------------------------|
| **Visiteur**        | Utilisateur non connecté, accès limité à la recherche              |
| **Chercheur d'emploi** | Utilisateur inscrit avec accès complet                         |
| **Administrateur**  | Gestion des utilisateurs, monitoring, configuration des APIs       |
| **Système externe** | APIs tierces (Adzuna, JSearch, The Muse, etc.)                     |

### 5.2 Cas d'Usage Principaux

```
[Visiteur]
  ├── Rechercher des offres d'emploi
  ├── Filtrer les résultats
  ├── Voir le détail d'une offre
  └── S'inscrire / Se connecter

[Chercheur d'emploi]
  ├── Tous les cas du Visiteur
  ├── Sauvegarder une offre en favoris
  ├── Gérer ses candidatures (pipeline)
  ├── Configurer des alertes emploi
  ├── Gérer son profil
  └── Exporter ses candidatures (CSV)

[Administrateur]
  ├── Gérer les utilisateurs
  ├── Monitorer les appels aux APIs
  ├── Configurer les sources d'emploi
  └── Accéder aux statistiques d'usage
```

---

## 6. Spécifications Fonctionnelles

### 6.1 Module Authentification

#### 6.1.1 Inscription

- L'utilisateur renseigne : prénom, nom, email, mot de passe
- Validation du format email et de la complexité du mot de passe (min 8 caractères, 1 majuscule, 1 chiffre)
- Confirmation par email (lien d'activation)
- En cas d'email déjà existant → message d'erreur clair

#### 6.1.2 Connexion

- Authentification via email + mot de passe
- Option "Se souvenir de moi" (token persistant 30 jours)
- Réinitialisation du mot de passe par email
- Gestion des tentatives échouées (blocage après 5 tentatives)

#### 6.1.3 Gestion du Profil

- Modification des informations personnelles
- Upload de CV (PDF, max 5 Mo)
- Renseignement de préférences : secteur, localisation préférée, type de contrat, salaire souhaité
- Suppression du compte

---

### 6.2 Module Recherche d'Offres

#### 6.2.1 Barre de Recherche Principale

- Champ de recherche par **mot-clé** (titre de poste, compétence, entreprise)
- Champ **localisation** (ville, pays, "remote")
- Bouton de recherche et raccourci clavier (Entrée)
- Auto-complétion sur les mots-clés les plus recherchés

#### 6.2.2 Filtres Avancés

| Filtre              | Type                 | Valeurs possibles                          |
|---------------------|----------------------|--------------------------------------------|
| Type de contrat     | Checkbox multiple    | CDI, CDD, Freelance, Stage, Alternance     |
| Expérience requise  | Slider               | 0-1 an, 1-3 ans, 3-5 ans, +5 ans          |
| Salaire minimum     | Range slider         | Montant en devise locale / annuel          |
| Date de publication | Dropdown             | Aujourd'hui, 3 jours, 1 semaine, 1 mois   |
| Télétravail         | Toggle               | Oui / Non / Hybride                        |
| Secteur d'activité  | Dropdown multiple    | IT, Finance, Santé, Marketing, etc.        |
| Source              | Checkbox multiple    | Indeed, Adzuna, JSearch, The Muse          |

#### 6.2.3 Résultats de Recherche

- Affichage en liste avec pagination (20 résultats par page)
- Tri : Pertinence, Date, Salaire (croissant/décroissant)
- Chaque carte affiche : logo entreprise, titre, entreprise, lieu, salaire (si disponible), date, source
- Indicateur de nouvelles offres (badge "Nouveau")
- Bouton "Sauvegarder" accessible directement depuis la carte

---

### 6.3 Module Détail d'une Offre

- Affichage complet : titre, entreprise, localisation, type de contrat, salaire, description complète
- Compétences requises (tags)
- Date de publication et date limite si disponible
- Bouton "Postuler" (redirige vers la source originale)
- Bouton "Sauvegarder en favoris"
- Bouton "Partager" (copier le lien)
- Offres similaires recommandées (même titre / localisation)

---

### 6.4 Module Favoris

- Liste des offres sauvegardées avec statut (Active / Expirée)
- Suppression individuelle ou en masse
- Tri et filtrage des favoris
- Export CSV des favoris

---

### 6.5 Module Suivi des Candidatures

Pipeline Kanban avec les colonnes suivantes :

```
[ Sauvegardée ] → [ Postulée ] → [ Entretien ] → [ Offre Reçue ] → [ Acceptée / Refusée ]
```

- Drag & Drop entre les colonnes
- Ajout de notes sur chaque candidature
- Date de candidature et date du prochain entretien
- Rappels / alertes (J-1 avant entretien)
- Statistiques : taux de réponse, temps moyen de traitement

---

### 6.6 Module Alertes Emploi

- Création d'alertes avec critères : mot-clé, localisation, type de contrat, salaire
- Fréquence : Immédiate, Quotidienne, Hebdomadaire
- Notification par email
- Gestion (activation/désactivation/suppression) des alertes

---

### 6.7 Module Dashboard Utilisateur

- Résumé de l'activité : nombre d'offres vues, candidatures en cours, entretiens planifiés
- Graphique : offres postulées par semaine / mois
- Recommandations basées sur les recherches récentes
- Dernières offres correspondant aux alertes configurées

---

## 7. Spécifications Techniques

### 7.1 Stack Technologique

#### Backend

| Composant              | Technologie / Version              |
|------------------------|------------------------------------|
| Langage                | Java 8                             |
| Framework principal    | Spring Boot 2.7.x                  |
| API REST               | Spring MVC                         |
| Sécurité               | Spring Security + JWT              |
| ORM / Persistance      | Spring Data JPA + Hibernate 5      |
| Base de données        | PostgreSQL 14                      |
| Cache                  | Redis (cache des résultats API)    |
| Gestion des dépendances| Maven 3.8                          |
| Documentation API      | Springfox Swagger 3 / OpenAPI 3    |
| Client HTTP            | RestTemplate / Feign Client        |
| Scheduler              | Spring @Scheduled (alertes)        |
| Email                  | Spring Mail + JavaMailSender       |

#### Frontend

| Composant              | Technologie / Version              |
|------------------------|------------------------------------|
| Framework              | Angular 16+                        |
| Langage                | TypeScript 5                       |
| UI Component Library   | Angular Material / PrimeNG         |
| State Management       | NgRx (si complexité justifiée)     |
| HTTP Client            | Angular HttpClient                 |
| Routing                | Angular Router                     |
| Formulaires            | Reactive Forms                     |
| CSS                    | SCSS / Tailwind CSS                |
| Charts                 | Chart.js / ngx-charts              |
| Drag & Drop (Kanban)   | @angular/cdk/drag-drop             |

#### Infrastructure & DevOps

| Composant              | Technologie                        |
|------------------------|------------------------------------|
| Conteneurisation       | Docker + Docker Compose            |
| Serveur Web            | Nginx (reverse proxy Angular)      |
| CI/CD                  | GitHub Actions                     |
| Gestion des secrets    | Variables d'environnement (.env)   |
| Versioning             | Git + GitHub                       |

---

### 7.2 Contraintes Techniques

- Java 8 obligatoire (compatibilité avec l'environnement cible)
- Application accessible sur les navigateurs modernes (Chrome, Firefox, Edge, Safari)
- Interface responsive : Mobile, Tablette, Desktop
- Toutes les APIs exposées documentées via Swagger UI
- Architecture REST respectant les principes HATEOAS
- Pagination systématique sur les endpoints retournant des listes
- Gestion centralisée des erreurs (GlobalExceptionHandler)

---

## 8. Architecture du Système

### 8.1 Architecture Globale (3-Tiers)

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Navigateur)                      │
│                  Angular SPA (Port 4200)                     │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS / REST JSON
┌───────────────────────────▼─────────────────────────────────┐
│                  BACKEND (Spring Boot API)                    │
│                      Port 8080                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Controller Layer  →  Service Layer  →  Repository     │  │
│  │       (REST)            (Business)       (JPA)         │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ Spring Sec   │  │ Swagger UI   │  │  Scheduler (Jobs)  │  │
│  │ (JWT Auth)   │  │ /swagger-ui  │  │  (Email Alertes)   │  │
│  └──────────────┘  └──────────────┘  └────────────────────┘  │
└──────┬──────────────────┬───────────────────────────────────┘
       │                  │
┌──────▼──────┐    ┌──────▼───────────────────────────────────┐
│  PostgreSQL  │    │         APIs Externes (HTTP)              │
│  (Port 5432) │    │  Indeed · Adzuna · JSearch · The Muse    │
└─────────────┘    └──────────────────────────────────────────┘
       │
┌──────▼──────┐
│    Redis     │
│  (Cache)     │
└─────────────┘
```

### 8.2 Architecture Backend (Couches)

```
com.jobfinder
├── config/              # Configuration Spring (Security, Swagger, CORS, Redis)
├── controller/          # Endpoints REST
│   ├── AuthController
│   ├── JobController
│   ├── FavoriteController
│   ├── ApplicationController
│   ├── AlertController
│   └── UserController
├── service/             # Logique métier
│   ├── JobAggregatorService
│   ├── ExternalApiService
│   ├── UserService
│   └── AlertService
├── repository/          # Accès BDD (JPA Repositories)
├── model/               # Entités JPA
│   ├── User
│   ├── Job
│   ├── Favorite
│   ├── Application
│   └── Alert
├── dto/                 # Data Transfer Objects (Request/Response)
├── mapper/              # MapStruct mappers (Entity ↔ DTO)
├── exception/           # Exceptions custom + GlobalExceptionHandler
├── integration/         # Clients APIs externes
│   ├── AdzunaClient
│   ├── JSearchClient
│   └── TheMuseClient
└── scheduler/           # Jobs planifiés (alertes, nettoyage cache)
```

### 8.3 Architecture Frontend (Angular)

```
src/app/
├── core/                # Services singleton, Guards, Interceptors
│   ├── auth/
│   ├── interceptors/
│   └── guards/
├── shared/              # Composants réutilisables, pipes, directives
│   ├── components/
│   ├── pipes/
│   └── models/
├── features/            # Modules fonctionnels (Lazy Loading)
│   ├── auth/            # Login, Register, Profile
│   ├── jobs/            # Search, List, Detail
│   ├── favorites/       # Favoris
│   ├── applications/    # Suivi candidatures (Kanban)
│   ├── alerts/          # Alertes emploi
│   └── dashboard/       # Dashboard
└── app-routing.module.ts
```

---

## 9. API Publiques Intégrées

### 9.1 Tableau des APIs

| API         | Description                              | Auth          | Limite gratuite      | Lien              |
|-------------|------------------------------------------|---------------|----------------------|-------------------|
| **Adzuna**  | Offres internationales, données salariales| API Key       | 250 req/jour         | api.adzuna.com    |
| **JSearch** | Indeed + LinkedIn via RapidAPI           | RapidAPI Key  | 500 req/mois         | rapidapi.com      |
| **The Muse**| Entreprises & culture, offres USA/Monde  | API Key (opt.)| Illimité (anonyme)   | themuse.com/api   |
| **Remotive** | Emplois remote uniquement               | Aucune        | Illimité             | remotive.com/api  |

### 9.2 Stratégie d'Agrégation

```
1. L'utilisateur lance une recherche
2. Le JobAggregatorService appelle les APIs en PARALLÈLE (CompletableFuture)
3. Les résultats sont normalisés vers un modèle JobDTO commun
4. Déduplication par (titre + entreprise + localisation)
5. Mise en cache Redis (TTL : 10 minutes)
6. Tri et pagination avant retour au frontend
```

### 9.3 Modèle Normalisé (JobDTO)

```java
public class JobDTO {
    private String id;               // ID unique généré
    private String sourceId;         // ID original dans la source
    private String source;           // "ADZUNA" | "JSEARCH" | "THEMUSE"
    private String title;            // Titre du poste
    private String company;          // Nom de l'entreprise
    private String location;         // Localisation
    private String country;          // Pays
    private Boolean remote;          // Télétravail
    private String contractType;     // CDI, CDD, Freelance...
    private String description;      // Description complète
    private Double salaryMin;        // Salaire minimum
    private Double salaryMax;        // Salaire maximum
    private String salaryCurrency;   // Devise
    private String category;         // Secteur d'activité
    private List<String> tags;       // Compétences / Technologies
    private String applyUrl;         // Lien pour postuler
    private String logoUrl;          // Logo de l'entreprise
    private LocalDateTime postedAt;  // Date de publication
    private LocalDateTime expiresAt; // Date d'expiration
}
```

---

## 10. Modèle de Données

### 10.1 Entités Principales

#### Table `users`

| Colonne           | Type           | Contrainte             |
|-------------------|----------------|------------------------|
| id                | BIGSERIAL      | PRIMARY KEY            |
| first_name        | VARCHAR(100)   | NOT NULL               |
| last_name         | VARCHAR(100)   | NOT NULL               |
| email             | VARCHAR(255)   | UNIQUE, NOT NULL       |
| password_hash     | VARCHAR(255)   | NOT NULL               |
| role              | VARCHAR(20)    | DEFAULT 'USER'         |
| is_active         | BOOLEAN        | DEFAULT FALSE          |
| cv_url            | VARCHAR(500)   |                        |
| preferred_location| VARCHAR(255)   |                        |
| preferred_sector  | VARCHAR(255)   |                        |
| preferred_salary  | NUMERIC(10,2)  |                        |
| created_at        | TIMESTAMP      | DEFAULT NOW()          |
| updated_at        | TIMESTAMP      |                        |

#### Table `favorites`

| Colonne    | Type        | Contrainte                    |
|------------|-------------|-------------------------------|
| id         | BIGSERIAL   | PRIMARY KEY                   |
| user_id    | BIGINT      | FK → users(id)                |
| job_id     | VARCHAR(255)| NOT NULL (ID externe)         |
| job_data   | JSONB       | Snapshot complet de l'offre   |
| saved_at   | TIMESTAMP   | DEFAULT NOW()                 |

#### Table `applications`

| Colonne        | Type         | Contrainte                          |
|----------------|--------------|-------------------------------------|
| id             | BIGSERIAL    | PRIMARY KEY                         |
| user_id        | BIGINT       | FK → users(id)                      |
| job_id         | VARCHAR(255) | NOT NULL                            |
| job_data       | JSONB        | Snapshot de l'offre au moment de candidature |
| status         | VARCHAR(50)  | SAVED / APPLIED / INTERVIEW / OFFER / ACCEPTED / REJECTED |
| notes          | TEXT         |                                     |
| applied_at     | TIMESTAMP    |                                     |
| interview_date | TIMESTAMP    |                                     |
| updated_at     | TIMESTAMP    |                                     |

#### Table `alerts`

| Colonne        | Type         | Contrainte          |
|----------------|--------------|---------------------|
| id             | BIGSERIAL    | PRIMARY KEY         |
| user_id        | BIGINT       | FK → users(id)      |
| keywords       | VARCHAR(500) | NOT NULL            |
| location       | VARCHAR(255) |                     |
| contract_type  | VARCHAR(100) |                     |
| min_salary     | NUMERIC(10,2)|                     |
| frequency      | VARCHAR(20)  | IMMEDIATE/DAILY/WEEKLY |
| is_active      | BOOLEAN      | DEFAULT TRUE        |
| last_sent_at   | TIMESTAMP    |                     |
| created_at     | TIMESTAMP    | DEFAULT NOW()       |

---

## 11. Interfaces Utilisateur (UI/UX)

### 11.1 Principes de Design

- **Design System** : Angular Material avec thème personnalisé JobFinder
- **Palette de couleurs** :
  - Primaire : `#2563EB` (Bleu professionnel)
  - Secondaire : `#10B981` (Vert succès)
  - Fond : `#F8FAFC`
  - Texte : `#1E293B`
- **Typographie** : Police principale Inter / Roboto
- **Responsive** : Mobile-first (Breakpoints : 375px, 768px, 1024px, 1440px)
- **Accessibilité** : WCAG 2.1 AA

### 11.2 Pages Principales

| Page               | Route                    | Accès          |
|--------------------|--------------------------|----------------|
| Accueil / Landing  | `/`                      | Public         |
| Recherche          | `/jobs`                  | Public         |
| Détail d'une offre | `/jobs/:id`              | Public         |
| Connexion          | `/auth/login`            | Public         |
| Inscription        | `/auth/register`         | Public         |
| Dashboard          | `/dashboard`             | Authentifié    |
| Favoris            | `/favorites`             | Authentifié    |
| Candidatures       | `/applications`          | Authentifié    |
| Alertes            | `/alerts`                | Authentifié    |
| Profil             | `/profile`               | Authentifié    |
| Admin              | `/admin`                 | Admin          |

### 11.3 Wireframes Conceptuels

#### Page Recherche

```
┌──────────────────────────────────────────────────────────────┐
│  LOGO JobFinder          [Connexion]  [S'inscrire]           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   [ 🔍 Titre / Compétence ]   [ 📍 Localisation ]  [Chercher]│
│                                                              │
├─────────────────────┬────────────────────────────────────────┤
│  FILTRES (Sidebar)  │  RÉSULTATS (20 offres)                 │
│                     │                                        │
│  Type de contrat    │  ┌────────────────────────────────┐   │
│  ☑ CDI              │  │ [Logo] Développeur Java Senior  │   │
│  ☑ CDD              │  │ Google · Paris · 💰 60k-80k€   │   │
│  ☐ Freelance        │  │ Publié il y a 2 jours · Adzuna │   │
│                     │  │              [Voir] [♡ Sauver]  │   │
│  Expérience         │  └────────────────────────────────┘   │
│  ○ Junior (0-2 ans) │                                        │
│  ● Mid (2-5 ans)    │  ┌────────────────────────────────┐   │
│  ○ Senior (5+ ans)  │  │ [Logo] Angular Developer       │   │
│                     │  │ Airbus · Toulouse · 🌐 Remote  │   │
│  Salaire minimum    │  │ Publié aujourd'hui · JSearch   │   │
│  [====|======] 40k€ │  │              [Voir] [♡ Sauver]  │   │
│                     │  └────────────────────────────────┘   │
│  Télétravail        │                                        │
│  ○ Oui ● Non ○ Hybr │  [  ← Prev  ] Page 1/5  [ Next →  ]  │
│                     │                                        │
└─────────────────────┴────────────────────────────────────────┘
```

---

## 12. Sécurité

### 12.1 Authentification & Autorisation

- **JWT (JSON Web Token)** : Access Token (15 min) + Refresh Token (7 jours)
- Stockage JWT côté client : HttpOnly Cookie ou LocalStorage (avec XSS protection)
- Contrôle d'accès basé sur les rôles : `ROLE_USER`, `ROLE_ADMIN`
- Annotations Spring Security : `@PreAuthorize("hasRole('ADMIN')")`

### 12.2 Protection des APIs

- **Rate Limiting** : 100 requêtes/minute par IP (Spring + Bucket4j)
- **CORS** : Configuration stricte (origines autorisées uniquement)
- **Validation des inputs** : Bean Validation (@Valid, @NotBlank, @Email...)
- **SQL Injection** : Prévention via JPA/Hibernate (requêtes paramétrées)
- **CSRF** : Protection activée pour les routes sensibles

### 12.3 Sécurité des Clés API Externes

- Les clés API des services tiers sont stockées dans les variables d'environnement
- Aucune clé API ne doit apparaître dans le code source ou dans Git
- Utilisation d'un fichier `.env` (gitignored) et `application.properties` profil

### 12.4 Données Sensibles

- Hashage des mots de passe : **BCrypt** (strength factor 12)
- Chiffrement des données sensibles en base si nécessaire
- Logs : aucun log de mot de passe ou token JWT

---

## 13. Performance et Scalabilité

### 13.1 Caching

| Niveau     | Technologie | TTL          | Données cachées                        |
|------------|-------------|--------------|----------------------------------------|
| Résultats  | Redis       | 10 minutes   | Résultats de recherche par paramètres  |
| Profil     | Redis       | 30 minutes   | Données utilisateur fréquemment lues   |
| API Ext.   | Redis       | 5 minutes    | Réponses des APIs externes             |

### 13.2 Optimisations Backend

- Appels aux APIs externes en **parallèle** (CompletableFuture / ExecutorService)
- Pagination systématique (max 50 résultats par appel)
- Indexation PostgreSQL sur : `user_id`, `email`, `status`, `created_at`
- Connection pooling : HikariCP (max 20 connexions)

### 13.3 Optimisations Frontend

- Lazy Loading des modules Angular
- OnPush Change Detection Strategy
- Virtual Scrolling pour les longues listes
- Mise en cache HTTP (Angular HttpClient + ETag)
- Bundle optimization : Tree Shaking, AOT Compilation

### 13.4 Objectifs de Performance

| Métrique                         | Objectif    |
|----------------------------------|-------------|
| Temps de réponse API (p95)       | < 2 secondes|
| Temps de chargement initial (SPA)| < 3 secondes|
| Score Lighthouse Performance     | > 80        |
| Disponibilité                    | > 99%       |

---

## 14. Tests et Qualité

### 14.1 Stratégie de Tests

#### Backend

| Type de test         | Framework              | Couverture cible |
|----------------------|------------------------|------------------|
| Tests unitaires      | JUnit 5 + Mockito      | > 70%            |
| Tests d'intégration  | Spring Boot Test       | Endpoints critiques |
| Tests API            | RestAssured / MockMvc  | Tous les endpoints |
| Tests de charge      | JMeter                 | Scénarios clés   |

#### Frontend

| Type de test         | Framework              | Couverture cible |
|----------------------|------------------------|------------------|
| Tests unitaires      | Jasmine + Karma        | Services et pipes |
| Tests composants     | Angular Testing Library| Composants clés  |
| Tests E2E            | Cypress                | Parcours critiques|

### 14.2 Qualité du Code

- **Backend** : Checkstyle + PMD + SonarQube
- **Frontend** : ESLint + Prettier + SonarQube
- **Code Review** : Pull Requests obligatoires (min 1 reviewer)
- **Git Flow** : `main` → `develop` → `feature/*` / `fix/*`

### 14.3 Scénarios de Test Critiques

1. Recherche multi-source et agrégation des résultats
2. Authentification JWT (connexion, expiration, refresh)
3. Sauvegarde et récupération des favoris
4. Transition des statuts dans le Kanban de candidatures
5. Envoi d'alertes email (scheduler)
6. Gestion des erreurs API externes (timeout, 429, 503)
7. Déduplication des offres

---

## 15. Documentation Swagger / OpenAPI

### 15.1 Configuration Springfox

```java
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.OAS_30)
            .select()
            .apis(RequestHandlerSelectors.basePackage("com.jobfinder.controller"))
            .paths(PathSelectors.any())
            .build()
            .apiInfo(apiInfo())
            .securitySchemes(Arrays.asList(apiKey()))
            .securityContexts(Arrays.asList(securityContext()));
    }
}
```

### 15.2 Endpoints Documentés

#### Auth
| Méthode | Endpoint                    | Description                |
|---------|-----------------------------|----------------------------|
| POST    | `/api/auth/register`        | Inscription utilisateur     |
| POST    | `/api/auth/login`           | Connexion + JWT             |
| POST    | `/api/auth/refresh`         | Rafraîchir le token         |
| POST    | `/api/auth/logout`          | Déconnexion                 |
| POST    | `/api/auth/reset-password`  | Réinitialisation mdp        |

#### Jobs
| Méthode | Endpoint                    | Description                |
|---------|-----------------------------|----------------------------|
| GET     | `/api/jobs`                 | Recherche avec filtres      |
| GET     | `/api/jobs/{id}`            | Détail d'une offre          |
| GET     | `/api/jobs/sources`         | Sources disponibles         |

#### Favorites
| Méthode | Endpoint                    | Description                |
|---------|-----------------------------|----------------------------|
| GET     | `/api/favorites`            | Liste des favoris           |
| POST    | `/api/favorites`            | Ajouter un favori           |
| DELETE  | `/api/favorites/{id}`       | Supprimer un favori         |

#### Applications
| Méthode | Endpoint                        | Description              |
|---------|---------------------------------|--------------------------|
| GET     | `/api/applications`             | Liste des candidatures    |
| POST    | `/api/applications`             | Créer une candidature     |
| PUT     | `/api/applications/{id}/status` | Changer le statut         |
| PUT     | `/api/applications/{id}/notes`  | Ajouter des notes         |
| DELETE  | `/api/applications/{id}`        | Supprimer                 |

#### Alerts
| Méthode | Endpoint                    | Description                |
|---------|-----------------------------|----------------------------|
| GET     | `/api/alerts`               | Liste des alertes           |
| POST    | `/api/alerts`               | Créer une alerte            |
| PUT     | `/api/alerts/{id}`          | Modifier une alerte         |
| DELETE  | `/api/alerts/{id}`          | Supprimer une alerte        |

#### Users
| Méthode | Endpoint                    | Description                |
|---------|-----------------------------|----------------------------|
| GET     | `/api/users/me`             | Profil de l'utilisateur     |
| PUT     | `/api/users/me`             | Modifier le profil          |
| POST    | `/api/users/me/cv`          | Upload CV                   |
| DELETE  | `/api/users/me`             | Supprimer le compte         |

### 15.3 Accès Swagger UI

```
URL : http://localhost:8080/swagger-ui/index.html
API Docs JSON : http://localhost:8080/v3/api-docs
```

---

## 16. Planning et Livrables

### 16.1 Découpage en Sprints (Agile / Scrum)

| Sprint   | Durée  | Objectifs                                                     |
|----------|--------|---------------------------------------------------------------|
| Sprint 0 | 1 sem  | Setup projet, architecture, configuration CI/CD, Docker       |
| Sprint 1 | 2 sem  | Authentification (Backend + Frontend), JWT, Swagger de base   |
| Sprint 2 | 2 sem  | Intégration APIs externes, modèle Job, recherche basique      |
| Sprint 3 | 2 sem  | Filtres avancés, pagination, cache Redis, déduplication       |
| Sprint 4 | 2 sem  | Module Favoris + Candidatures (Kanban)                        |
| Sprint 5 | 2 sem  | Module Alertes + Dashboard + Scheduler email                  |
| Sprint 6 | 1 sem  | Tests complets, corrections de bugs, optimisations            |
| Sprint 7 | 1 sem  | Documentation finale, Swagger complet, déploiement            |

**Durée totale estimée : 13 semaines**

### 16.2 Livrables

| Livrable                        | Sprint | Format                       |
|---------------------------------|--------|------------------------------|
| Document d'architecture         | 0      | PDF / Markdown               |
| Code source Backend             | 1-6    | GitHub Repository            |
| Code source Frontend            | 1-6    | GitHub Repository            |
| Documentation API Swagger       | 1-7    | Swagger UI + JSON            |
| Scripts SQL (DDL + données test)| 1      | .sql                         |
| Docker Compose complet          | 0-7    | docker-compose.yml           |
| Rapport de tests                | 6      | PDF                          |
| Manuel utilisateur              | 7      | PDF / Markdown               |
| Présentation finale             | 7      | PowerPoint / PDF             |

---

## 17. Contraintes et Risques

### 17.1 Contraintes

| Contrainte           | Description                                      |
|----------------------|--------------------------------------------------|
| **Technique**        | Java 8 imposé (pas de Java 11+)                  |
| **APIs gratuites**   | Quotas limités sur les APIs publiques gratuites  |
| **Budget**           | Utilisation exclusive d'APIs et outils gratuits  |
| **Délai**            | Contraintes académiques de rendu                 |
| **RGPD**             | Conformité sur les données personnelles des utilisateurs |

### 17.2 Risques Identifiés

| Risque                           | Probabilité | Impact | Mitigation                               |
|----------------------------------|-------------|--------|------------------------------------------|
| API externe indisponible         | Moyen       | Haut   | Fallback, cache, multi-sources           |
| Dépassement quota API gratuite   | Haut        | Moyen  | Cache Redis, rotation de clés, mock local|
| Déduplication imparfaite         | Moyen       | Faible | Algorithme de similarité + hashing       |
| Délai de développement           | Moyen       | Haut   | Priorisation MVP, sprints bien définis   |
| Problème de compatibilité Java 8 | Faible      | Moyen  | Tests dès le Sprint 0, éviter Java 9+    |

---

## 18. Glossaire

| Terme          | Définition                                                                 |
|----------------|----------------------------------------------------------------------------|
| **API**        | Application Programming Interface — interface de communication entre systèmes |
| **JWT**        | JSON Web Token — standard de token d'authentification                      |
| **SPA**        | Single Page Application — application web à page unique (Angular)          |
| **ORM**        | Object-Relational Mapping — correspondance objet-relationnel (Hibernate)    |
| **DTO**        | Data Transfer Object — objet de transfert de données entre couches          |
| **CORS**       | Cross-Origin Resource Sharing — politique d'accès cross-domaine             |
| **TTL**        | Time To Live — durée de vie d'un élément en cache                          |
| **Kanban**     | Méthode visuelle de gestion du workflow par colonnes                       |
| **OpenAPI**    | Spécification standard pour la description d'APIs REST (anciennement Swagger) |
| **RGPD**       | Règlement Général sur la Protection des Données (EU)                       |
| **CDI**        | Contrat à Durée Indéterminée                                               |
| **CDD**        | Contrat à Durée Déterminée                                                 |
| **MVP**        | Minimum Viable Product — version minimale fonctionnelle du produit          |

---

## ANNEXES

### Annexe A — Exemple de Réponse API Adzuna

```json
{
  "results": [
    {
      "id": "4523891234",
      "title": "Développeur Java Senior",
      "company": { "display_name": "Société Générale" },
      "location": { "display_name": "Paris, Île-de-France" },
      "description": "Nous recherchons un développeur Java Senior...",
      "salary_min": 55000,
      "salary_max": 75000,
      "contract_time": "full_time",
      "redirect_url": "https://www.adzuna.fr/emploi/4523891234",
      "created": "2026-03-28T10:00:00Z",
      "category": { "label": "IT Jobs" }
    }
  ],
  "count": 1250
}
```

### Annexe B — Variables d'Environnement

```properties
# application.properties (profil production)
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.redis.host=${REDIS_HOST}
spring.redis.port=${REDIS_PORT}

# APIs Externes
api.adzuna.app-id=${ADZUNA_APP_ID}
api.adzuna.app-key=${ADZUNA_APP_KEY}
api.jsearch.key=${JSEARCH_KEY}
api.themuse.key=${THEMUSE_KEY}

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=900000
jwt.refresh-expiration=604800000

# Mail
spring.mail.host=${MAIL_HOST}
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
```

---

*Document rédigé dans le cadre du projet académique JobFinder — Tous droits réservés*

*Version 1.0 — Avril 2026*