// Les nouvelles du jour : quelques flux RSS science / cinéma, triés et
// réécrits simplement par Gemini. Résultat mis en cache 3 h par Vercel.
const { demanderGemini } = require("../lib/gemini");

const FLUX = [
  { nom: "RTBF", url: "https://rss.rtbf.be/article/rss/rtbf_flux.xml" },
  { nom: "Le Monde", url: "https://www.lemonde.fr/rss/une.xml" },
  { nom: "Le Monde International", url: "https://www.lemonde.fr/international/rss_full.xml" },
  { nom: "Le Monde Sciences", url: "https://www.lemonde.fr/sciences/rss_full.xml" },
  { nom: "CNRS Le journal", url: "https://lejournal.cnrs.fr/rss" },
  { nom: "Futura Sciences", url: "https://www.futura-sciences.com/rss/actualites.xml" },
  { nom: "Le Monde Cinéma", url: "https://www.lemonde.fr/cinema/rss_full.xml" },
];

const CONSIGNE = `Tu prépares « les nouvelles du jour » pour un homme de 82 ans, ancien biochimiste, cultivé, atteint d'Alzheimer, qui voit mal.
Elles lui seront affichées en très gros et lues à voix haute. Il veut savoir ce qui se passe vraiment dans le monde.
Parmi les articles fournis, choisis-en exactement 5, sans doublon :
- 3 grandes actualités du jour : au moins une sur la Belgique et au moins une internationale (politique, économie, société, événements importants) ;
- 1 nouvelle de science (de préférence biologie, chimie, médecine ou espace) ;
- 1 nouvelle de culture ou de cinéma.
Pour les grandes actualités, choisis les plus importantes du jour, même si elles sont sérieuses. Donne les faits de façon neutre et claire, sans détails choquants ni ton alarmiste.
Pour chacune, écris un titre de 8 mots maximum et un texte de 2 ou 3 phrases courtes (50 mots maximum en tout), en français simple, au présent, sans jargon.
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
    return (xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || []).slice(0, 8).map((b) => ({
      source: f.nom,
      titre: decoder(balise(b, "title")),
      resume: decoder(balise(b, "description")).slice(0, 220),
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
      }).filter((n) => n.titre && n.texte).slice(0, 5);
    } catch (e) {
      console.error(e.message);
    }
    if (!nouvelles.length) {
      // Sans Gemini : le premier article de chaque source, tel quel.
      const vus = {};
      nouvelles = articles.filter((a) => !vus[a.source] && (vus[a.source] = 1)).slice(0, 5)
        .map((a) => ({ titre: a.titre, texte: a.resume.split(/(?<=[.!?])\s/).slice(0, 2).join(" "), image: a.image, source: a.source }));
    }
  }
  res.setHeader("Cache-Control", "public, s-maxage=10800, stale-while-revalidate=86400");
  return res.status(200).json({ nouvelles });
};
