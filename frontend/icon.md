# Directives d'Intégration des Icônes : Google Material Symbols & Material Web

Ce document définit les règles strictes d'installation et d'utilisation du système d'icônes du projet. **Aucune autre bibliothèque d'icônes (Lucide, Heroicons, FontAwesome) ne doit être utilisée dans le code.**

---

## 📦 1. Installation & Configuration

### Option A : Importation via Web Components (`@material/web`)
Installer les composants web officiels Google Material :

```bash
npm install @material/web
Option B : Chargement de la police d'icônes Google Material Symbols (Recommandé pour Next.js/Tailwind)Ajouter la police d'icônes globale dans app/globals.css ou dans la balise <head> de app/layout.tsx :CSS/* Dans app/globals.css */
@import url('[https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block](https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block)');
🎨 2. Directives d'Utilisation dans les ComposantsRègle d'or :Toutes les icônes de l'application doivent être extraites exclusivement de Google Fonts Icons / Material Symbols.Syntaxe Standard (Span HTML avec Material Symbols) :Pour une intégration rapide et compatible React / Tailwind :TypeScript<span className="material-symbols-outlined text-[20px]">
  search
</span>
Syntaxe Web Component (<md-icon>) :Si le composant Material Web est chargé :TypeScriptimport '@material/web/icon/icon.js';

<md-icon>monitoring</md-icon>
📐 3. Tailles et Alignement avec le Thème NeubrutalisteTailles standards (via classes Tailwind ou opsz) :Petite (Boutons sm, badges) : text-[16px] / size-4Moyenne (Boutons md, navigation, inputs) : text-[20px] / size-5Grande (Cartes, en-têtes) : text-[24px] à text-[32px]Style visuel Neubrutaliste :Les icônes doivent utiliser la couleur de texte du parent (currentColor ou classe Tailwind explicite text-black, text-white).L'alignement vertical dans les boutons doit se faire avec inline-flex items-center justify-center.📋 4. Dictionnaire d'Icônes du Projet (Correspondances)Lors du remplacement des anciennes icônes, appliquer la table de correspondance suivante :Action / Concept : Nom Google Material Symbol Dashboard / Accueil : dashboard ou grid_view Moniteur / Pings / Santémonitoring ou activity_zone Alertes / Notifications : notifications ou warning Clés API / Sécurité : key ou security Paramètres : settings Ajouter / Nouveau : add Éditer / Modifier : edit Supprimer : delete Rafraîchir / Reload : refreshRechercher : search Connexion / Se connecter : loginDéconnexion : logout Masquer / Afficher mot de passe : visibility / visibility_offStatut En ligne (UP) : check_circle Statut En panne (DOWN) : error ou warning Temps / Intervalle : schedule Latence / Vitesse : bolt URL / Web : language ou public🤖 Instructions pour l'Agent AI (Gemini / Antigravity)Suppression : Désinstaller ou retirer tout import lié à lucide-react ou autres packages d'icônes tierces.Standardisation : Remplacer systématiquement toutes les balises <IconName /> par leur équivalent <span className="material-symbols-outlined">icon_name</span>.Purger le code : Vérifier qu'aucun composant ne plante faute d'import d'icône.