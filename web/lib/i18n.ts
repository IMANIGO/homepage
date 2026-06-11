export type Locale = 'de' | 'en';

export const supportedLocales: Locale[] = ['de', 'en'];

export const pageRoutes = ['/software', '/transfer', '/sponsored', '/about', '/contact', '/pym', '/impressum', '/datenschutz', '/nutzungsbedingungen', '/cookie-preferences', '/book-call'];

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
        copyEmail: 'Copy email address',
        emailCopied: 'Copied',
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
        pym: 'PlanYourMeals',
        impressum: 'Legal notice',
        datenschutz: 'Privacy policy',
        nutzungsbedingungen: 'Terms of use',
        'cookie-preferences': 'Cookie preferences',
        'book-call': 'Book a free call'
      },
      pym: {
        metaTitle: 'PYM – PlanYourMeals · Kitchen inventory, recipes and shopping lists',
        metaDescription:
          'PYM helps you track what is in your kitchen, plan meals, manage recipes and build shopping lists automatically. Available on iOS and as a web app.',
        brandLine: 'PlanYourMeals',
        badge: 'Kitchen app',
        title: 'Know what is in your kitchen. Cook with less waste.',
        subtitle:
          'PYM tracks pantry items, reminds you before food expires, suggests recipes from what you have and keeps your shopping list in sync — offline first, cloud sync optional.',
        panelEyebrow: 'PYM',
        panelTitle: 'The operating system for your kitchen.',
        panelText: 'Scan barcodes, manage expiry dates, import recipes and let PYM fill your shopping list when stock runs low.',
        featuresEyebrow: 'Overview',
        featuresTitle: 'Everything for calmer cooking and smarter shopping.',
        featuresDescription: 'From pantry to plate — PYM connects inventory, recipes and your shopping list in one calm workflow.',
        features: [
          {
            tag: 'Pantry',
            title: 'Track what you have',
            description: 'Add items by barcode or manually with category, quantity, storage location and expiry date.'
          },
          {
            tag: 'Recipes',
            title: 'Cook from your stock',
            description: 'Save your own recipes or import from the web. Step-by-step cooking mode with timers included.'
          },
          {
            tag: 'Planning',
            title: 'See what you can cook today',
            description: 'PYM shows which recipes match the ingredients already in your kitchen.'
          },
          {
            tag: 'Shopping',
            title: 'Automatic shopping list',
            description: 'When an item hits zero, it lands on your list. Check it off after shopping and stock updates instantly.'
          },
          {
            tag: 'Expiry',
            title: 'Less food waste',
            description: 'Get reminded before products expire so more ends up on the plate instead of in the bin.'
          },
          {
            tag: 'Sync',
            title: 'Your data, your choice',
            description: 'Works fully offline. Optional free account for cloud sync across devices.'
          }
        ],
        screenshots: {
          eyebrow: 'Screenshots',
          title: 'A quick look inside PYM.',
          description: 'Add your own app screenshots in web/public/images/pym/ and list them in web/lib/pym-config.ts.',
          placeholder: 'Screenshot slot — add an image in pym-config.ts',
          fallbackAlt: 'PYM app screenshot'
        },
        screenshotAlts: {
          pantry: 'PYM pantry overview',
          recipes: 'PYM recipe collection',
          shoppingList: 'PYM shopping list'
        },
        downloadEyebrow: 'Get started',
        downloadTitle: 'Download PYM or open the web app.',
        downloadDescription: 'Free to start. Premium features such as family sharing are available as an optional subscription.',
        cta: {
          appStore: 'Download on the App Store',
          playStore: 'Get it on Google Play',
          playStoreSoon: 'Google Play — coming soon',
          webApp: 'Open web app'
        },
        footerNote: 'PYM is developed by IMANIGO. Legal information about the website and apps is linked below.',
        legalEyebrow: 'Legal',
        backToLanding: 'Back to PYM'
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
        copyEmail: 'E-Mail-Adresse kopieren',
        emailCopied: 'Kopiert',
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
        pym: 'PlanYourMeals',
        impressum: 'Impressum',
        datenschutz: 'Datenschutz',
        nutzungsbedingungen: 'Nutzungsbedingungen',
        'cookie-preferences': 'Cookie-Einstellungen',
        'book-call': 'Kostenloses Erstgespräch'
      },
      pym: {
        metaTitle: 'PYM – PlanYourMeals · Vorrat, Rezepte und Einkaufsliste',
        metaDescription:
          'PYM zeigt dir, was in deiner Küche ist, erinnert an Ablaufdaten, schlägt Rezepte vor und pflegt deine Einkaufsliste automatisch. Für iOS und als Web-App.',
        brandLine: 'PlanYourMeals',
        badge: 'Küchen-App',
        title: 'Wisse, was in deiner Küche ist. Koche mit weniger Verschwendung.',
        subtitle:
          'PYM verwaltet deinen Vorrat, erinnert dich vor dem Ablauf, schlägt Rezepte aus vorhandenen Zutaten vor und hält die Einkaufsliste automatisch aktuell — offline nutzbar, Cloud-Sync optional.',
        panelEyebrow: 'PYM',
        panelTitle: 'Das Betriebssystem für deine Küche.',
        panelText: 'Barcodes scannen, Ablaufdaten im Blick behalten, Rezepte importieren und die Einkaufsliste füllen lassen, sobald etwas leer wird.',
        featuresEyebrow: 'Überblick',
        featuresTitle: 'Alles für entspannteres Kochen und smarteres Einkaufen.',
        featuresDescription: 'Vom Vorrat bis auf den Teller — PYM verbindet Bestand, Rezepte und Einkaufsliste in einem ruhigen Workflow.',
        features: [
          {
            tag: 'Vorrat',
            title: 'Behalte den Überblick',
            description: 'Artikel per Barcode oder manuell erfassen — mit Kategorie, Menge, Lagerort und Ablaufdatum.'
          },
          {
            tag: 'Rezepte',
            title: 'Koche mit dem, was da ist',
            description: 'Eigene Rezepte anlegen oder per Link importieren. Kochmodus mit Schritt-für-Schritt-Anleitung und Timer.'
          },
          {
            tag: 'Planung',
            title: 'Was kann ich heute kochen?',
            description: 'PYM zeigt, welche Rezepte zu den Zutaten passen, die du bereits zuhause hast.'
          },
          {
            tag: 'Einkauf',
            title: 'Automatische Einkaufsliste',
            description: 'Sinkt ein Artikel auf 0, landet er auf der Liste. Nach dem Einkauf abhaken — der Vorrat aktualisiert sich sofort.'
          },
          {
            tag: 'Ablauf',
            title: 'Weniger Lebensmittelverschwendung',
            description: 'Rechtzeitige Erinnerungen, bevor Produkte ablaufen — mehr auf dem Teller, weniger im Müll.'
          },
          {
            tag: 'Sync',
            title: 'Deine Daten, deine Wahl',
            description: 'Vollständig offline nutzbar. Optionales kostenloses Konto für Cloud-Sync zwischen Geräten.'
          }
        ],
        screenshots: {
          eyebrow: 'Screenshots',
          title: 'Ein Blick in die App.',
          description: 'Eigene Screenshots unter web/public/images/pym/ ablegen und in web/lib/pym-config.ts eintragen.',
          placeholder: 'Screenshot-Platz — Bild in pym-config.ts hinzufügen',
          fallbackAlt: 'PYM App-Screenshot'
        },
        screenshotAlts: {
          pantry: 'PYM Vorratsübersicht',
          recipes: 'PYM Rezeptsammlung',
          shoppingList: 'PYM Einkaufsliste'
        },
        downloadEyebrow: 'Loslegen',
        downloadTitle: 'PYM herunterladen oder Web-App öffnen.',
        downloadDescription: 'Kostenlos starten. Premium-Funktionen wie Familien-Sharing sind optional als Abo verfügbar.',
        cta: {
          appStore: 'Im App Store laden',
          playStore: 'Bei Google Play laden',
          playStoreSoon: 'Google Play — bald verfügbar',
          webApp: 'Web-App öffnen'
        },
        footerNote: 'PYM wird von IMANIGO entwickelt. Rechtliche Informationen zur Website und zu den Apps findest du unten.',
        legalEyebrow: 'Rechtliches',
        backToLanding: 'Zurück zu PYM'
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
