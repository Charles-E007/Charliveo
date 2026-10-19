KeepAlive Design System (Red Broadcast Edition)
Overview

Un système de design épuré, centré sur la donnée et la lisibilité immédiate des métriques serveur (Uptime, Latence, Ping). KeepAlive Red Broadcast utilise une touche de rouge signature (#FF0000) appliquée avec parcimonie pour les alertes critiques (serveurs DOWN), les indicateurs d'activation en direct et les actions principales. L'esthétique est fluide, moderne et structurée en grille, permettant un suivi rapide de dizaines d'instances d'hébergement (Render, Railway, Fly.io).
Colors

    Primary / Broadcast Red (#FF0000) : Indicateur "DOWN", statut d'incident critique, bouton principal d'action, pings en direct.

    Primary Hover (#CC0000) : État survol des boutons et éléments interactifs rouges.

    Secondary / Link Blue (#065FD4) : Liens HTTP/URLs d'endpoints, méthodes HTTP (GET, POST), mentions techniques.

    Neutral / Gray 600 (#606060) : Textes secondaires, métadonnées de latence, icônes secondaires.

    Background (#FFFFFF) : Arrière-plan principal blanc immaculé de l'application.

    Surface / Gray 100 (#F2F2F2) : Fond de la barre latérale, cartes secondaires, arrière-plan au survol, champs de formulaire.

    Text Primary (#0F0F0F) : Titres de moniteurs, statistiques principales, texte fort.

    Text Secondary (#606060) : Temps de réponse (ms), intervalles (min), dates de dernier ping.

    Border (#E5E5E5) : Séparateurs et contours de cartes discrets.

    Success / UP (#2BA640) : Statut serveur en ligne (UP 100%), réponses HTTP 200 OK.

    Warning / Pending (#FB8C00) : Latence élevée, serveur en cours de démarrage/réveil, pings suspendus.

Typography

    Display Font : Roboto — chargé depuis Google Fonts (Titres, Métriques, Entêtes).

    Body Font : Roboto — chargé depuis Google Fonts (Corps de texte, Étiquettes, Navigation).

    Code Font : Roboto Mono — chargé depuis Google Fonts (URLs endpoints, payloads JSON, tokens API).

La typographie est compacte (12px à 14px pour l'UI) afin de maximiser l'affichage des moniteurs et des graphiques de disponibilité.

    Page Title : Roboto 24px/32px, weight 700

    Section / Modal Title : Roboto 20px/28px, weight 700

    Monitor Card Title : Roboto 15px/22px, weight 500, max 1 ligne avec découpe points de suspension

    Metric Highlight : Roboto 20px/28px, weight 700 (Temps de réponse, Uptime %)

    Body / Labels : Roboto 14px/20px, weight 400

    Body Small / Metadata : Roboto 12px/18px, weight 400

    Code / URLs / JSON : Roboto Mono 12px/16px, weight 400

Elevation & Shadows

L'élévation est minimale et discrète. Les bordures fines (1px #E5E5E5) sont privilégiées par rapport aux ombres lourdes.

    Level 0 (Flat) : Aucune ombre — état par défaut des cartes et des surfaces.

    Level 1 : 0 1px 2px rgba(0, 0, 0, 0.1) — Header collant au défilement et cartes au survol.

    Level 2 : 0 4px 16px rgba(0, 0, 0, 0.08) — Menus déroulants, sélecteurs de filtres.

    Level 3 : 0 8px 32px rgba(0, 0, 0, 0.16) — Fenêtres modales de création/édition de moniteur.

Components
1. Buttons

    Primary CTA ("Nouveau Moniteur") : Fond sombre #0F0F0F, texte blanc #FFFFFF, hauteur 36px, border-radius: 9999px (forme pilule), Roboto 14px weight 500.

    Broadcast Action ("Ping Instantané") : Fond #FF0000, texte blanc, border-radius: 9999px.

    Outlined / Secondary : Contour 1px #E5E5E5, fond blanc #FFFFFF, survol #F2F2F2, border-radius: 9999px.

    Icon Buttons : Boutons circulaires de 36px/40px, fond transparent, icône #606060, survol #F2F2F2.

2. Monitor Cards

    Conteneur épuré avec fond blanc #FFFFFF, bordure fine 1px #E5E5E5, coins arrondis 12px (rounded-xl).

    En-tête de carte : Nom du serveur en Roboto 15px (weight 500), badge de méthode HTTP (GET/POST) à fond #F2F2F2, et badge de statut à droite.

    Badges de statut :

        UP : Fond #2BA640 (Vert), texte blanc, border-radius: 9999px.

        DOWN : Fond #FF0000 (Rouge), texte blanc, border-radius: 9999px.

        PAUSED : Fond #606060, texte blanc, border-radius: 9999px.

    Bloc de métriques : Grille de 3 colonnes sur fond gris clair #F2F2F2 (coins 8px) affichant l'intervalle de réveil (min), la latence (ms) et la disponibilité (%).

3. Inputs & Forms

    Hauteur de 40px, fond gris surface #F2F2F2, bordure 1px transparent (devient 1px #0F0F0F au focus), coins arrondis 8px ou 9999px pour la recherche.

    Les zones de texte JSON (Headers / Body) utilisent la police Roboto Mono 12px avec un fond #F8F8F8.

4. Navigation & Layout

    Header Top Bar : Hauteur 56px, fond blanc #FFFFFF, bordure inférieure 1px #E5E5E5.

    Sidebar : Largeur 240px (réductible à 72px), fond blanc #FFFFFF, séparée par une bordure droite 1px #E5E5E5.

    Items de navigation actifs : Fond gris surface #F2F2F2, texte noir #0F0F0F en gras (weight 700), forme arrondie (rounded-xl).

Spacing & Grid

    Unité de base : 8px (échelle : 4px, 8px, 12px, 16px, 24px, 32px).

    Grille de cartes : Auto-fill CSS avec largeur minimale de 320px par carte, écartement (gap) de 16px.

Border Radius

    2px - 4px : Badges secondaires, conteneurs de métriques secondaires.

    8px : Champs de formulaires, sous-blocs de cartes, modales.

    12px : Cartes de moniteurs.

    9999px : Boutons (pill shape), badges de statut UP/DOWN, avatars.

Do's and Don'ts

    Do réserver le rouge (#FF0000) uniquement pour les pannes (DOWN), les pings urgents et les alertes critiques.

    Do utiliser des bordures fines 1px #E5E5E5 et des coins arrondis doux.

    Don't utiliser de bordures épaisses (3px-4px) ou d'ombres portées noires dures décalées (style neubrutaliste).

    Do utiliser uniquement Google Material Symbols via <span className="material-symbols-outlined"> pour toutes les icônes de l'interface.

    Don't utiliser d'emojis dans l'interface utilisateur.