export type Locale = 'de' | 'en';

export const supportedLocales: Locale[] = ['de', 'en'];

export const pageRoutes = ['/software', '/transfer', '/sponsored', '/about', '/contact', '/impressum', '/datenschutz', '/cookie-preferences', '/book-call'];

export const getSupportedLocales = () => supportedLocales;

export const getDictionary = (locale: Locale) => {
  const dictionaries = {
    en: {
      brand: 'IMANIGO',
      hero: {
        title: 'Software, vehicle transfer and content creation with transparent clarity.',
        subtitle: 'I solve technical problems, move cars across Europe and build sponsored content with a calm, personal voice.',
        badge: 'Independent service',
        panelTitle: 'One business. Three services.',
        panelText: 'IMANIGO delivers digital craftsmanship, trustworthy transfer logistics and authentic channel partnerships from Traunreut.'
      },
      meta: {
        description: 'IMANIGO offers custom software, car transfer services across Europe, and original content creation for brands and audiences.'
      },
      services: {
        eyebrow: 'What I do',
        title: 'Premium services for growth, movement and visibility.',
        description: 'Choose the service path that fits your project: software with a problem-first mindset, safe vehicle transfer, or authentic sponsored content.'
      },
      about: {
        eyebrow: 'About IMANIGO',
        title: 'A company built for real-world work.',
        description: 'I combine software development, vehicle logistics and content creation so every project feels cohesive and reliable.'
      },
      trust: {
        eyebrow: 'Trust and transparency',
        title: 'Clear facts, honest progress.',
        description: 'I keep expectations grounded with measurable early-stage results and a transparent approach to new services.'
      },
      cta: {
        bookCall: 'Book a free call',
        contact: 'Contact me',
        learnMore: 'Read the story',
        explore: 'Explore this page'
      },
      sidebar: {
        contactHeading: 'Talk to me',
        contactText: 'Start with a concise email or call request.',
        addressHeading: 'Base and business address',
        offerDisclaimer: 'Travel and hotel costs are required for vehicle transfer requests from Traunreut.'
      },
      pageTitles: {
        software: 'Custom software for clients',
        transfer: 'Vehicle transfer across Europe',
        sponsored: 'Sponsored content and channel formats',
        about: 'About IMANIGO',
        contact: 'Contact and free call',
        impressum: 'Impressum',
        datenschutz: 'Datenschutz',
        'cookie-preferences': 'Cookie preferences',
        'book-call': 'Book a free call'
      },
      bookCall: {
        title: 'Free discovery call',
        description: 'I keep first calls short and focused so we can quickly identify whether we should work together.'
      }
    },
    de: {
      brand: 'IMANIGO',
      hero: {
        title: 'Software, Fahrzeugtransfer und Content Creation mit klarer Haltung.',
        subtitle: 'Ich löse technische Aufgaben, verfrachte Fahrzeuge durch Europa und produziere authentischen Content mit persönlicher Stimme.',
        badge: 'Einzelunternehmer',
        panelTitle: 'Ein Unternehmen. Drei Bereiche.',
        panelText: 'IMANIGO bietet digitale Lösungen, verlässliche Logistik und echte Inhalte aus Traunreut.'
      },
      meta: {
        description: 'IMANIGO entwickelt individuelle Software, übernimmt Fahrzeugtransfers in Europa und erstellt Content für Marken mit ehrlichem Stil.'
      },
      services: {
        eyebrow: 'Leistungen',
        title: 'Klare Angebote für Software, Transport und Sichtbarkeit.',
        description: 'Wählen Sie den Bereich, der zu Ihrem Projekt passt: maßgeschneiderte Software, sicherer Fahrzeugtransfer oder glaubwürdiger Sponsored Content.'
      },
      about: {
        eyebrow: 'Über IMANIGO',
        title: 'Ein Unternehmen für echte Arbeit.',
        description: 'Ich vereine Softwareentwicklung, Fahrzeuglogistik und Content Creation für eine stimmige Zusammenarbeit.'
      },
      trust: {
        eyebrow: 'Vertrauen und Offenheit',
        title: 'Klare Fakten, ehrlicher Fortschritt.',
        description: 'Ich halte Erwartungen realistisch mit messbaren frühen Ergebnissen und transparenter Kommunikation.'
      },
      cta: {
        bookCall: 'Kostenloses Gespräch buchen',
        contact: 'Kontakt aufnehmen',
        learnMore: 'Mehr erfahren',
        explore: 'Diese Seite öffnen'
      },
      sidebar: {
        contactHeading: 'Sprechen wir',
        contactText: 'Schreiben Sie kurz oder senden Sie eine Anfrage für ein Gespräch.',
        addressHeading: 'Adresse',
        offerDisclaimer: 'Für Fahrzeugtransfers werden Reise- und Hotelkosten ab Traunreut benötigt.'
      },
      pageTitles: {
        software: 'Individuelle Software für Kund:innen',
        transfer: 'Fahrzeugtransfer durch Europa',
        sponsored: 'Sponsored Content und Formate',
        about: 'Über IMANIGO',
        contact: 'Kontakt und Erstgespräch',
        impressum: 'Impressum',
        datenschutz: 'Datenschutz',
        'cookie-preferences': 'Cookie-Einstellungen',
        'book-call': 'Kostenloses Erstgespräch'
      },
      bookCall: {
        title: 'Kostenloses Erstgespräch',
        description: 'Ich halte Erstgespräche kurz und präzise, damit wir schnell prüfen können, ob eine Zusammenarbeit passt.'
      }
    }
  } as const;

  return dictionaries[locale];
};
