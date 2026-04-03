# SafeDevice — Application Mobile

Application mobile de gestion d'appareils et de suivi de garanties, développée en **React Native (Expo)** avec **Supabase** comme backend.

---

## Fonctionnalités

### Compte utilisateur
- Inscription par email + mot de passe (avec email de confirmation)
- Connexion / déconnexion avec session persistante
- Réinitialisation du mot de passe par email
- Écran profil (pseudo modifiable, email en lecture seule)

### Gestion des appareils
- Ajout d'un appareil : nom, type (mobile/PC/tablette/autre), marque, modèle, date d'achat, prix, notes
- Liste des appareils avec cartes visuelles
- Fiche détail complète
- Modification et suppression (avec confirmation)

### Gestion des garanties
- Type de garantie : légale, constructeur, extension, autre
- Dates de début et fin de garantie
- Statut calculé automatiquement : **Active** (badge vert) / **Expirée** (badge rouge)
- Visible sur la liste ET sur la fiche détail

---

## Stack technique

| Élément | Technologie |
|---------|-------------|
| Front-end | React Native + Expo (SDK 52) |
| Routing | Expo Router v4 (file-based) |
| Backend | Supabase (PostgreSQL + Auth + API REST) |
| Langage | TypeScript |
| Builds | EAS Build (APK Android + TestFlight iOS) |

---

## Structure du projet

```
safedevice/
├── app/                       # Écrans (Expo Router)
│   ├── _layout.tsx            # Root layout + auth guard
│   ├── auth/                  # Écrans non connectés
│   │   ├── _layout.tsx
│   │   ├── login.tsx          # Connexion
│   │   ├── register.tsx       # Inscription
│   │   └── forgot-password.tsx # Mot de passe oublié
│   ├── (tabs)/                # Navigation principale
│   │   ├── _layout.tsx        # Bottom tabs
│   │   ├── index.tsx          # Liste des appareils
│   │   └── profile.tsx        # Profil utilisateur
│   └── device/
│       ├── [id].tsx           # Fiche détail appareil
│       └── form.tsx           # Formulaire ajout/modification
├── components/
│   ├── DeviceCard.tsx         # Carte appareil (liste)
│   └── WarrantyBadge.tsx      # Badge Active / Expirée
├── services/
│   ├── supabase.ts            # Client Supabase
│   ├── auth.ts                # Authentification
│   └── devices.ts             # CRUD appareils
├── types/
│   └── index.ts               # Types TypeScript
├── constants/
│   └── index.ts               # Couleurs, options sélecteurs
├── utils/
│   └── warranty.ts            # Calcul statut garantie, formatage
├── app.json                   # Configuration Expo
├── eas.json                   # Configuration builds EAS
├── package.json
├── tsconfig.json
├── babel.config.js
├── .env.example               # Variables d'environnement (template)
└── supabase_schema.sql        # Schéma de base de données
```

---

## Installation et lancement en local

### Prérequis
- Node.js >= 18
- npm ou yarn
- Expo CLI : `npm install -g expo-cli`
- EAS CLI : `npm install -g eas-cli`
- Un projet Supabase (gratuit sur https://supabase.com)

### Étapes

1. **Cloner le dépôt**
```bash
git clone https://github.com/VOTRE-USERNAME/safedevice.git
cd safedevice
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Supabase**

Créer un projet sur https://supabase.com, puis :
- Aller dans **SQL Editor** et coller le contenu de `supabase_schema.sql`
- Exécuter le script
- Aller dans **Settings > API** et copier l'URL et la clé anon

4. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```
Remplir `.env` avec vos valeurs Supabase :
```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
```

5. **Lancer en mode développement**
```bash
npx expo start
```
Scanner le QR code avec Expo Go (Android) ou l'app Camera (iOS).

---

## Générer les builds

### APK Android
```bash
eas build --platform android --profile preview
```
Le fichier APK sera disponible en téléchargement depuis le dashboard EAS.

### TestFlight iOS
```bash
eas build --platform ios --profile preview
```
Nécessite un compte Apple Developer (99€/an). Le build sera uploadé sur TestFlight automatiquement.

---

## Base de données Supabase

### Table `profiles`
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID (PK) | Lié à auth.users |
| pseudo | TEXT | Nom/pseudo modifiable |
| email | TEXT | Email du compte |
| created_at | TIMESTAMPTZ | Date de création |
| updated_at | TIMESTAMPTZ | Dernière modification |

### Table `devices`
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID (PK) | Identifiant unique |
| user_id | UUID (FK) | Propriétaire de l'appareil |
| name | TEXT | Nom de l'appareil |
| type | TEXT | mobile / PC / tablette / autre |
| brand | TEXT | Marque |
| model | TEXT | Modèle |
| purchase_date | DATE | Date d'achat |
| purchase_price | NUMERIC | Prix d'achat |
| notes | TEXT | Notes libres (IMEI, n° série...) |
| warranty_type | TEXT | légale / constructeur / extension / autre |
| warranty_start | DATE | Début de garantie |
| warranty_end | DATE | Fin de garantie |
| created_at | TIMESTAMPTZ | Date de création |
| updated_at | TIMESTAMPTZ | Dernière modification |

### Sécurité (RLS)
- Chaque utilisateur ne peut voir, créer, modifier et supprimer **que ses propres appareils**
- Row Level Security activé sur les deux tables
- Le profil est créé automatiquement à l'inscription via un trigger

---

## Services Supabase

- **URL du dashboard** : https://supabase.com/dashboard/project/VOTRE_PROJECT_ID
- **Base de données** : PostgreSQL, accessible depuis le dashboard > Table Editor
- **Authentification** : dashboard > Authentication > Users
- **Clés API** : dashboard > Settings > API

---

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| EXPO_PUBLIC_SUPABASE_URL | URL de votre projet Supabase |
| EXPO_PUBLIC_SUPABASE_ANON_KEY | Clé anonyme (publique) Supabase |

---

## Développé par

**Gabin GOUDE** — Développeur freelance
- Stack : React Native, Next.js, Supabase, Node.js
