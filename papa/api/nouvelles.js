// Les nouvelles du jour : quelques flux RSS science / cinéma, triés et
// réécrits simplement par Gemini. Résultat mis en cache 3 h par Vercel.
const { demanderGemini } = require("../lib/gemini");

const FLUX = [
  { nom: "Le Monde Sciences", url: "https://www.lemonde.fr/sciences/rss_full.xml" },
  { nom: "CNRS Le journal", url: "https://lejournal.cnrs.fr/rss" },
  { nom: "Futura Sciences", url: "https://www.futura-sciences.com/rss/actualites.xml" },
  { nom: "Le Monde Cinéma", url: "https://www.lemonde.fr/cinema/rss_full.xml" },
];

const CONSIGNE = `Tu prépares « les nouvelles du jour » pour un homme de 82 ans, ancien biochimiste, atteint d'Alzheimer, qui voit mal.
Elles lui seront affichées en très gros et lues à voix haute.
Parmi les articles fournis, choisis-en 3 : si possible un de biologie ou de chimie, un sur l'espace, la nature ou la physique, et un sur le cinéma.
Choisis uniquement des nouvelles positives, étonnantes ou apaisantes. Exclus tout ce qui parle de guerre, de politique, de crime, de catastrophe, de mort, de maladie grave, de démence ou qui pourrait angoisser.
Pour chacune, écris un titre de 8 mots maximum et un texte de 2 phrases courtes (40 mots maximum en tout), en français simple, au présent, sans jargon, sans chiffres compliqués.
Réponds uniquement en JSON : {"nouvelles":[{"id":"...","titre":"...","texte":"..."}]}`;

function decoder(s) {
  return (s || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&rsquo;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/\s+/g, " ").trim();
}
function balise(bloc, nom) {
  const m = new RegExp(`<${nom}[^>]*>([\\s\\S]*?)</${nom}>`, "i").exec(bloc);
  return m ? m[1] : "";
}
function image(bloc) {
  const m = /<media:content[^>]*url="([^"]+)"/i.exec(bloc) ||
    /<media:thumbnail[^>]*url="([^"]+)"/i.exec(bloc) ||
    /<enclosure[^>]*url="([^"]+)"[^>]*type="image/i.exec(bloc) ||
    /<enclosure[^>]*type="image[^"]*"[^>]*url="([^"]+)"/i.exec(bloc) ||
    /<img[^>]*src="([^"]+)"/i.exec(bloc.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"'));
  return m ? m[1].replace(/&amp;/g, "&") : "";
}

async function lireFlux(f) {
  try {
    const r = await fetch(f.url, { headers: { "User-Agent": "Mozilla/5.0 (bureau-de-papa)" }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return [];
    const xml = await r.text();
    return (xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || []).slice(0, 10).map((b) => ({
      source: f.nom,
      titre: decoder(balise(b, "title")),
      resume: decoder(balise(b, "description")).slice(0, 300),
      image: image(b),
    })).filter((a) => a.titre);
  } catch (e) {
    return [];
  }
}

module.exports = async (req, res) => {
  const articles = (await Promise.all(FLUX.map(lireFlux))).flat();
  articles.forEach((a, i) => { a.id = "a" + i; });
  let nouvelles = [];
  if (articles.length) {
    try {
      const texte = await demanderGemini({
        consigne: CONSIGNE,
        echanges: [{ role: "user", texte: JSON.stringify(articles.map(({ id, source, titre, resume }) => ({ id, source, titre, resume }))) }],
        json: true,
      });
      const choix = JSON.parse(texte.replace(/^```(json)?|```$/g, "")).nouvelles || [];
      nouvelles = choix.map((c) => {
        const a = articles.find((x) => x.id === c.id) || {};
        return { titre: c.titre, texte: c.texte, image: a.image || "", source: a.source || "" };
      }).filter((n) => n.titre && n.texte).slice(0, 3);
    } catch (e) {
      console.error(e.message);
    }
    if (!nouvelles.length) {
      // Sans Gemini : le premier article de chaque source, tel quel.
      const vus = {};
      nouvelles = articles.filter((a) => !vus[a.source] && (vus[a.source] = 1)).slice(0, 3)
        .map((a) => ({ titre: a.titre, texte: a.resume.split(/(?<=[.!?])\s/).slice(0, 2).join(" "), image: a.image, source: a.source }));
    }
  }
  res.setHeader("Cache-Control", "public, s-maxage=10800, stale-while-revalidate=86400");
  return res.status(200).json({ nouvelles });
};
