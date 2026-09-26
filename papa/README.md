# Mon écran : l'écran d'accueil de Papa

Une seule page web, en plein écran, pensée pour une personne âgée qui voit mal et a des troubles de la mémoire. Elle se pilote à la souris ou au clavier. L'écran n'est pas tactile.

- **Accueil** : « Bonjour Papa ! », la date, l'heure et le moment de la journée en gros. En dessous, 3 grandes tuiles avec des images.
- **Messages de la famille** : un message à la fois, en très gros, avec la photo de la personne qui écrit. Le message est **lu à voix haute** automatiquement.
- **Le savant du jour** : chaque jour, un scientifique (priorité aux biochimistes et aux Belges), avec sa photo et 3 phrases tirées de Wikipédia, lues à voix haute.
- **Films** : films muets complets du domaine public (Méliès, Metropolis, Keaton, Chaplin), science-fiction et grands cinéastes racontés par ARTE Blow Up.
- **Documentaires** : environ 40 vidéos et séries (ARTE, « C'est pas sorcier », « Il était une fois… », Chaplin, cinéma), mélangées chaque jour. Il y a 3 choix à la fois, et un bouton « D'autres choix ». Il ne voit jamais l'interface de YouTube. Une vidéo supprimée ou non intégrable est sautée automatiquement.

Garde-fous :
- un gros bouton **⬅ Retour** toujours au même endroit ;
- la touche **Échap** ramène à l'accueil ;
- retour automatique à l'accueil après 3 minutes sans activité, sauf pendant une vidéo ;
- pas de menu au clic droit, pas de défilement, pas de lien vers l'extérieur ;
- nouveau savant et nouvelles vidéos chaque jour ;
- messages rechargés toutes les 10 minutes ;
- **quand on rouvre le capot**, la page revient à l'accueil et une voix dit bonjour, la date et l'heure. On peut couper la voix dans `contenu.js`.

Raccourcis clavier : `1` à `4` ouvrent les tuiles, les flèches passent d'un bouton à l'autre, `Entrée` valide.

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

## 3. Ouvrir le capot = son écran, et rien d'autre

**Option A, gratuite (fonctionne dans 95 % des cas).** On laisse la page ouverte en plein écran, et le Chromebook ne se verrouille jamais. Quand il ferme le capot, l'ordinateur dort. Quand il l'ouvre, il retrouve exactement « Mon écran », revenu tout seul à l'accueil. Les réglages sont juste en dessous. Limite : après un vrai redémarrage (batterie vide, mise à jour), il faut retaper le mot de passe. ChromeOS ne permet pas de s'en passer sans l'option B. Gardez le Chromebook branché en permanence pour limiter les redémarrages.

**Option B, le vrai mode borne (payant).** Avec la licence Google « Kiosk & Signage Upgrade », le Chromebook démarre directement sur la page, sans mot de passe, sans barre et sans possibilité d'en sortir, même après un redémarrage. Il faut :
1. acheter la licence pour ce Chromebook (environ 25 € par an, prix à vérifier) ;
2. faire une remise à zéro (« Powerwash ») puis inscrire le Chromebook dans la console d'administration Google ;
3. déclarer l'adresse de la page comme application kiosque à lancement automatique.

C'est la solution la plus robuste si l'option A ne suffit pas.

## 4. Réglages du Chromebook (15 minutes, à faire une fois)

1. **Grand curseur** : Paramètres → Accessibilité → Curseur et pavé tactile → « Afficher un grand curseur ». Réglez la taille au maximum et choisissez une couleur vive.
2. **Masquer la barre du bas** : clic droit sur la barre → « Masquer automatiquement l'étagère ». Retirez aussi de la barre toutes les applications épinglées, sauf « Mon écran ».
3. **Installer la page comme une application** : ouvrez l'adresse de la page dans Chrome, puis menu ⋮ → « Caster, enregistrer et partager » → « Installer la page en tant qu'application ». Elle s'ouvre alors dans sa propre fenêtre, sans barre d'adresse.
4. **Plein écran** : touche plein écran du clavier (le rectangle, au-dessus du 4), ou `F4`.
5. **Au démarrage** : Paramètres → Système → Au démarrage → « Toujours restaurer ». La page se rouvre à l'allumage.
6. **Pas de verrouillage** : Paramètres → Sécurité et confidentialité → désactiver « Afficher l'écran de verrouillage à la sortie de veille ». Puis Paramètres → Système → Alimentation → « Lorsque le capot est fermé : veille ».
7. **Son** : volume assez fort. Faites un test avec le bouton « 🔊 Écouter ».
8. **Notifications** : Paramètres → Notifications → « Ne pas déranger ».

Limite connue : un vrai verrouillage (mode « borne » ou kiosque) n'est possible que sur un Chromebook géré, avec une licence Chrome Enterprise payante. Sans ça, il peut sortir de la page par erreur. Dans ce cas, le personnel ou vous : touche plein écran, ou redémarrer.

## 5. Mise en ligne

La page est statique (HTML, CSS, JS, sans installation). Elle est hébergée sur Vercel. Pour tester chez vous, ouvrez simplement `index.html` dans Chrome.
