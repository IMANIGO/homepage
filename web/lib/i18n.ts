export type Locale = 'de' | 'en';

export const supportedLocales: Locale[] = ['de', 'en'];

export const pageRoutes = ['/software', '/transfer', '/sponsored', '/about', '/contact', '/impressum', '/datenschutz', '/nutzungsbedingungen', '/cookie-preferences', '/book-call'];

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
        panelText: 'IMANIGO delivers digital craftsmanship, trustworthy transfer logistics and authentic ads for your brand.'
      },
      meta: {
        description: 'IMANIGO offers custom software, car transfer services across Europe, and original content creation for brands and audiences.'
      },
      services: {
        eyebrow: 'What I do',
        title: 'Premium services for digital solutions, movement and visibility.',
        description: 'Choose the service path that fits your project: software with a problem-first mindset, safe vehicle transfer, or authentic sponsored content.',
        softwareSummary: 'Tailored software built around real business problems, from analysis to delivery.',
        transferSummary: 'Safe, documented vehicle handovers and transfers across Europe.',
        sponsoredSummary: 'Authentic sponsored formats with a personal voice audiences trust.'
      },
      softwareProjects: {
        title: 'Completed projects',
        description: 'Selected software work delivered for clients and partners.'
      },
      transferShowcase: {
        title: 'Tours and deliveries',
        description: 'Selected vehicle transfers and multi-day tours completed across Europe.'
      },
      transferStats: {
        title: 'Overview',
        totalJobs: 'Completed tours',
        totalKm: 'Kilometers driven',
        totalHours: 'Hours on assignment',
        abTours: 'A-B tours',
        abcTours: 'A-B-C tours',
        roundTours: 'Round trips',
        vehicles: 'Vehicle models',
        kmUnit: 'km',
        hoursUnit: 'h'
      },
      sponsoredShowcase: {
        title: 'Projects and brands',
        description: 'Campaigns and collaborations with brands I have worked with.'
      },
      tourTypes: {
        ab: 'A-B tour',
        abc: 'A-B-C tour',
        round: 'Round trip'
      },
      portfolio: {
        name: 'Name',
        customer: 'Customer',
        vehicle: 'Vehicle',
        route: 'Route',
        tourType: 'Tour type',
        features: 'Features',
        published: 'Details',
        website: 'Website'
      },
      softwarePortfolio: {
        name: 'Software',
        type: 'Type',
        customer: 'Customer',
        publishedOn: 'Published on',
        visibility: 'Visibility',
        visibilityPublic: 'Public',
        visibilityPrivate: 'Private',
        year: 'Year',
        features: 'Features',
        description: 'Description',
        downloads: 'Downloads',
        rating: 'Rating',
        premiumSubs: 'Premium subs'
      },
      softwareTypes: {
        mobile: 'Mobile app',
        web: 'Web app',
        desktop: 'Desktop app',
        other: 'Other'
      },
      sponsoredPortfolio: {
        title: 'Campaign',
        adType: 'Ad type',
        company: 'Company',
        publishedWhere: 'Published where',
        publishedWhen: 'Published when',
        audience: 'Target audience',
        description: 'Description',
        tags: 'Tags',
        views: 'Views',
        watchTime: 'Watch time',
        hoursUnit: 'h'
      },
      adTypes: {
        reel: 'Reel / short video',
        story: 'Story',
        video: 'Long-form video',
        post: 'Feed post',
        collaboration: 'Collaboration',
        other: 'Other'
      },
      about: {
        eyebrow: 'About IMANIGO',
        title: 'A company with a vision.',
        description: 'I combine software development, vehicle logistics and content creation so every project feels cohesive and reliable.'
      },
      trust: {
        eyebrow: 'Trust and transparency',
        title: 'Clear facts, honest progress.',
        description: 'I keep expectations grounded with measurable early-stage results and a transparent approach to new services.',
        fallbackQuote: 'I work directly with clients and share progress openly — references are available on request.',
        fallbackAuthor: 'Lukas Hradetzky',
        highlights: [
          { label: 'Approach', value: 'Direct', detail: 'You work with me personally, not a hand-off team.' },
          { label: 'Scope', value: 'Clear', detail: 'Every project starts with goals, constraints and next steps.' },
          { label: 'Delivery', value: 'Reliable', detail: 'Software, logistics and content handled with the same care.' }
        ]
      },
      cta: {
        bookCall: 'Book a free call',
        contact: 'Contact me',
        learnMore: 'Read the story',
        explore: 'Explore',
        related: 'Continue exploring',
        sendEmail: 'Send email request',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        skipToContent: 'Skip to content'
      },
      navLabels: {
        software: 'Software',
        transfer: 'Transfer',
        sponsored: 'Content',
        about: 'About',
        contact: 'Contact'
      },
      sidebar: {
        contactHeading: 'Talk to me',
        contactText: 'Start with a concise email or call me.',
        addressHeading: 'Base and business address',
        offerDisclaimer: 'Travel and hotel costs are required for vehicle transfer requests from Traunreut.'
      },
      footer: {
        contactHeading: 'Contact',
        email: 'contact@imanigo.de',
        addressLine1: 'Adalbert-Stifter-Str. 32',
        addressLine2: '83301 Traunreut',
        cookieNote: 'Essential cookies only. No analytics until consented.'
      },
      pageTitles: {
        software: 'Custom software for clients',
        transfer: 'Vehicle transfer across Europe',
        sponsored: 'Sponsored content and channel formats',
        about: 'About IMANIGO',
        contact: 'Contact and free call',
        impressum: 'Legal notice',
        datenschutz: 'Privacy policy',
        nutzungsbedingungen: 'Terms of use',
        'cookie-preferences': 'Cookie preferences',
        'book-call': 'Book a free call'
      },
      bookCall: {
        title: 'Free discovery call',
        description: 'I keep first calls short and focused so we can quickly identify whether we should work together.',
        mailSubject: 'Free discovery call request',
        mailBody: 'Hi,\n\nI would like to book a free discovery call.\n\nPreferred times:\n\nProject or topic:\n\nBest regards',
        steps: [
          { heading: 'Send a request', text: 'Use the button below to open a pre-filled email with your availability.' },
          { heading: 'Quick alignment', text: 'We clarify goals, scope and whether IMANIGO is the right fit.' },
          { heading: 'Next steps', text: 'If it makes sense, we agree on a concrete plan and timeline.' }
        ]
      }
    },
    de: {
      brand: 'IMANIGO',
      hero: {
        title: 'Software, Fahrzeugtransfer und Content Creation mit klarer Haltung.',
        subtitle: 'Ich löse technische Aufgaben, verfrachte Fahrzeuge durch Europa und produziere authentischen Content mit persönlicher Stimme.',
        badge: 'Einzelunternehmer',
        panelTitle: 'Ein Unternehmen. Drei Bereiche.',
        panelText: 'IMANIGO bietet digitale Lösungen, verlässliche Logistik und Werbung für Ihre Marke.'
      },
      meta: {
        description: 'IMANIGO entwickelt individuelle Software, übernimmt Fahrzeugtransfers in Europa und erstellt Content für Marken mit ehrlichem Stil.'
      },
      services: {
        eyebrow: 'Leistungen',
        title: 'Klare Angebote für Software, Transport und Sichtbarkeit.',
        description: 'Wählen Sie den Bereich, der zu Ihrem Projekt passt: maßgeschneiderte Software, sicherer Fahrzeugtransfer oder glaubwürdiger Sponsored Content.',
        softwareSummary: 'Individuelle Software für echte Geschäftsprobleme – von der Analyse bis zur Umsetzung.',
        transferSummary: 'Sichere, dokumentierte Fahrzeugübergaben und Transfers durch Europa.',
        sponsoredSummary: 'Authentische Sponsored-Formate mit persönlicher Stimme.'
      },
      softwareProjects: {
        title: 'Abgeschlossene Projekte',
        description: 'Ausgewählte Software-Projekte, die ich bereits umgesetzt habe.'
      },
      transferShowcase: {
        title: 'Touren und Überführungen',
        description: 'Ausgewählte Fahrzeugtransfers und mehrtägige Touren, die ich bereits durchgeführt habe.'
      },
      transferStats: {
        title: 'Gesamtstatistik',
        totalJobs: 'Abgeschlossene Touren',
        totalKm: 'Gefahrene Kilometer',
        totalHours: 'Stunden im Auftrag',
        abTours: 'A-B-Touren',
        abcTours: 'A-B-C-Touren',
        roundTours: 'Rundtouren',
        vehicles: 'Fahrzeugmodelle',
        kmUnit: 'km',
        hoursUnit: 'Std.'
      },
      sponsoredShowcase: {
        title: 'Projekte und Marken',
        description: 'Kampagnen und Kooperationen mit Marken, mit denen ich bereits zusammengearbeitet habe.'
      },
      tourTypes: {
        ab: 'A-B-Tour',
        abc: 'A-B-C-Tour',
        round: 'Rundtour'
      },
      portfolio: {
        name: 'Name',
        customer: 'Kunde',
        vehicle: 'Fahrzeug',
        route: 'Route',
        tourType: 'Tourart',
        features: 'Merkmale',
        published: 'Details',
        website: 'Website'
      },
      softwarePortfolio: {
        name: 'Software',
        type: 'Typ',
        customer: 'Kunde',
        publishedOn: 'Veröffentlicht auf',
        visibility: 'Sichtbarkeit',
        visibilityPublic: 'Öffentlich',
        visibilityPrivate: 'Privat',
        year: 'Jahr',
        features: 'Funktionen',
        description: 'Beschreibung',
        downloads: 'Downloads',
        rating: 'Bewertung',
        premiumSubs: 'Premium-Abo'
      },
      softwareTypes: {
        mobile: 'Mobile App',
        web: 'Web-App',
        desktop: 'Desktop-App',
        other: 'Sonstiges'
      },
      sponsoredPortfolio: {
        title: 'Kampagne',
        adType: 'Format',
        company: 'Unternehmen',
        publishedWhere: 'Veröffentlicht auf',
        publishedWhen: 'Veröffentlicht',
        audience: 'Zielgruppe',
        description: 'Beschreibung',
        tags: 'Tags',
        views: 'Aufrufe',
        watchTime: 'Wiedergabezeit',
        hoursUnit: 'Std.'
      },
      adTypes: {
        reel: 'Reel / Kurzvideo',
        story: 'Story',
        video: 'Langform-Video',
        post: 'Feed-Post',
        collaboration: 'Kooperation',
        other: 'Sonstiges'
      },
      about: {
        eyebrow: 'Über IMANIGO',
        title: 'Ein Unternehmen mit Vision.',
        description: 'Ich vereine Softwareentwicklung, Fahrzeuglogistik und Content Creation für eine stimmige Zusammenarbeit.'
      },
      trust: {
        eyebrow: 'Vertrauen und Offenheit',
        title: 'Klare Fakten, ehrlicher Fortschritt.',
        description: 'Ich halte Erwartungen realistisch mit messbaren frühen Ergebnissen und transparenter Kommunikation.',
        fallbackQuote: 'Ich arbeite direkt mit Kund:innen und halte den Fortschritt offen – Referenzen gibt es auf Anfrage.',
        fallbackAuthor: 'Lukas Hradetzky',
        highlights: [
          { label: 'Arbeitsweise', value: 'Direkt', detail: 'Sie arbeiten mit mir persönlich, nicht mit einem Weiterleitungsteam.' },
          { label: 'Umfang', value: 'Klar', detail: 'Jedes Projekt startet mit Zielen, Rahmen und nächsten Schritten.' },
          { label: 'Lieferung', value: 'Verlässlich', detail: 'Software, Logistik und Content mit derselben Sorgfalt.' }
        ]
      },
      cta: {
        bookCall: 'Kostenloses Gespräch buchen',
        contact: 'Kontakt aufnehmen',
        learnMore: 'Mehr erfahren',
        explore: 'Erkunden',
        related: 'Mehr erfahren',
        sendEmail: 'E-Mail senden',
        openMenu: 'Menü öffnen',
        closeMenu: 'Menü schließen',
        skipToContent: 'Zum Inhalt springen'
      },
      navLabels: {
        software: 'Software',
        transfer: 'Transfer',
        sponsored: 'Content',
        about: 'Über mich',
        contact: 'Kontakt'
      },
      sidebar: {
        contactHeading: 'Persönlicher Austausch',
        contactText: 'Schreiben Sie mir Ihr Anliegen per E-Mail oder rufen sie mich an.',
        addressHeading: 'Firmenstandort',
        offerDisclaimer: 'Für Fahrzeugtransfers werden Reise- und Hotelkosten ab Traunreut benötigt.'
      },
      footer: {
        contactHeading: 'Kontakt',
        email: 'contact@imanigo.de',
        addressLine1: 'Adalbert-Stifter-Str. 32',
        addressLine2: '83301 Traunreut',
        cookieNote: 'Nur essentielle Cookies. Keine Analyse ohne Zustimmung.'
      },
      pageTitles: {
        software: 'Individuelle Software für Kund:innen',
        transfer: 'Fahrzeugtransfer durch Europa',
        sponsored: 'Sponsored Content & Werbung',
        about: 'Über IMANIGO',
        contact: 'Kontakt und Erstgespräch',
        impressum: 'Impressum',
        datenschutz: 'Datenschutz',
        nutzungsbedingungen: 'Nutzungsbedingungen',
        'cookie-preferences': 'Cookie-Einstellungen',
        'book-call': 'Kostenloses Erstgespräch'
      },
      bookCall: {
        title: 'Kostenloses Erstgespräch',
        description: 'Ich halte Erstgespräche kurz und präzise, damit wir schnell prüfen können, ob eine Zusammenarbeit passt.',
        mailSubject: 'Anfrage für kostenloses Erstgespräch',
        mailBody: 'Hallo,\n\nich möchte ein kostenloses Erstgespräch vereinbaren.\n\nBevorzugte Zeiten:\n\nProjekt oder Thema:\n\nMit freundlichen Grüßen',
        steps: [
          { heading: 'Anfrage senden', text: 'Nutzen Sie den Button unten für eine vorausgefüllte E-Mail mit Ihren Wunschterminen.' },
          { heading: 'Kurze Abstimmung', text: 'Wir klären Ziele, Umfang und ob IMANIGO der richtige Partner ist.' },
          { heading: 'Nächste Schritte', text: 'Wenn es passt, vereinbaren wir einen konkreten Plan und Zeitrahmen.' }
        ]
      }
    }
  } as const;

  return dictionaries[locale];
};
