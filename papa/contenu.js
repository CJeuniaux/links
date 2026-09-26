// =====================================================================
//  CONTENU DE L'ÉCRAN DE PAPA — c'est le seul fichier à modifier.
// =====================================================================

window.CONTENU = {
  // Comment l'écran l'appelle : « Bonjour Papa »
  prenom: "Papa",

  // ------------------------------------------------------------------
  // MESSAGES DE LA FAMILLE
  // Lien CSV d'une Google Sheet « publiée sur le web » (voir README.md).
  // Laisser vide ("") pour utiliser les messages d'exemple ci-dessous.
  // ------------------------------------------------------------------
  messagesCsvUrl: "",

  // Une photo par personne qui écrit : son visage aide à la reconnaître.
  // Le prénom doit être écrit comme dans le formulaire.
  // Mettre les photos dans le dossier papa/photos/ (JPG carré, ~600 px).
  famille: {
    // "Charlotte": "photos/charlotte.jpg",
    // "Maman": "photos/maman.jpg",
  },

  // Utilisés tant que messagesCsvUrl est vide.
  messagesExemple: [
    { de: "Ta famille", texte: "Bonjour ! On pense très fort à toi. On vient te voir bientôt. Gros bisous." },
  ],

  // ------------------------------------------------------------------
  // LE SAVANT DU JOUR — un par jour, dans l'ordre, puis on recommence.
  // « page » = titre exact de la page Wikipédia en français.
  // ------------------------------------------------------------------
  savants: [
    { page: "Christian de Duve", nom: "Christian de Duve", resume: "Biochimiste belge (1917-2013), prix Nobel de médecine en 1974 pour la découverte des lysosomes et des peroxysomes." },
    { page: "Louis Pasteur", nom: "Louis Pasteur", resume: "Chimiste et biologiste français (1822-1895). Il a mis au point le vaccin contre la rage et la pasteurisation." },
    { page: "Marie Curie", nom: "Marie Curie", resume: "Physicienne et chimiste (1867-1934). Deux fois prix Nobel, pour la radioactivité puis pour le polonium et le radium." },
    { page: "Albert Claude", nom: "Albert Claude", resume: "Biologiste belge (1899-1983), pionnier du microscope électronique pour étudier la cellule. Prix Nobel en 1974." },
    { page: "Rosalind Franklin", nom: "Rosalind Franklin", resume: "Chimiste britannique (1920-1958). Ses images aux rayons X ont révélé la structure en double hélice de l'ADN." },
    { page: "Hans Adolf Krebs", nom: "Hans Krebs", resume: "Biochimiste (1900-1981) qui a découvert le cycle de Krebs, au cœur de la respiration des cellules. Prix Nobel en 1953." },
    { page: "Jules Bordet", nom: "Jules Bordet", resume: "Médecin et microbiologiste belge (1870-1961), prix Nobel de médecine en 1919 pour ses travaux sur l'immunité." },
    { page: "Linus Pauling", nom: "Linus Pauling", resume: "Chimiste américain (1901-1994), spécialiste de la liaison chimique et des protéines. Deux fois prix Nobel." },
    { page: "Alexander Fleming", nom: "Alexander Fleming", resume: "Biologiste écossais (1881-1955) qui a découvert la pénicilline en 1928." },
    { page: "Jacques Monod", nom: "Jacques Monod", resume: "Biochimiste français (1910-1976), prix Nobel en 1965 pour ses travaux sur la régulation des gènes. Auteur du Hasard et la Nécessité." },
    { page: "Ilya Prigogine", nom: "Ilya Prigogine", resume: "Physicien et chimiste belge (1917-2003), prix Nobel de chimie en 1977 pour la thermodynamique des systèmes hors d'équilibre." },
    { page: "Frederick Sanger", nom: "Frederick Sanger", resume: "Biochimiste britannique (1918-2013), deux fois prix Nobel de chimie : séquence de l'insuline, puis séquençage de l'ADN." },
    { page: "Claude Bernard", nom: "Claude Bernard", resume: "Médecin et physiologiste français (1813-1878), fondateur de la médecine expérimentale." },
    { page: "Dorothy Crowfoot Hodgkin", nom: "Dorothy Hodgkin", resume: "Chimiste britannique (1910-1994). Elle a déterminé la structure de la pénicilline et de la vitamine B12. Prix Nobel en 1964." },
    { page: "Corneille Heymans", nom: "Corneille Heymans", resume: "Physiologiste belge (1892-1968), prix Nobel de médecine en 1938 pour ses travaux sur la régulation de la respiration." },
    { page: "Antoine Lavoisier", nom: "Antoine Lavoisier", resume: "Chimiste français (1743-1794), père de la chimie moderne : « Rien ne se perd, rien ne se crée, tout se transforme. »" },
    { page: "Francis Crick", nom: "Francis Crick", resume: "Biologiste britannique (1916-2004), co-découvreur de la structure de l'ADN avec James Watson en 1953." },
    { page: "Gregor Mendel", nom: "Gregor Mendel", resume: "Moine et botaniste (1822-1884) qui a découvert les lois de l'hérédité grâce à ses petits pois." },
    { page: "Emil Fischer", nom: "Emil Fischer", resume: "Chimiste allemand (1852-1919), prix Nobel de chimie en 1902 pour ses travaux sur les sucres et les purines." },
    { page: "Albert Szent-Györgyi", nom: "Albert Szent-Györgyi", resume: "Biochimiste hongrois (1893-1986), découvreur de la vitamine C. Prix Nobel en 1937." },
    { page: "Gerty Cori", nom: "Gerty Cori", resume: "Biochimiste (1896-1957), prix Nobel de médecine en 1947 pour le cycle de Cori, la transformation du glycogène." },
    { page: "Charles Darwin", nom: "Charles Darwin", resume: "Naturaliste anglais (1809-1882), auteur de la théorie de l'évolution par la sélection naturelle." },
    { page: "François Jacob (biologiste)", nom: "François Jacob", resume: "Biologiste français (1920-2013), prix Nobel en 1965 avec Jacques Monod et André Lwoff." },
    { page: "Max Perutz", nom: "Max Perutz", resume: "Biochimiste (1914-2002) qui a déterminé la structure de l'hémoglobine. Prix Nobel de chimie en 1962." },
    { page: "Otto Warburg", nom: "Otto Warburg", resume: "Biochimiste allemand (1883-1970), prix Nobel en 1931 pour ses travaux sur la respiration cellulaire." },
    { page: "Barbara McClintock", nom: "Barbara McClintock", resume: "Généticienne américaine (1902-1992), découvreuse des « gènes sauteurs » dans le maïs. Prix Nobel en 1983." },
    { page: "Albert Einstein", nom: "Albert Einstein", resume: "Physicien (1879-1955), auteur de la théorie de la relativité. Prix Nobel de physique en 1921." },
    { page: "Paul Ehrlich", nom: "Paul Ehrlich", resume: "Médecin allemand (1854-1915), pionnier de la chimiothérapie et de l'immunologie. Prix Nobel en 1908." },
  ],

  // ------------------------------------------------------------------
  // DOCUMENTAIRES — vidéos YouTube. « id » = ce qui suit « watch?v= ».
  // L'écran en propose 3 par jour, en tournant dans la liste.
  // ------------------------------------------------------------------
  videos: [
    { id: "YgTcmasv5Po", titre: "L'ADN et les liens entre les espèces", source: "C'est pas sorcier" },
    { id: "FVsta51URtg", titre: "Marie Curie, au-delà du mythe", source: "Arte" },
    { id: "IL3XOjI61Y8", titre: "Le système immunitaire", source: "Il était une fois… la Vie" },
    { id: "kNnxjwdBA54", titre: "Les maladies génétiques", source: "C'est pas sorcier" },
    { id: "PqyDgi_TY58", titre: "Les OGM", source: "C'est pas sorcier" },
    { id: "Ee_28BDkSjE", titre: "Les débuts de la vie", source: "Il était une fois… la Vie" },
  ],
};
