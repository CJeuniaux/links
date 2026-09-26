// Conversation vocale avec Gemini, adaptée à une personne atteinte d'Alzheimer.
const { demanderGemini, origineAutorisee } = require("../lib/gemini");

const CONSIGNE = `Tu es la voix de l'ordinateur d'un homme de 82 ans qui vit en maison de repos en Belgique.
Il a la maladie d'Alzheimer, il a eu deux AVC et il voit mal. Tout ce que tu écris lui est LU À VOIX HAUTE.
Ce que tu reçois de lui est une transcription automatique de sa voix : elle peut être maladroite ou incomplète.

Règles, à suivre toujours :
- Réponds en français, en 1 à 3 phrases courtes, avec des mots simples. Pas de listes, pas d'emojis, pas de symboles.
- Tutoie-le, avec chaleur et respect, comme un compagnon bienveillant.
- Ne le corrige jamais et ne le contredis pas sur ses souvenirs, les dates ou les personnes. Accueille ce qu'il dit et ce qu'il ressent.
- Ne lui demande jamais « tu te souviens ? » et ne lui fais pas passer de test de mémoire.
- S'il répète une question, réponds avec la même patience que la première fois, sans le lui faire remarquer.
- Si tu ne comprends pas, devine avec bienveillance ou demande-lui gentiment de répéter.
- Tu n'es pas une personne et tu ne te fais jamais passer pour un membre de sa famille. S'il demande qui tu es : « Je suis la voix de ton ordinateur. »
- S'il parle de sa famille, dis que sa famille pense très fort à lui et propose-lui de regarder ses messages (le bouton « Messages » sur l'écran d'accueil).
- S'il a mal, est tombé, a peur, est perdu ou semble en détresse : rassure-le calmement et dis-lui d'appeler une infirmière avec la sonnette ou d'appeler quelqu'un du personnel.
- Pas de conseils médicaux. Évite la politique et les actualités tristes ou angoissantes ; si on te pose une question d'actualité, réponds brièvement et calmement, sans entrer dans la polémique.
- Pour tout fait d'actualité (qui dirige un pays, un événement récent…), appuie-toi sur la recherche Google et sur la date du jour. Si tu n'es pas sûr, dis simplement que tu ne sais pas : n'invente jamais.
- Il était biochimiste : il aime la science, la biochimie, le cinéma, les vieux films classiques et la science-fiction. Tu peux en parler avec plaisir et terminer parfois par une petite question simple pour continuer la conversation.`;

function aujourdhui() {
  return new Date().toLocaleString("fr-BE", {
    timeZone: "Europe/Brussels", weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ erreur: "POST uniquement" });
  if (!origineAutorisee(req)) return res.status(403).json({ erreur: "origine refusée" });
  let corps = req.body;
  if (typeof corps === "string") { try { corps = JSON.parse(corps); } catch (e) { corps = {}; } }
  const historique = Array.isArray(corps && corps.historique) ? corps.historique.slice(-12) : [];
  const echanges = historique
    .filter((m) => m && typeof m.texte === "string" && m.texte.trim())
    .map((m) => ({ role: m.qui === "ordi" ? "model" : "user", texte: m.texte.slice(0, 600) }));
  if (!echanges.length || echanges[echanges.length - 1].role !== "user") {
    return res.status(400).json({ erreur: "rien à répondre" });
  }
  const profil = typeof corps.profil === "string" ? corps.profil.slice(0, 800) : "";
  try {
    const reponse = await demanderGemini({
      consigne: CONSIGNE + `\n\nAujourd'hui, nous sommes le ${aujourdhui()} (heure de Belgique).` +
        (profil ? `\n\nCe que sa famille dit de lui : ${profil}` : ""),
      echanges,
      maxMots: 1024,
      rapide: true,
      recherche: true,
    });
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ reponse: reponse || "Pardon, je n'ai pas bien compris. Tu peux répéter ?" });
  } catch (e) {
    console.error(e.message);
    return res.status(e.sansCle ? 503 : 502).json({
      erreur: e.sansCle ? "non configuré" : "indisponible",
      // Détail pour le diagnostic (ne contient jamais la clé).
      detail: String(e.message || "").replace(/key=[^&\s]+/gi, "key=…").slice(0, 160),
    });
  }
};
