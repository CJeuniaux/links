// Appel à l'API Gemini (Google). La clé reste sur le serveur Vercel :
// variable d'environnement GEMINI_API_KEY (et, en option, GEMINI_MODEL).
const MODELE_DEFAUT = "gemini-3.8-flash";
const MODELE_SECOURS = "gemini-flash-latest";

async function appeler(modele, corps) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modele}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
      body: JSON.stringify(corps),
    }
  );
  if (!r.ok) {
    const e = new Error(`Gemini ${r.status}: ${(await r.text()).slice(0, 300)}`);
    e.status = r.status;
    throw e;
  }
  const j = await r.json();
  const parts = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [];
  return parts.filter((p) => p.text && !p.thought).map((p) => p.text).join("").trim();
}

async function demanderGemini({ consigne, echanges, json = false, maxMots = 2048, rapide = false, recherche = false }) {
  if (!process.env.GEMINI_API_KEY) {
    const e = new Error("GEMINI_API_KEY manquante");
    e.status = 503;
    throw e;
  }
  const base = {
    systemInstruction: { parts: [{ text: consigne }] },
    contents: echanges.map((m) => ({ role: m.role, parts: [{ text: m.texte }] })),
    generationConfig: { temperature: 0.7, maxOutputTokens: maxMots },
  };
  if (json) base.generationConfig.responseMimeType = "application/json";
  const avec = (opts) => {
    const c = { ...base, generationConfig: { ...base.generationConfig } };
    if (opts.rapide) c.generationConfig.thinkingConfig = { thinkingLevel: "low" };
    if (opts.recherche) c.tools = [{ google_search: {} }];
    return c;
  };
  // Du plus complet au plus simple : si le modèle refuse une option (erreur 400), on l'enlève.
  const variantes = [];
  if (rapide || recherche) variantes.push({ rapide, recherche });
  if (rapide && recherche) variantes.push({ rapide: false, recherche });
  variantes.push({});
  const modele = process.env.GEMINI_MODEL || MODELE_DEFAUT;
  let derniere;
  for (const v of variantes) {
    try {
      return await appeler(modele, avec(v));
    } catch (e) {
      derniere = e;
      if (e.status !== 400) break;
    }
  }
  // Modèle inconnu ou retiré : on essaie l'alias « dernier Flash ».
  if (derniere && (derniere.status === 404 || derniere.status === 400) && modele !== MODELE_SECOURS) {
    return appeler(MODELE_SECOURS, avec(recherche ? { recherche } : {})).catch(() => appeler(MODELE_SECOURS, avec({})));
  }
  throw derniere;
}

// Refuse les appels qui ne viennent pas de la page (évite qu'on utilise la clé ailleurs).
function origineAutorisee(req) {
  const o = req.headers.origin || req.headers.referer || "";
  return !o || /^https:\/\/ecran-papa[\w.-]*\.vercel\.app/.test(o) || /^http:\/\/localhost/.test(o);
}

module.exports = { demanderGemini, origineAutorisee };
