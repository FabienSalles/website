---
title: Ce que ton code dit de ton organisation
description: "Hotspots, couplage temporel, archéologie git : ton code raconte les silos, la pression et les arbitrages de ton organisation. À condition de savoir le lire."
draft: true
pubDate: 2026-09-01
categories: [organisation]
service: audit
---

Dans [Audit PHP : pourquoi les outils ne suffisent pas](/blog/2026/08/audit-php-pourquoi-les-outils-ne-suffisent-pas), j'ai posé une thèse : le code reflète d'abord le cadre dans lequel il a été écrit. Les délais imposés, les arbitrages tranchés en haut, les silos, la pression. Tout ce qui ne se voit pas dans un dashboard, mais qui détermine ce qu'on trouve dans le repo.

Reste une question concrète. Comment lit-on ce cadre dans le code, quand on n'est pas dans la salle de réunion où il a été décidé ?

C'est l'objet de cet article. Et la lecture portera moins sur les lignes de code elles-mêmes que sur tout ce qui les entoure : l'historique git, les patterns récurrents, la manière dont le logiciel a grandi. C'est là que l'organisation se raconte, à condition de savoir quoi regarder. Et d'accepter de regarder sans juger.

## Le code, miroir de l'organisation

Melvin Conway l'a formulé en 1968 : « Toute organisation qui conçoit un système produira un design dont la structure copie la structure de communication de l'organisation. »

La loi est simple, ses implications sont énormes.

L'anecdote fondatrice vient de son article de 1968 : une équipe de cinq personnes chargée d'un compilateur COBOL a produit un compilateur en cinq passes. Le découpage du système avait épousé le découpage des gens. Le phénomène se répète partout : deux équipes qui ne se parlent pas produisent deux modules qui communiquent mal entre eux, avec des données dupliquées de chaque côté et des bugs qui s'accumulent à leur frontière. Et plus une décision traverse de comités avant d'arriver au code, plus le code se charge de couches de validation et d'indirection que rien, côté métier, ne justifie.

Cela rejoint un principe formulé par Alberto Brandolini : « Merge the people, split the software. » Faites converger les gens, séparez le logiciel. Quand les experts (techniques, métier, plusieurs domaines) ne se parlent pas, le logiciel hérite de leurs silos sans qu'on les ait choisis. Quand ils s'alignent sur leur compréhension du domaine, ils peuvent identifier où poser les frontières correctement dans le code. La proximité humaine sur le problème permet de bien découper la solution. Son absence produit un logiciel qui ne sait pas non plus s'interconnecter correctement.

Et ça vaut pour tout, pas juste pour l'architecture macro. Ça vaut pour le naming, pour la granularité des commits, pour le choix de mettre tel module dans tel namespace, pour la décision d'ajouter une feature en bordure plutôt que de refondre une zone existante.

Changer les outils ou empiler les process ne suffit pas quand le système qui produit le code reste le même. Cet article se concentre sur le chemin inverse : partant du code, remonter au système.

## Le problème n'est pas toujours où on regarde

Quand on cite la loi de Conway, on pense presque toujours à l'organigramme : les équipes, les départements, la hiérarchie. C'est la lecture habituelle, et elle est trop courte. Conway parle de la structure de communication de l'organisation. Tout ce qui communique, ou ne communique pas, autour du produit laisse sa trace dans le code. Y compris ce qui est en dehors de l'entreprise.

Quelques étages où la cause peut se loger, avec, pour chacun, ce qui se lit dans le code.

**Le client final.** Absent, indécis, ou trop occupé pour fournir les specs. L'équipe avance quand même : elle invente les règles métier à sa place. Je l'ai vécu en mission. On est passés de trois à sept développeurs pour absorber la pression, et le goulot s'est déplacé chez le métier : les specs n'arrivaient plus, on a fait les choix métier à la place du client. La théorie des contraintes de Goldratt en pratique : ajouter des ressources à un maillon ne résout rien si le maillon contraignant est ailleurs. Le projet a fini par tripler en jours-hommes. Dans le code, ça se lit : des règles métier inventées ou mal implémentées, des edge cases inutiles, un vocabulaire qui ne correspond à rien de ce que dit le métier.

**Le contexte contractuel.** Un forfait serré pousse à raboter la qualité pour tenir la marge. Il peut même pousser à laisser passer des bugs : leur correction sera facturée plus tard, dans le contrat de TMA (tierce maintenance applicative) qui prend le relais. Une échéance imposée de l'extérieur comme une campagne marketing produit le même effet : des raccourcis pris sous pression, qu'on retrouve dans le code, datés et regroupés autour des dates clés. Ce code raconte plus les contraintes de l'équipe que son expertise réelle.

**Le staffing qui tourne.** Quand les développeurs changent régulièrement de projet, chaque arrivant apporte ses habitudes et repart avant de les avoir accordées avec celles des autres. Plus le turnover est élevé, plus le code accumule de façons de faire différentes, sans cohérence d'ensemble : des styles qui changent par strates, des traductions différentes pour le même concept métier, voire plusieurs traitements pour le même besoin.

**La relation de pouvoir.** Le DDD a nommé ces rapports de force. Dans une relation Customer/Supplier, le fournisseur peut négocier : les priorités du client pèsent, mais la discussion existe. Dans une relation Conformist, l'aval n'a aucun pouvoir et subit le modèle de l'amont tel quel. Ça se voit dans le code. Une intégration où le vocabulaire d'un système tiers contamine tout le modèle, sans couche de traduction (ce que le DDD appelle un Anti-Corruption Layer), raconte une relation où personne n'a pu, ou osé, négocier. L'ACL absent est souvent la trace d'un rapport de force absent.

**L'équipe elle-même, même avec les moyens.** Une équipe peut avoir le budget, l'autonomie et les outils, et produire quand même du code confus : trop de sujets à porter en même temps (ce que Team Topologies appelle la charge cognitive), des modes de collaboration jamais explicités entre équipes, une organisation interne qui repose sur des habitudes plutôt que sur des accords. Les moyens ne remplacent pas la communication.

Cinq étages, cinq remèdes différents. Un audit qui s'arrête à « le code est mauvais » n'a pas fini son travail : reste à trouver à quel étage la cause habite, parce que le remède n'est pas le même.

## Complexité accidentelle et langage cassé

En 1997, Brian Foote et Joseph Yoder ont posé un mot sur le pattern le plus répandu de l'industrie : le « Big Ball of Mud ». Une jungle de code spaghetti, sans frontières claires, tentaculaire, faite de ruban adhésif et de fil de fer.

Ce pattern n'a rien d'un accident technique : il apparaît par défaut dès qu'une organisation étend ses fonctionnalités sans réévaluer son design. Les frontières des composants s'effritent, la complexité accidentelle s'accumule, et au bout de quelques années la jungle a tout recouvert.

On peut distinguer deux types de complexité. La complexité essentielle vient du domaine métier lui-même : règles, invariants, processus. Elle est légitime : on ne peut pas l'éliminer, seulement la gérer avec les bons outils. La complexité accidentelle, elle, vient de mauvaises décisions techniques, d'abstractions inutiles, de choix non révisés. Elle n'apporte aucune valeur, et elle peut disparaître.

Quand tu lis une codebase, ces deux complexités se mélangent. Le travail d'audit consiste précisément à les démêler.

Dans une organisation où le tech et le métier se parlent, le code parle métier. Les classes et les méthodes portent les mots qu'on entend en réunion produit, et une conversation avec un expert métier peut se prolonger dans le code sans traduction. C'est ce que le DDD appelle le langage ubiquitaire : un vocabulaire unique, partagé entre les conversations et le code.

Dans une organisation où le tech et le métier vivent dans deux mondes, le code parle technique. Les noms décrivent la mécanique (des `Manager`, des `Handler`, des `Helper` qui font un peu tout) et enfouissent l'intention métier sous les détails d'implémentation. La traduction entre le code et le besoin réel se fait dans la tête des développeurs, jamais formalisée, et chaque nouvel arrivant doit la réapprendre depuis zéro.

Cette absence de langage commun est un signal organisationnel.

## Hotspots, Bus Factor et couplage temporel

Adam Tornhill, dans *Your Code as a Crime Scene*, a popularisé une approche que l'analyse statique classique ne couvre pas : la behavioral code analysis. L'idée est simple : le code qui pose problème est probablement celui qu'on touche en permanence, pas celui qui dort depuis des années.

En croisant la fréquence de changement avec la complexité, on obtient des hotspots. Des zones où l'équipe lutte vraiment. Ces hotspots racontent quelque chose de l'organisation : ce qu'elle touche tout le temps, ce qu'elle ne maîtrise pas, ce qu'elle évite.

Des outils comme CodeScene automatisent aujourd'hui une partie de cette lecture : hotspots, couplage temporel, cartes de connaissance. Ils peuvent servir de point de départ, et ils font gagner un temps précieux. Mais l'outil calcule, il n'interprète pas. Il ne sait pas si ton hotspot est un cœur métier qu'on retouche parce que le produit vit, ou une zone que tout le monde subit. Il ne posera jamais la question qui lève l'ambiguïté. Cette interprétation-là demande le contexte, le métier, et une conversation avec l'équipe.

Au-delà, le couplage temporel est un signal encore plus parlant. Deux fichiers qui changent toujours ensemble, dans le même commit ou dans la même journée, sont couplés, parfois sans qu'aucune ligne de code ne l'exprime : le lien est conceptuel. Si tu modifies le calcul de remise dans `OrderService.php`, et qu'à chaque fois il faut aussi toucher `InvoicePrinter.php`, c'est qu'il y a une dépendance cachée. Soit une dépendance technique mal exprimée, soit une dépendance organisationnelle (deux équipes qui doivent se synchroniser sur chaque évolution).

Un autre signal lisible dans le git : le Bus Factor. Combien d'auteurs ont touché telle zone du code ? Si la réponse est « un seul, et il est parti il y a six mois », tu as un problème. La connaissance de cette zone s'est éteinte avec son auteur. Personne d'autre n'a la mémoire de ce qui s'y passe.

C'est ce que la recherche académique appelle le knowledge hiding. Pas toujours volontaire. Parfois c'est une organisation qui n'a pas mis en place de revue de code ou de pair programming. Parfois c'est un développeur qui, par peur de perdre sa place, retient ce qu'il sait pour rester indispensable.

Une équipe saine distribue la connaissance. Une équipe en souffrance la concentre.

Petite précision importante. Ces signaux supposent un git log qui reflète fidèlement qui a fait quoi. Quand l'équipe pratique le pair ou le mob programming, ou qu'elle a pris l'habitude des commits co-signés (`Co-Authored-By`), la lecture devient ambiguë. Un seul auteur visible peut cacher trois personnes qui ont travaillé ensemble. À l'inverse, des commits réguliers à plusieurs mains signalent une distribution active de la connaissance, même si le Bus Factor brut donne l'impression d'un point unique. Il faut croiser les signaux du git log avec une question simple posée à l'équipe : comment écrivez-vous le code, à plusieurs ou chacun de votre côté ?

## Archéologie git : culture, goulots, mémoire perdue

Le git log ne dit pas seulement qui a changé quoi. Il dit comment l'organisation pense.

Quand tu lis l'historique d'un projet, tu lis des décisions, des arbitrages, des ruptures. Tu vois ce qui a été refait, ce qui a été abandonné, ce qui a été précipité. Tu vois les périodes calmes et les périodes de panique.

Quelques signaux concrets.

### La qualité des messages de commit

Elle raconte la culture. Des messages clairs, avec une référence à un ticket et une description de l'intention : signe d'une équipe qui prend le temps de documenter ses décisions. Des messages de type « fix », « wip », « update », « test 3 » : signe d'une équipe qui livre sous pression, ou qui n'a pas la rigueur suffisante pour nettoyer son historique. Qu'en serait-il alors pour le code ?

### Le rythme des commits

Il raconte le rythme de l'organisation. Des commits réguliers, équilibrés, sans rush de fin de sprint : signe d'un flow stable. Des pics massifs avant chaque démo, suivis de creux et de hotfixes : signe d'un système qui développement pour son organisation et non pour ses clients finaux.

### La pratique de la revue

Elle peut prendre des formes très différentes. Une grande partie de l'historique mergée directement sur la branche principale, sans passage par une PR, a deux lectures opposées selon la maturité de l'équipe. Le trunk-based development est considéré comme une meilleure pratique que les pull requests. Mais il demande une discipline et une cohésion qui ne s'improvisent pas : pair ou mob programming, intégration continue solide, ownership collectif du code, et une observabilité (logs, métriques, alertes) qui permet d'être prévenu au plus tôt quand une anomalie passe. Sans cette maturité, ce qui ressemble à du trunk-based devient juste du push direct sur main, sans maitrise et garde-fous. Le même signal dans le git log révèle soit une équipe très avancée, soit une équipe qui n'a pas posé son filet de sécurité collectif. La conversation avec l'équipe lève l'ambiguïté.

### La fréquence de déploiement

Elle raconte qui a la main sur la prod. Dans beaucoup d'organisations en difficulté, les développeurs ne peuvent simplement pas livrer. Le métier attend l'intégralité des fonctionnalités pour tout valider d'un bloc, façon cycle en V. Ou l'équipe n'a pas accès à sa production : une autre équipe déploie, une équipe QA valide en aval, les responsabilités se diluent, et chaque livraison devient une négociation. Ces frictions se voient dans le git : des releases espacées de plusieurs mois, des phases de développement puis de recette puis de correction, des rafales de hotfixes juste après chaque mise en production.

À l'inverse, une équipe qui a la main sur son déploiement livre par petits incréments et corrige vite. Elle peut séparer la mise en production de l'activation d'une fonctionnalité : le code part inactif derrière un feature flag, en modifications additives, et on active quand le métier est prêt, sans l'impacter. Le trunk-based development prend là tout son sens, puisqu'il facilite ce déploiement continu. Le git log le montre aussi : un flux régulier de petites mises en production, sans pic de panique.

### Les cycles de montées de version

Ils racontent la capacité à se maintenir à niveau. Le rattrapage en bloc après des années d'immobilisme, déjà évoqué dans l'article sur les limites des outils, en est le symptôme le plus visible. Son contraire se lit aussi : des montées de version intégrées au fil des développements, ou automatisées via Renovate ou Dependabot, signent une équipe qui a fait de la maintenance un sujet continu. Bien menée, elle se fond dans le flow normal et ne coûte presque rien.

### Les tests tardifs ou mal écrits

Ils racontent le rapport au filet de sécurité. Au-delà de la couverture gonflée après coup, le signal le plus parlant est plus discret : des tests qui valident l'implémentation plutôt que le comportement attendu. Ils pètent à la moindre refacto, l'équipe finit par les désactiver, et le filet de sécurité s'effrite sans que personne le revendique.

### Les traces de roadmaps inachevées

Elles racontent une organisation qui ouvre sans clore. Des `@todo` éparpillés à plusieurs endroits avec des edge cases non traités. Des refactorings interrompus au milieu de la migration, où l'ancien et le nouveau cohabitent. Des duplications de traitements qui devaient être unifiées et qui ne l'ont jamais été. Des fichiers marqués « legacy » dans des dossiers qu'on n'a jamais retirés. Chacun de ces signaux est la trace d'une décision prise et jamais terminée. L'organisation a décidé de bouger, puis quelque chose a interrompu le mouvement. Identifier ce qui a interrompu : c'est ce que l'audit doit chercher.

Une précision honnête, parce que j'affirme depuis le début que les outils ne voient pas ces signaux : c'est de moins en moins vrai. Une IA bien cadrée sait fouiller un historique git et remonter une bonne partie de ces indices, les pics de commits, les rafales de hotfixes, les zones à auteur unique. C'est d'ailleurs ainsi que je travaille en audit : je cadre l'IA pour qu'elle extraie ces éléments à ma place. Mais un indice n'est pas une interprétation. Il faut croiser ces signaux entre eux, les confronter au contexte du projet, et surtout faire valider l'interprétation en échangeant avec les différents interlocuteurs. C'est la conversation qui transforme un faisceau d'indices en une histoire un peu plus juste.

## Lire sans juger : remonter au cadre

Lire l'organisation dans le code demande une posture autant qu'une technique.

La tentation, quand on remonte des signaux comme ceux-là, c'est d'identifier des coupables. Tel développeur qui a écrit tel code spaghetti. La posture est confortable, et elle est presque toujours fausse.

Dans « Pourquoi les outils ne suffisent pas », j'écrivais : « la faute est presque toujours renvoyée à celui qui développe le produit. Au dev, à l'équipe tech, parfois au tech lead. Mais le code reflète d'abord le cadre dans lequel il a été écrit. » Cette posture reste centrale.

Quand tu lis un hotspot sur un fichier touché par six personnes en six mois, ce ne sont pas ces six personnes qui sont en cause. C'est le système qui a fait converger six personnes sur ce point. Quand tu vois un Bus Factor de 1 sur une zone critique, ce n'est pas la personne qui en sait qui est en faute. C'est l'organisation qui n'a pas mis en place les conditions pour distribuer la connaissance.

Un auditeur qui pointe le développeur n'apporte rien. Il rejoint la liste des gens qui ont déjà pointé le développeur, et il rate ce qui compte.

C'est aussi pour ça que la refonte est rarement la bonne première réponse. Si la cause habite ailleurs que dans l'équipe et son code (chez le client, dans le contrat, dans l'organisation), tu peux refondre le logiciel autant que tu veux : le système qui a produit les problèmes est toujours là, et les mêmes problématiques reviendront, dans un laps de temps plus ou moins long. Refondre sans traiter la cause, c'est reposer le problème à plus tard. Et on finit par faire des refontes de refontes.

J'ai longtemps essayé d'agir contre la culture de mes clients. J'arrivais en mission, je voyais ce qu'il y avait à améliorer, je proposais.

Au fil des missions, j'ai arrêté, non pas par pessimisme mais par lucidité. On ne change pas la culture d'une organisation depuis l'extérieur. Aujourd'hui, je concentre mon énergie là où j'ai une emprise réelle : mon périmètre, mes livrables, la qualité de ce que je rends. Le reste, je le remonte, je conseille, j'avertis, mais je ne me bats plus pour imposer ma vision : la décision reste entre les mains de ceux qui détiennent la responsabilité.

Cette posture touche à quelque chose de plus intime : la peur du jugement et le besoin de prouver. Quand on audite un code, on peut activer ces réflexes chez l'équipe en place. On peut aussi les éviter en distinguant clairement les signaux qu'on remonte des personnes qui les alimentent.

## Ce que cette lecture ne dit pas

Lire l'organisation dans le code a des limites.

Le code dit ce qui s'est produit, pas pourquoi. Tu vois le résultat, pas les raisons. Telle décision d'archi avait peut-être un sens dans le contexte de l'époque. Tel raccourci était peut-être la bonne décision face à une deadline produit critique. Tel module abandonné l'a peut-être été parce que le besoin a changé, pas parce que personne ne savait quoi en faire.

C'est précisément le rôle des Architecture Decision Records (ADR) : de courtes notes qui consignent une décision d'architecture, son contexte et les alternatives écartées, au moment où on la prend. Sans eux, un choix remis en cause aujourd'hui est illisible : impossible de savoir s'il s'agit d'une erreur ou de la bonne décision d'une époque dont les contraintes ont disparu. La mémoire du pourquoi part avec les gens.

Le code ne dit pas non plus ce qui n'a pas été essayé. Les chemins refusés, les propositions enterrées, les améliorations bloquées par un seul décideur. Le git log montre les décisions qui ont abouti, pas celles qui n'ont jamais existé.

Et surtout, le code ne dit pas ce que les gens vivent. Une équipe peut produire du code propre dans un climat toxique, par excès de discipline ou par peur. Une équipe peut produire du code spaghetti dans un climat sain, parce qu'elle traverse une phase de découverte d'un domaine métier nouveau pour elle, et qu'elle accepte de coder un prototype avant de stabiliser. La métrique technique seule ne capte pas la dimension humaine.

Alberto Brandolini a cette formule : « Software development is a learning process, working code is a side effect. » Le développement logiciel est un processus d'apprentissage, le code qui fonctionne n'en est qu'un effet secondaire. Auditer un code, c'est auditer une trace de cet apprentissage. C'est utile, mais ce n'est pas suffisant.

La conversation reste indispensable. Parler à l'équipe, écouter ce qu'elle vit, comprendre ce qui s'est joué dans les six derniers mois. Sinon, on lit des chiffres en croyant lire une histoire, et on raconte la mauvaise.

## Conclusion

Le code est le miroir de ton organisation. Mais un miroir ne se lit pas en passant. Il demande qu'on s'arrête, qu'on regarde, qu'on comprenne ce qu'on voit avant d'agir.

Les hotspots, le couplage temporel, le Bus Factor, le langage du code, l'historique des commits : autant de signaux que les scores de qualité ne racontent pas, et qui en disent long sur la santé d'une organisation.

Au lieu de juger le code, cherche à comprendre le contexte qui a permis sa mise en place. Un audit utile ne demande pas à l'équipe de justifier ce qu'elle a écrit. Il essaie de remonter à ce qui, dans son environnement de travail, a rendu ce code possible.

Si tu reconnais ta situation, ces signaux ne sont qu'une partie de ce qu'un audit peut t'apporter. [Discutons de ton contexte](/audit).

## Glossaire

- **Behavioral code analysis** : analyse de la manière dont l'équipe travaille sur le code (fréquence des changements, auteurs, zones touchées ensemble) à partir de l'historique git, en complément de l'analyse statique du code lui-même.
- **Hotspot** : zone de code à la fois complexe et fréquemment modifiée. C'est là que l'équipe dépense le plus d'effort.
- **Couplage temporel** : deux fichiers qui changent systématiquement ensemble dans l'historique, signe d'une dépendance cachée, technique ou organisationnelle.
- **Bus Factor** : nombre de personnes qui connaissent une zone du code. À 1, la connaissance disparaît avec un seul départ.
- **TMA (tierce maintenance applicative)** : contrat par lequel un prestataire assure la maintenance corrective et évolutive d'une application après sa livraison.
- **Customer/Supplier et Conformist** : patterns du DDD qui décrivent la relation entre deux équipes ou systèmes. Customer/Supplier : la négociation existe. Conformist : l'aval subit le modèle de l'amont sans pouvoir d'influence.
- **Anti-Corruption Layer (ACL)** : couche de traduction qui protège un modèle des concepts d'un système tiers, pour que le vocabulaire de l'un ne contamine pas l'autre.
- **Charge cognitive** : quantité de sujets qu'une équipe doit maîtriser en même temps. Au-delà d'un seuil, la qualité et le rythme chutent (Team Topologies).
- **Trunk-based development** : intégration continue de tout le travail sur la branche principale, par petits incréments, plutôt que via de longues branches.
- **Langage ubiquitaire** : vocabulaire unique partagé entre le métier et le code (DDD) : les mots des réunions produit sont ceux des classes et des méthodes.
- **Feature flag** : interrupteur qui sépare la mise en production du code de l'activation de la fonctionnalité.
- **ADR (Architecture Decision Record)** : note courte qui consigne une décision d'architecture, son contexte et les alternatives écartées, au moment où on la prend.

## Sources

- *Your Code as a Crime Scene* — Adam Tornhill — behavioral code analysis, hotspots, couplage temporel
- [code-maat](https://github.com/adam-tornhill/code-maat) — Adam Tornhill — l'outil open source pour analyser soi-même son historique git (hotspots, couplage, auteurs)
- [Big Ball of Mud](http://www.laputan.org/mud/) — Brian Foote, Joseph Yoder (1997)
- *Learning Domain-Driven Design* — Vlad Khononov (O'Reilly, 2021) — complexité essentielle vs accidentelle, ch. 11
- [Loi de Conway](https://fr.wikipedia.org/wiki/Loi_de_Conway) — Melvin Conway (1968)
- [Conway's Law](https://martinfowler.com/bliki/ConwaysLaw.html) — Martin Fowler — bliki
- *Le But* — Eliyahu Goldratt (1984, traduction française AFNOR) — la théorie des contraintes
- *Domain-Driven Design* — Eric Evans (Addison-Wesley, 2003) — context mapping : Customer/Supplier, Conformist, Anti-Corruption Layer
- *Team Topologies* — Matthew Skelton, Manuel Pais (IT Revolution, 2019) — charge cognitive, modes d'interaction entre équipes
- [Trunk-Based Development](https://dora.dev/capabilities/trunk-based-development/) — DORA — la pratique et ses prérequis
- [Feature Toggles](https://martinfowler.com/articles/feature-toggles.html) — Pete Hodgson (martinfowler.com) — séparer déploiement et activation
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) — Michael Nygard (2011) — le format ADR
- [Knowledge Hiding in Organizations](https://onlinelibrary.wiley.com/doi/10.1002/job.737) — Connelly et al. — Journal of Organizational Behavior (2012)
- [Facteur d'autobus](https://fr.wikipedia.org/wiki/Facteur_d%27autobus) — Wikipédia (FR) — le concept de Bus Factor
- [Bus Factor in Practice](https://arxiv.org/abs/2202.01523) — Jabrayilzade et al. (arXiv, 2022) — l'étude empirique
- [CodeScene — Measure Conway's Law](https://codescene.com/blog/measure-conways-law/) — l'outil d'analyse comportementale dont cet article se différencie
- Alberto Brandolini — « Merge the people, split the software » ; « Software development is a learning process, working code is a side effect » (Event Storming)
