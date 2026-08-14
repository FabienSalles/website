---
title: "Audit technique avant rachat : ce qu'il faut vérifier"
description: "Audit technique avant rachat : ce qui peut bloquer la reprise, ce qui la complique, et ce qu'une lecture de code ne pourra jamais te dire."
draft: true
pubDate: 2026-10-06
categories: [audit, strategie]
series: audit
service: audit
---

Un rapport d'audit technique classe les problèmes par gravité : critique, majeur, mineur. C'est utile quand on veut redresser une application qu'on garde.

Devant un rachat, ce classement ne répond pas forcément à la bonne question.

La gravité d'un défaut dépend de ce que l'acquéreur compte faire du logiciel. Une dette technique lourde sur un module qu'on éteindra dans six mois ne coûte presque rien. La même dette sur le composant qui doit absorber trois fois plus d'utilisateurs l'an prochain change la nature du deal. Pourtant, la plupart des audits produisent la même liste. Dans les deux cas.

Cet écart est le vrai sujet d'une due diligence<sup>[1](#glossaire)</sup> technique : ce système tient-il la promesse pour laquelle on l'achète ?

## L'intention de l'acheteur commande tout le reste

Je n'ouvre pas le code avant d'avoir eu cette conversation.

Un acquéreur peut viser quatre choses très différentes.

1. Il peut vouloir la clientèle. L'application est alors un véhicule : on migre progressivement les clients vers sa propre plateforme, puis on éteint l'existant.

2. Il peut vouloir les données elles-mêmes, indépendamment des clients et du code. Un historique, un référentiel, un volume qui a mis des années à se constituer et qu'on ne peut pas racheter ailleurs.

3. Il peut vouloir exploiter le produit tel quel. On maintient, on encaisse, on n'ajoute pas de fonctionnel.

4. Ou il peut vouloir accélérer, et faire évoluer le produit dans une direction que sa trajectoire actuelle n'a jamais anticipée.

Le même constat technique ne pèse pas pareil dans ces quatre cas.

En reprise de clientèle, le modèle de données et les contrats décident de tout. La qualité du code ne pèse presque rien, puisque l'application finira éteinte.

Quand ce sont les données seules qu'on vise, même logique en plus resserré : leur structure et leur fiabilité font le prix.

En exploitation telle quelle, un vieux monolithe que personne n'a envie de toucher reste un bon actif tant qu'il est stable. On ne lui demande pas de changer.

En accélération, la lecture s'inverse. Ce n'est plus l'état du code qui compte, mais sa capacité à suivre la direction envisagée.

## Avant de savoir ce que vaut le logiciel, vérifier qu'on peut le reprendre

C'est l'ordre que j'ai fini par adopter. Évaluer la qualité d'une application dont on découvre ensuite qu'on ne peut pas l'exploiter, c'est du travail perdu.

Un préalable commande toute cette section : achète-t-on les titres de la société, ou ses actifs ? En cession de titres, la personne morale ne change pas et les contrats suivent tout seuls. Seule une clause de changement de contrôle<sup>[2](#glossaire)</sup> peut se déclencher. En cession d'actifs, rien ne suit. Chaque contrat doit être cédé un par un, avec l'accord écrit du cocontractant, comme le prévoit l'article 1216 du Code civil.

La même application est donc reprenable dans un montage et peut être bloquée dans l'autre.

### Ce qui peut bloquer une reprise

Cette partie n'est pas le cœur de mon métier. Elle relève d'une expertise juridique, et personne ne devrait s'en passer sur une opération réelle. J'ai quand même un droit de regard : je peux voir dans le code et dans l'exploitation ce qui peut poser problème.

Les points que je remonte, sans prétendre les traiter :

- Les composants payants embarqués : une licence peut interdire le transfert, ou être rattachée nominativement et uniquement à la société vendeuse.
- L'open source : certaines licences imposent en retour de publier le code qui les utilise<sup>[3](#glossaire)</sup>, et un composant sans licence ne donne aucun droit d'usage.
- Les dépendances externes et partenaires : que se passe-t-il s'ils cessent leurs activités, refusent de continuer, ou sont rachetés par un concurrent de l'acquéreur ?
- Les moyens de déployer : scripts d'infrastructure, procédures d'exploitation et chaînes de déploiement font-ils partie du périmètre cédé ? Récupérer le code sans pouvoir le mettre en production ne permet pas de l'exploiter.

### Les droits sur le code écrit par un prestataire

Un dernier point mérite une mention à part, parce qu'il touche directement au code.

En France, les droits sur un logiciel écrit par un salarié dans le cadre de ses fonctions reviennent automatiquement à l'employeur. Cette dévolution repose sur le lien de subordination, et elle ne joue donc pas hors salariat : freelance, société de services, dirigeant non salarié. Dans ces cas, il faut une cession de droits<sup>[4](#glossaire)</sup> écrite, et avoir payé la prestation ne suffit pas à l'établir.

Il arrive qu'une entreprise ait fait développer une partie de son logiciel par un prestataire externe, sur la base d'un bon de commande qui ne dit rien des droits. Je ne qualifie jamais juridiquement ces situations. Ce n'est pas mon métier. Je pose la question et constate l'absence de contrat écrit, parce que l'incertitude qui en découle est elle-même le risque.

## Les dépendances qui compliquent sans bloquer

Une fois écartés les verrous, il reste tout ce qui ne bloque pas la reprise mais peut peser sur elle pendant des années.

### Trois dépendances à repérer

La dépendance à un service externe. Quand une fonctionnalité centrale repose sur une plateforme tierce, l'entreprise peut perdre une partie de son produit si les conditions d'accès se voient modifiées ou si le service externe ferme totalement.

La dépendance aux versions ensuite. Un langage ou un framework qui n'est plus maintenu laisse l'application exposée à des failles de sécurité et à une dette technique qui augmente sur la durée.

La dépendance aux personnes enfin. Quand un composant critique n'a qu'un seul auteur dans tout l'historique, le système devient difficilement modifiable le jour de son départ.

Une question manque souvent à ce stade : qui reste après la vente, sous quel engagement, et qui porte le cœur métier parmi eux ?

Quand plus personne n'est en mesure de transmettre le produit, parce que l'équipe est partie ou que la passation n'aura pas lieu, il reste une option. Reconstituer la documentation à partir du code et de l'historique. C'est une prestation que j'assure. Ça ne remplace pas ce que les gens savaient, mais ça rend un système reprenable.

### Qui impose son modèle à qui

Une dépendance technique recouvre souvent une question de position. Un système qui adopte le modèle d'un tiers, son langage et ses spécificités, perd sa liberté : chaque changement décidé en face a des conséquences lourdes, qu'il faut suivre et répercuter partout où ce modèle a été recopié. À l'inverse, un système qui pose une couche de protection entre les deux, ce qu'on appelle une couche anticorruption, garde sa liberté de mouvement et limite les dégâts quand le tiers évolue.

Reste à savoir qui détient la donnée. Une application qui ne fait que la transiter pour la reformuler dans le langage d'un tiers ne détient pas le cœur métier qu'elle revendique. Elle en est l'intermédiaire.

En rachetant l'application, on rachète cette position. Elle relève rarement du seul choix technique, et c'est ce que j'explore dans [Ce que ton code dit de ton organisation](/blog/2026/09/ce-que-ton-code-dit-de-ton-organisation/).

## Identifier le cœur métier

Admettons que la reprise soit possible. On peut enfin regarder ce qu'on achète.

On peut distinguer trois natures de briques dans une application.

- **Le cœur métier**<sup>[5](#glossaire)</sup> est ce qui différencie l'entreprise de ses concurrents : le calcul qui décide du prix chez un courtier, le moteur de conformité réglementaire, la mécanique qui fait que les clients viennent chez elle plutôt qu'ailleurs.
- **Les sous-domaines support**<sup>[6](#glossaire)</sup> sont nécessaires au fonctionnement sans rien différencier : la gestion documentaire, le paramétrage, les exports.
- **Les sous-domaines génériques**<sup>[7](#glossaire)</sup> couvrent l'authentification, l'envoi d'emails, l'émission de factures, tout ce que chacun fait sans s'en différencier.

Cette classification vient du Domain-Driven Design, que j'[enseigne en formation](/formations/ddd/) et que je pratique depuis **2014**. Ce qu'elle apporte à un audit de rachat, c'est une lecture stratégique que le code seul ne donne pas. Elle montre où l'effort de développement a été mis, et permet de se demander s'il l'a été au bon endroit.

Le même défaut ne se lit pas pareil selon la brique où il se trouve.

Une dette sur du générique se règle en remplaçant le composant par un service existant. Du travail, aucun danger. La même dette sur le cœur métier attaque ce pour quoi on paie : si le calcul de prix est illisible et que personne ne sait plus le modifier, l'entreprise ne peut plus faire évoluer son avantage concurrentiel.

Reste à savoir classer. ### Trier les briques d'une application

### Une question ne suffit pas à trancher

Il existe une question rapide pour trier une brique applicative : **est-ce que cela dérangerait qu'un concurrent utilise exactement le même composant ?**

Ensuite il y a un deuxième critère, la complexité. Croiser les deux change les réponses. Une brique très différenciante mais simple donne un avantage réel mais éphémère. Le concurrent rattrape relativement vite. Une brique complexe mais qui ne différencie personne signale de la complexité accidentelle, accumulée là où elle n'aurait jamais dû l'être.

Même avec nos réponses il faut arriver à lire entre les lignes.

Toute équipe répondra « oui, ça me dérangerait » à propos de ce qu'elle a construit elle-même. La question mesure alors l'attachement, pas le marché.

### Ce que l'historique confirme ou dément

L'historique du code donne un signal plus fiable que le discours. Si les contributions sur le composant prétendument différenciant viennent uniquement des profils juniors, on peut émettre des doutes sur le différenciant lui-même. Un cœur métier suppose une complexité qui réclame de l'expertise. Quand cette expertise n'apparaît nulle part, il faut envisager que l'avantage revendiqué n'en soit pas un.

On peut aussi avoir une complexité applicative faible derrière laquelle se cache une forte complexité métier, si celle-ci se joue en dehors de l'application.

Prenons un module de saisie de devis. Le code est un formulaire, l'équipe technique répond honnêtement que non, ça ne la dérange pas qu'un concurrent ait le même. Elle a raison sur le code. Sauf que les commerciaux appliquent de tête des règles de remise qui ne sont écrites nulle part dans le logiciel. La complexité existe. Elle n'est pas dans l'application, et le vrai actif de l'entreprise est ailleurs.

### La durée de vie d'un avantage

Reste à savoir si l'avantage concurrentiel va perdurer dans le temps. Tout ce qui a de la valeur finit par se banaliser : ce qui relevait de l'invention devient un produit, puis une commodité que le marché fournit à tout le monde.

Ponicode génère des tests unitaires par intelligence artificielle. La société lève 3 millions d'euros en 2020, puis se fait racheter par CircleCI en mars 2022. Aujourd'hui, son site redirige vers celui de l'acquéreur, son extension a disparu du catalogue, et aucune offre de CircleCI ne porte cette technologie. Entre-temps, générer un test est devenu une fonction ordinaire des assistants de code.

Il faut donc étudier la trajectoire et déterminer si la valeur de l'avantage concurrentiel affiché peut être remise en question.

## Les données valent souvent plus que le code

Quand on rachète un portefeuille de clients, l'actif réel n'est peut-être pas l'application. C'est ce qu'il y a dans la base.

### Où se fait la validation

La première chose à regarder, c'est la structure des données. Des contraintes en base, avec des types stricts, des clés étrangères et des valeurs obligatoires, garantissent que la donnée respecte un minimum de règles, quelle que soit la façon dont elle est entrée. On peut aussi regarder les points d'entrée : est-ce que la donnée est normalisée et validée de manière cohérente lors de l'insertion, ou existe-t-il de multiples manières d'ingérer la donnée sans cohérence sur les traitements effectués ?

La structure décide ensuite du coût de reprise. Un modèle relationnel documenté et contraint se migre. On connaît les entités, leurs relations et leurs types. Un stockage documentaire, ou des colonnes qui contiennent du texte libre ou des structures sans schéma imposé, demande d'abord un travail d'archéologie. Il faut deviner la forme des données, si elle a changé à plusieurs reprises et écrire un convertisseur pour chaque variante.

Les dimensions à instruire sont connues et stables depuis longtemps : complétude, exactitude, cohérence, unicité, validité, fraîcheur...

### Quand deux systèmes ne parlent pas de la même chose

Un dernier écueil, qui ne se voit qu'en comparant deux systèmes. Deux produits appellent « client » deux choses qui n'ont pas la même forme. L'un enregistre une ligne par entreprise, avec des contacts rattachés. L'autre enregistre une ligne par personne, reliée à des entreprises. Sur le papier, les deux ont des clients. Dans les faits, faire passer les données de l'un à l'autre n'est pas une migration. C'est une refonte du modèle.

Si la donnée doit être migrée, il faut donc vérifier qu'elle respecte bien l'ensemble des critères de l'outil cible.

## La sécurité et son passif de conformité suivent l'application

### Ce qui se vérifie côté technique

Une dépendance se subit. Un passif, lui, se transmet. Quelques questions pour situer le niveau de risque :

- L'application ou ses dépendances portent-elles des failles connues ?
- Reste-t-il des secrets en clair dans le dépôt ?
- Comment l'authentification et les habilitations sont-elles gérées ?
- Les données sensibles sont-elles chiffrées ?
- Quels incidents de sécurité ont déjà eu lieu, et comment ont-ils été traités ?
- Quelles données sensibles sont conservées, et quels mécanismes de suppression existent ?
- Comment revient-on en arrière sur le code ou sur la base en cas de corruption ?
- Y a-t-il des sauvegardes, et leur restauration a-t-elle déjà été testée ?

### Le passif qui change de propriétaire

Quand une application traite des données personnelles et que l'opération porte sur les titres de la société, les manquements accumulés avant la vente ne disparaissent pas avec le changement d'actionnaire.

Exemple avec le cas Marriott. Le groupe rachète Starwood en 2016. Deux ans plus tard, il découvre que les serveurs de réservation de Starwood étaient compromis depuis 2014, et qu'environ 339 millions d'enregistrements clients ont fuité, dont des numéros de passeport en partie non chiffrés et des données de carte bancaire, elles, chiffrées. Le régulateur britannique a infligé 18,4 millions de livres, après avoir annoncé une intention de sanction à 99 millions. Le motif retenu ne porte pas sur l'attaque d'origine, mais sur un manquement à l'article 32 du RGPD, la sécurité des traitements : supervision insuffisante des comptes à privilèges, durcissement incomplet des serveurs, données sensibles non chiffrées. Marriott a exploité pendant deux ans un système compromis sans détecter la brèche. C'est cette période qui a été sanctionnée.

En France, ce serait la CNIL. Pour les manquements les plus graves, l'article 83, paragraphe 5, du RGPD plafonne la sanction à 20 millions d'euros, ou à 4 % du chiffre d'affaires annuel mondial si ce montant est supérieur. Ce plafond se calcule sur le chiffre d'affaires du groupe : pour un même manquement historique, il monte donc mécaniquement une fois la société entrée dans un ensemble plus gros.

## Les métriques de qualité ne prouvent rien

On peut montrer un pourcentage de couverture de code sur les tests. Il mesure la part du code exécutée pendant les tests, pas la part du code vérifiée. Un test peut parcourir toute l'application sans rien affirmer : il passe au vert, il compte dans la couverture, il ne détecte rien.

Depuis qu'un agent peut générer une suite complète sur une application existante, le chiffre vaut encore moins. Faute de spécification, le modèle déduit le comportement attendu du code qu'il a sous les yeux. Il enregistre la sortie actuelle comme référence, bug compris, et passe au vert.

Ce qui compte, c'est de savoir si ces tests aideront l'équipe qui reprend ou s'ils la ralentiront. Un test couplé à l'implémentation casse au moindre réagencement qui ne change rien pour l'utilisateur, et ne bronche pas quand une règle métier est cassée.

Pour vérifier cela, deux lectures sont possibles :
1. les tests de mutation pour vérifier qu'un test est bien utile
2. la lecture des pratiques de tests pour vérifier leur qualité et leur pérennité

Plusieurs sujets manquent ici, et ils ne tiennent pas dans un seul article.

- La qualité du code elle-même, et ce que les métriques en disent ou n'en disent pas.
- La chaîne de livraison : fréquence de mise en production, revue de code, environnements, retour arrière, observabilité.
- La faisabilité technique de la feuille de route annoncée par le vendeur.

Le premier a le sien : [Audit PHP : pourquoi les outils ne suffisent pas](/blog/2026/08/audit-php-pourquoi-les-outils-ne-suffisent-pas/). Les deux autres pèsent surtout pour un acquéreur qui veut accélérer.

## Conclusion

On commence par l'intention : ce que l'acquéreur veut faire du logiciel, parce que la même dette ne pèse pas pareil selon qu'on éteindra l'application, qu'on l'exploitera telle quelle ou qu'on la fera changer de direction.

On vérifie ensuite qu'on peut le reprendre : licences, moyens de déployer, droits sur le code écrit par des prestataires.

On identifie ce qui compliquera durablement la vie sans bloquer la reprise, du service externe dont dépend une fonctionnalité centrale à la personne qui détient seule la connaissance.

On regarde ce que valent les données, souvent l'actif réel quand on rachète une base de clients.

On fait l'inventaire des failles et des manquements sur les données personnelles, parce que le repreneur en hérite.

Et on situe chaque défaut sur la brique où il se trouve.

| Nature de la brique | État constaté | Ce que ça change pour l'acquéreur |
|---|---|---|
| Cœur métier | Code dense, maîtrisé, plusieurs contributeurs | L'actif existe et se transmet |
| Cœur métier | Illisible, un seul contributeur, aucun test | Ce qu'on achète part avec la personne qui reste |
| Sous-domaine support | Simple, ennuyeux, stable | Rien à signaler, et c'est normal |
| Sous-domaine support | Énorme, instable, source des incidents | Complexité subie, payée sans contrepartie |
| Générique | Un service du marché fait le travail | Aucun sujet |
| Générique | Développé maison, à maintenir | Coût récurrent, remplaçable quand on veut |

Reste ce qu'aucune de ces vérifications ne montre : ce que le code dit de l'organisation qui l'a produit, et qu'on retrouvera après le rachat. C'est le sujet de [Ce que ton code dit de ton organisation](/blog/2026/09/ce-que-ton-code-dit-de-ton-organisation/).

Ce que ces constats deviennent dans le contrat ne se décide pas de mon côté. Mais c'est là qu'ils servent : à suspendre la vente, à obtenir une garantie du vendeur, ou à discuter le prix.

Si tu prépares une acquisition et que tu veux un regard extérieur sur ce que tu t'apprêtes à reprendre, [discutons de ton contexte](/audit/).

## Glossaire

1. **Due diligence** : ensemble des vérifications menées par un acheteur avant une acquisition. La due diligence technique porte sur le logiciel, l'équipe et l'infrastructure.
2. **Clause de changement de contrôle** : disposition d'un contrat qui s'active quand l'actionnariat d'une des parties change. Elle peut exiger un accord préalable ou permettre au cocontractant de résilier.
3. **Licence copyleft** : licence open source qui impose de publier sous la même licence le code qui l'utilise. La famille GPL en est l'exemple le plus connu. Un composant copyleft intégré à un produit propriétaire peut obliger à en ouvrir le code, ou à le réécrire.
4. **Cession de droits** : transfert écrit des droits patrimoniaux d'un auteur vers un tiers. En droit français, elle est automatique pour un salarié et doit être expresse pour un prestataire indépendant.
5. **Cœur métier** : la partie du logiciel qui porte l'avantage concurrentiel de l'entreprise. Ce qu'aucun concurrent ne peut acheter sur étagère.
6. **Sous-domaine support** : partie nécessaire au fonctionnement mais qui ne différencie pas l'entreprise de ses concurrents.
7. **Générique** : fonction commune à toutes les entreprises, pour laquelle des solutions existantes font le travail (authentification, facturation, envoi d'emails).

## Sources

Livres :

- [Patterns, Principles, and Practices of Domain-Driven Design](https://www.wiley.com/en-us/Patterns%2C+Principles%2C+and+Practices+of+Domain+Driven+Design-p-9781118714706) — Scott Millett et Nick Tune — Classification des sous-domaines et grille de lecture stratégique d'une application.

Articles et outils :

- [Core Domain Patterns](https://medium.com/nick-tune-tech-strategy-blog/core-domain-patterns-941f89446af5) — Nick Tune — Les configurations de sous-domaines, dont le cœur devenu commodité.
- [Article 1216 du Code civil](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070721/LEGISCTA000006150253/) — Légifrance — La cession de contrat exige l'accord du cocontractant.
- [Article L113-9 du Code de la propriété intellectuelle](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039279818) — Légifrance — Dévolution automatique des droits à l'employeur, limitée aux salariés.
- [CircleCI acquires test intelligence platform Ponicode](https://circleci.com/blog/ponicode-and-circleci/) — CircleCI — L'annonce du rachat, en mars 2022.
- [Article 83 du RGPD](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre8#Article83) — CNIL — Le texte de l'article, dont les plafonds de sanction du paragraphe 5.
- [The Six Primary Dimensions for Data Quality Assessment](https://www.sbctc.edu/resources/documents/colleges-staff/commissions-councils/dgc/data-quality-deminsions.pdf) — DAMA UK — Les six dimensions de qualité des données.
- [Open Source Issues in Mergers & Acquisitions](https://www.morse.law/news/open-source-issues/) — Morse — Licences copyleft et conséquences sur une transaction.
- [ICO statement — Marriott International](https://www.edpb.europa.eu/news/national-news/2019/ico-statement-intention-fine-marriott-international-inc-more-ps99-million_en) — EDPB — L'intention de sanction à 99 millions de livres, ramenée à 18,4 millions dans la décision finale de 2020, après le rachat de Starwood.


