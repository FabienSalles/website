// Types
export interface Recommendation {
  name: string;
  recommendation: string;
  note: number; // 1 à 5
}

export interface FormationSession {
  name: string;
  number: number;
  date: string; // format "yyyy-mm"
  recommendations?: Recommendation[];
}

// Données des formations
export const formationSessions: FormationSession[] = [
  {
    date: '2026-02',
    name: 'ddd',
    number: 22,
  },
  {
    date: '2025-12',
    name: 'phpunit',
    number: 4,
    recommendations: [
      {
        name: 'Igor G.',
        note: 4.9,
        recommendation: "Bonne pédagogie de Fabien. Beaucoup d’informations importantes distillées au cours de la formation pour agrémenter le support de cours et qui permettent de réfléchir sur l’importance des tests pour clarifier le code et permettre d’améliorer la compréhension du code pour des personnes arrivant sur un projet."
      }
    ]
  },
  {
    date: '2025-11',
    name: 'git',
    number: 4,
  },
  {
    date: '2025-04',
    name: 'git',
    number: 5,
    recommendations: [
      {
        name: 'Gilles S.',
        note: 4.7,
        recommendation: "Le formateur connait bien son sujet. Globalement bonne pédagogie, attentif à chaque stagiaire."
      }
    ]
  },
  {
    date: '2024-12',
    name: 'phpunit',
    number: 3
  },
  {
    date: '2024-09',
    name: 'git',
    number: 6,
    recommendations: [
      {
        name: 'Audrey N.',
        note:  4.7,
        recommendation: "Formation répondant parfaitement à mes objectifs : beaucoup de notions vues, explications et réponses aux questions très claires, beaucoup de pratique afin de se sentir à l'aise pour utiliser les commandes GIT."
      }
    ]
  },
  {
    date: '2024-06',
    name: 'git',
    number: 11,
    recommendations: [
      {
        name: 'Sarah Z.',
        note: 5,
        recommendation: "Contenu très complet et intervenant pédagogue et patient"
      }
    ]
  },
  {
    date: '2024-03',
    name: 'git',
    number: 4,
    recommendations: [
      {
        name: 'Victor B.',
        note: 4.9,
        recommendation: 'formateur pédagogue, étant en nombre restreint, il a pu nous expliquer en longueur les détails sur lesquels nous avions des soucis.'
      },
      {
        name: 'Yann M.',
        note: 4.9,
        recommendation: "Intéressant car on a testé de vrais cas et on a comparé avec notre situation professionnelle réelle++ : Souplesse du formateur sur l’adaptation du cours"
      },
      {
        name: 'Fredy R.',
        note: 4.6,
        recommendation: "Stage très vivant et formateur, le formateur a su s’adapter aux besoins de chacun !"
      },
      {
        name: 'Alexandre T..',
        note: 4.7,
        recommendation: "Très bien, le formateur s’adapte aux besoins spécifiques des participants. On a pu faire des exercices sur notre environnement de travail (Eclipse)"
      }
    ]
  },
  {
    date: "2020-01",
    name: 'git',
    number: 10
  },
  {
    date: "2019-12",
    name: 'phpunit',
    number: 5,
  },
  {
    date: '2019-09',
    name: 'phpunit',
    number: 6,
  },
  {
    date: '2019-01',
    name: 'symfony',
    number: 8,
  },
  {
    date: '2018-05',
    name: 'symfony',
    number: 14,
  },
  {
    date: '2017-02',
    name: 'phpunit',
    number: 3,
    recommendations: [
      {
        name: 'Rodolphe S.',
        note: 4,
        recommendation: "Animateur très compétent et sympathique"
      }
    ]
  },
  {
    date: '2017-02',
    name: 'phpunit',
    number: 2,
    recommendations: [
      {
        name: 'Jessica A',
        note: 4.6,
        recommendation: "Fabien SALLES connait très bien son sujet et est très à l'écoute."
      },
      {
        name: 'Paul Jean P.',
        note: 4.6,
        recommendation: 'Flexible sur le contenu'
      }
    ]
  },
  {
    date: '2017-06',
    name: 'phpunit',
    number: 3
  },
  {
    date: '2017-01',
    name: 'sql',
    number: 10,
  },
  {
    date: '2017-02',
    name: 'symfony',
    number: 7,
    recommendations: [
      {
        name: "Kevin G.",
        note: 4.7,
        recommendation: "RAS, très disponible et pédagogue",
      },
      {
        name: 'François D.',
        note: 4.9,
        recommendation: "Formation très enrichissante. Réponse précises et complètes aux questions"
      },
      {
        name: 'Alexandre S.',
        note: 4.7,
        recommendation: "Dynamique, sympa et professionnel"
      }
    ]
  },
  {
    date: '2016-12',
    name: 'symfony',
    number:  6,
    recommendations: [
      {
        name: "Thierry S.",
        note: 5,
        recommendation: "Formation claire et utile",
      },
      {
        name: 'Benjamin B.',
        note: 5,
        recommendation: "Formateur bon pédagogue, à l'écoute et pertinent dans ses réponses"
      }
    ]
  },
  {
    date: '2016-11',
    name: 'symfony',
    number:  4
  }
];

// Fonctions utilitaires

/**
 * Récupère toutes les sessions triées par date décroissante
 */
export function getAllSessions(): FormationSession[] {
  return [...formationSessions].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Récupère les sessions par nom de formation
 */
export function getSessionsByFormation(formationName: string): FormationSession[] {
  return formationSessions
    .filter(s => s.name.toLowerCase().includes(formationName.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Récupère toutes les recommandations de toutes les formations
 */
export function getAllRecommendations(): (Recommendation & { formationName: string; date: string })[] {
  return formationSessions
    .flatMap(session =>
      (session.recommendations || []).map(reco => ({
        ...reco,
        formationName: session.name,
        date: session.date
      }))
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Récupère les recommandations pour une formation spécifique
 */
export function getRecommendationsByFormation(formationName: string): (Recommendation & { date: string })[] {
  return formationSessions
    .filter(s => s.name.toLowerCase().includes(formationName.toLowerCase()))
    .flatMap(session =>
      (session.recommendations || []).map(reco => ({
        ...reco,
        date: session.date
      }))
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Calcule les statistiques globales
 */
export function getStats(): { sessions: number; participants: number; recommendations: number } {
  return {
    sessions: formationSessions.length,
    participants: formationSessions.reduce((sum, s) => sum + s.number, 0),
    recommendations: formationSessions.reduce((sum, s) => sum + (s.recommendations?.length || 0), 0)
  };
}

/**
 * Formate une date yyyy-mm en "Mois Année"
 */
export function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return `${months[parseInt(month) - 1]} ${year}`;
}
