# Laxshmee Koomar — Portfolio

Portfolio React + TypeScript + Vite, animations Framer Motion. Direction artistique bordeaux (#59050c), Georgia et portrait noir et blanc, d’après le portfolio original.

## Démarrer

```sh
npm install
npm run dev
```

## Vérifier et publier

```sh
npm test
npm run test:coverage
npm run build
npm run preview
```

Le dossier `dist/` est prêt pour un hébergement statique. Aucun serveur métier ni base de données n’est nécessaire. Site publié : https://laxshmeekoomar.netlify.app/.

## Contenu

Les données des projets se modifient dans `src/data.ts`. Les boutons de contact ouvrent un formulaire intégré avec Netlify Forms. Le formulaire statique `public/__forms.html` permet sa détection au déploiement ; les notifications sont configurées dans Netlify. L’envoi est désactivé sur localhost et les erreurs conservent les champs pour permettre une nouvelle tentative.

Les photographies, logos et créations sont repris du portfolio de la cliente, puis optimisés en WebP. Les accroches de navigation et d’introduction ont été réécrites pour ce site ; les descriptions des projets restent fondées sur la source. Aucun résultat commercial ni témoignage n’a été inventé.

Sources consultées le 17 septembre 2026 :
- https://laxshmeekoomar.myportfolio.com/home
- https://laxshmeekoomar.myportfolio.com/work
- https://laxshmeekoomar.myportfolio.com/accueil
- https://laxshmeekoomar.myportfolio.com/pojet-chaque-idee-est-une-aventure
- https://laxshmeekoomar.myportfolio.com/copie-de-pojet-chaque-idee-est-une-aventure

## Accessibilité et interactions

Navigation par ancres, lien d’évitement, focus visible, fenêtres natives `dialog`, fermeture par Échap et restauration du focus. Révélations au défilement, parallaxe du portrait, compositions réactives au survol et bandeau animé. Le réglage système de réduction des animations est pris en compte.
