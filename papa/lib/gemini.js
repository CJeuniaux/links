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

async function demanderGemini({ consigne, echanges, json = false, maxMots = 2048, rapide = false }) {
  if (!process.env.GEMINI_API_KEY) {
    const e = new Error("GEMINI_API_KEY manquante");
    e.status = 503;
    throw e;
  }
  const corps = {
    systemInstruction: { parts: [{ text: consigne }] },
    contents: echanges.map((m) => ({ role: m.role, parts: [{ text: m.texte }] })),
    generationConfig: { temperature: 0.7, maxOutputTokens: maxMots },
  };
  if (json) corps.generationConfig.responseMimeType = "application/json";
  const modele = process.env.GEMINI_MODEL || MODELE_DEFAUT;
  if (rapide) {
    // Réflexion minimale = réponse plus rapide. Si le modèle ne connaît pas l'option, on continue sans.
    try {
      return await appeler(modele, { ...corps, generationConfig: { ...corps.generationConfig, thinkingConfig: { thinkingLevel: "low" } } });
    } catch (e) {
      if (e.status !== 400) throw e;
    }
  }
  try {
    return await appeler(modele, corps);
  } catch (e) {
    // Modèle inconnu ou retiré : on essaie l'alias « dernier Flash ».
    if ((e.status === 404 || e.status === 400) && modele !== MODELE_SECOURS) return appeler(MODELE_SECOURS, corps);
    throw e;
  }
}

// Refuse les appels qui ne viennent pas de la page (évite qu'on utilise la clé ailleurs).
function origineAutorisee(req) {
  const o = req.headers.origin || req.headers.referer || "";
  return !o || /^https:\/\/ecran-papa[\w.-]*\.vercel\.app/.test(o) || /^http:\/\/localhost/.test(o);
}

module.exports = { demanderGemini, origineAutorisee };
