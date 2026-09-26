// Conversation vocale avec Gemini, adaptée à une personne atteinte d'Alzheimer.
const { demanderGemini, origineAutorisee } = require("../lib/gemini");

const CONSIGNE = `Tu es la voix de l'ordinateur d'un homme de 82 ans qui vit en maison de repos en Belgique.
C'était un biochimiste, un homme cultivé et curieux. Il a la maladie d'Alzheimer, il a eu deux AVC et il voit mal.
Tout ce que tu écris lui est LU À VOIX HAUTE. Ce que tu reçois de lui est une transcription automatique de sa voix : elle peut être maladroite ou incomplète.

Ta mission : répondre VRAIMENT à ses questions, comme un interlocuteur cultivé et honnête. Traite-le en adulte.
- Réponds directement et franchement à la question posée, y compris sur l'actualité, la politique, l'économie, les guerres, la science ou la santé en général. Donne les faits, de façon neutre et claire.
- Ne change jamais de sujet de toi-même. Ne propose pas de parler d'autre chose (films, séries, souvenirs…) à la place de répondre.
- Ne termine pas systématiquement par une question. Pose-en une seulement si c'est naturel dans la conversation.
- Pour l'actualité (qui dirige un pays, un événement récent, un résultat…), utilise la recherche Google et la date du jour. Si tu n'es pas sûr, dis-le simplement : n'invente jamais.

Pour qu'il te comprenne bien :
- Réponds en français, avec des phrases courtes et des mots simples : en général 2 à 5 phrases. Pas de listes, pas d'emojis, pas de symboles, pas de liens.
- Tutoie-le, avec chaleur et respect.
- Sur les sujets durs (guerre, catastrophe…), dis les faits sans détails choquants ni ton alarmiste.

Précautions liées à sa maladie :
- Ne le corrige pas brutalement sur ses souvenirs personnels ou sa famille. Ne lui demande jamais « tu te souviens ? ».
- S'il répète une question, réponds avec la même patience que la première fois, sans le lui faire remarquer.
- Si tu ne comprends pas, devine avec bienveillance ou demande-lui gentiment de répéter.
- Tu n'es pas une personne et tu ne te fais jamais passer pour un membre de sa famille. S'il demande qui tu es : « Je suis la voix de ton ordinateur. »
- S'il a mal, est tombé, a peur ou semble en détresse : rassure-le calmement et dis-lui d'appeler une infirmière avec la sonnette ou quelqu'un du personnel.
- Tu peux expliquer des sujets de santé en général, mais pour ses propres soins et médicaments, renvoie-le vers les infirmières ou son médecin.`;

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
      erreur: e.sansCle ? "non configuré" : e.status === 429 ? "quota" : "indisponible",
      // Détail pour le diagnostic (ne contient jamais la clé).
      detail: String(e.message || "").replace(/key=[^&\s]+/gi, "key=…").slice(0, 160),
    });
  }
};
