# CaisseApp TN 🛒🇹🇳

**Caisse enregistreuse & gestion de stock** pour petits commerçants tunisiens.  
PWA installable, bilingue Français/Arabe (RTL), offline-first, Firebase Firestore.

---

## 🚀 Déploiement rapide (GitHub Pages)

```bash
# 1. Créer un repo GitHub, uploader les 3 fichiers :
#    index.html  |  manifest.json  |  sw.js
# 2. Settings → Pages → main branch → /root → Save
# Ton app sera live à : https://tonusername.github.io/caisse-app/
```

---

## 🔥 Connecter Firebase (optionnel)

Sans Firebase, l'app fonctionne en **mode démo local** (données en mémoire).

Pour activer la persistance cloud :

### 1. Créer un projet Firebase
- https://console.firebase.google.com → Nouveau projet
- Activer **Firestore** (mode test pour commencer)
- Activer **Authentication** → Email/Mot de passe

### 2. Récupérer les clés
Console Firebase → Paramètres projet → Tes apps → SDK de configuration web

### 3. Coller les clés dans index.html
Cherche la section `firebaseConfig` et remplace :

```javascript
const firebaseConfig = {
  apiKey:            "AIzaSy...",
  authDomain:        "mon-projet.firebaseapp.com",
  projectId:         "mon-projet",
  storageBucket:     "mon-projet.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

### 4. Règles Firestore (firestore.rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📱 Fonctionnalités

### Module Caisse
- ✅ Grille produits avec vue grille / liste
- ✅ Recherche instantanée (nom, ref, code-barres)
- ✅ Filtres par catégorie
- ✅ Tri (nom, prix, stock)
- ✅ Scanner code-barres (ZXing + saisie manuelle)
- ✅ Panier avec gestion quantités
- ✅ Sélection client au panier
- ✅ TVA 19% configurable
- ✅ 4 modes de paiement (espèces, chèque, virement, crédit)
- ✅ Calcul monnaie à rendre
- ✅ Animation confirmation vente

### Module Stock
- ✅ Tableau complet avec filtres avancés
- ✅ Filtres : catégorie + statut + recherche + tri
- ✅ Barres de stock visuelles (vert/orange/rouge)
- ✅ CRUD produit : ajout/modification/suppression
- ✅ Calcul marge automatique
- ✅ Alertes stock faible avec badge navigation
- ✅ Export CSV

### Dashboard
- ✅ KPIs : CA, ventes, valeur stock, bénéfice
- ✅ Graphique barres 7 jours
- ✅ Top 5 produits
- ✅ Pie chart modes de paiement
- ✅ Liste dettes clients
- ✅ Filtres période (jour/semaine/mois)

### Clients
- ✅ Gestion fiche client (nom, tel, adresse)
- ✅ Suivi dettes
- ✅ Historique achats
- ✅ Filtres recherche + dette + récents

### PWA
- ✅ Service Worker offline-first
- ✅ Background sync (ventes en attente)
- ✅ manifest.json (installable Android/iOS)
- ✅ Bilingue FR/AR avec RTL automatique

---

## 💰 Modèle SaaS suggéré

| Plan | Prix/mois | Cible |
|------|-----------|-------|
| Starter | 19 DT | 1 caissier, 500 produits |
| Pro | 29 DT | 3 caissiers, illimité, rapports |
| Business | 49 DT | Multi-boutique, API, support |

---

## 🛠 Stack technique

- HTML5 + CSS3 + JavaScript ES2022 (vanilla, zéro dépendance npm)
- Firebase 10 (Firestore + Auth) via CDN
- ZXing-browser pour le scan code-barres
- Google Fonts (Sora + Noto Sans Arabic)
- Service Worker (PWA offline)

---

Fait avec ❤️ pour les commerçants tunisiens.
