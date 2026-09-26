# Mon écran : l'écran d'accueil de Papa

Une seule page web, en plein écran, pensée pour une personne âgée qui voit mal et a des troubles de la mémoire. Elle se pilote à la souris ou au clavier. L'écran n'est pas tactile.

- **Accueil** : « Bonjour Papa ! », la date, l'heure et le moment de la journée en gros. En dessous, 3 grandes tuiles avec des images.
- **Messages de la famille** : un message à la fois, en très gros, avec la photo de la personne qui écrit. Le message est **lu à voix haute** automatiquement.
- **Le savant du jour** : chaque jour, un scientifique (priorité aux biochimistes et aux Belges), avec sa photo et 3 phrases tirées de Wikipédia, lues à voix haute.
- **Documentaires** : 3 vidéos proposées par jour, qui tournent dans une liste que vous choisissez (« C'est pas sorcier », Arte, « Il était une fois… la Vie »). Il ne voit jamais l'interface de YouTube.

Garde-fous :
- un gros bouton **⬅ Retour** toujours au même endroit ;
- la touche **Échap** ramène à l'accueil ;
- retour automatique à l'accueil après 3 minutes sans activité, sauf pendant une vidéo ;
- pas de menu au clic droit, pas de défilement, pas de lien vers l'extérieur ;
- nouveau savant et nouvelles vidéos chaque jour ;
- messages rechargés toutes les 10 minutes.

Raccourcis clavier : `1`, `2` et `3` ouvrent les tuiles, les flèches passent d'un bouton à l'autre, `Entrée` valide.

---

## 1. Tout se règle dans `contenu.js`

Ce fichier contient le prénom affiché, les photos de la famille, la liste des savants et la liste des vidéos. Pour ajouter une vidéo YouTube, copiez ce qui suit `watch?v=` dans son adresse.

## 2. Les messages de la famille (Google Form, 10 minutes)

1. Créez un **Google Form** avec deux questions :
   - « Prénom » (réponse courte) ;
   - « Message » (paragraphe).
2. Ouvrez l'onglet **Réponses**, puis **Associer à Sheets**. Cela crée une Google Sheet.
3. Dans la Sheet, allez dans **Fichier → Partager → Publier sur le web**. Choisissez l'onglet des réponses, puis le format **Valeurs séparées par des virgules (.csv)**, et cliquez sur **Publier**. Copiez le lien obtenu.
4. Collez ce lien dans `contenu.js`, à la ligne `messagesCsvUrl: "…"`.
5. Envoyez le lien du **formulaire** à la famille. Chacun peut l'ajouter à l'écran d'accueil de son téléphone et écrire un petit mot par jour.

Pour que son visage s'affiche à côté du message, mettez une photo carrée par personne dans `photos/` (par exemple `photos/maman.jpg`). Ajoutez-la ensuite dans `famille` de `contenu.js`, avec **exactement** le même prénom que dans le formulaire.

Conseils pour écrire les messages : des phrases courtes, qui ne demandent pas de réponse ni de se souvenir. Plutôt « Il fait beau aujourd'hui, je pense à toi » que « Tu te souviens de… ? ».

> ⚠️ Une Sheet publiée sur le web est lisible par quiconque a le lien. N'y mettez rien de sensible (adresses, informations médicales…).

## 3. Réglages du Chromebook (15 minutes, à faire une fois)

1. **Grand curseur** : Paramètres → Accessibilité → Curseur et pavé tactile → « Afficher un grand curseur ». Réglez la taille au maximum et choisissez une couleur vive.
2. **Masquer la barre du bas** : clic droit sur la barre → « Masquer automatiquement l'étagère ». Retirez aussi de la barre toutes les applications épinglées, sauf « Mon écran ».
3. **Installer la page comme une application** : ouvrez l'adresse de la page dans Chrome, puis menu ⋮ → « Caster, enregistrer et partager » → « Installer la page en tant qu'application ». Elle s'ouvre alors dans sa propre fenêtre, sans barre d'adresse.
4. **Plein écran** : touche plein écran du clavier (le rectangle, au-dessus du 4), ou `F4`.
5. **Au démarrage** : Paramètres → Système → Au démarrage → « Toujours restaurer ». La page se rouvre à l'allumage.
6. **Veille** : Paramètres → Système → Alimentation. Pas de mise en veille quand il est branché, et « ne pas se verrouiller en sortie de veille », pour qu'il n'ait pas à retaper un mot de passe.
7. **Son** : volume assez fort. Faites un test avec le bouton « 🔊 Écouter ».
8. **Notifications** : Paramètres → Notifications → « Ne pas déranger ».

Limite connue : un vrai verrouillage (mode « borne » ou kiosque) n'est possible que sur un Chromebook géré, avec une licence Chrome Enterprise payante. Sans ça, il peut sortir de la page par erreur. Dans ce cas, le personnel ou vous : touche plein écran, ou redémarrer.

## 4. Mise en ligne

La page est statique (HTML, CSS, JS, sans installation). Elle est hébergée sur Vercel. Pour tester chez vous, ouvrez simplement `index.html` dans Chrome.
