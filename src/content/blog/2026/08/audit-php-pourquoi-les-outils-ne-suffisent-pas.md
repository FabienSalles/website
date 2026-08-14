---
title: "Audit PHP : pourquoi les outils ne suffisent pas"
description: Tes outils remontent des centaines d'alertes. Qui arbitre les faux positifs, priorise par impact business et assume la dette stratégique ?
draft: false
pubDate: 2026-08-14
categories: [organisation]
service: audit
---

Sur le papier, tout va bien : PHPStan au niveau max, des tests automatisés, les métriques DORA en place. Et pourtant, l'équipe galère.

Les fonctionnalités prennent de plus en plus de temps à sortir. Ou l'inverse : depuis l'arrivée de l'IA, on livre plus vite que jamais, mais ce qu'on livre produit de moins en moins de valeur. La dette s'accumule, la plateforme devient instable, et plus personne ne sait où va le produit ni où va la tech. Les deux visions étaient alignées au départ ; elles se sont perdues en route.

Les dashboards, eux, restent au vert. C'est ce paradoxe qui m'amène à écrire : les outils remontent des dizaines de problématiques, mais ce ne sont que des symptômes. Les causes, elles, n'apparaissent dans aucun rapport.

Les outils mesurent. Ils ne comprennent pas. Voyons les angles morts de chaque famille d'outils, et ce que seul un humain apporte derrière les métriques : l'arbitrage, la priorisation, la responsabilité.

## L'analyse statique voit les symptômes, pas les causes

Ils trouvent les erreurs de typage, le code mort, la complexité cyclomatique<sup>[1](#glossaire)</sup> excessive, les violations de règles configurées. C'est précieux. C'est même le filet de sécurité minimal de toute équipe qui veut produire du code maintenable.

Mais ces outils ont un angle mort fondamental : ils ne savent pas pourquoi ton code est comme ça.

Un couplage fort<sup>[2](#glossaire)</sup> entre deux modules peut être :

- un choix d'architecture assumé, qu'on documente et qu'on accepte de payer plus tard
- un accident historique, accumulé sans intention, sans personne pour décider

L'outil voit les deux comme « couplage fort ». Pour lui, c'est la même métrique. Pour toi, ce sont deux situations opposées qui appellent des décisions opposées.

Les scores mesurent une conformité technique, pas la santé du système qui produit ce code.

Un outil voit la structure du code, pas l'intention métier. Il peut vérifier qu'une fonction est bien typée, qu'elle gère ses cas d'erreur, qu'elle respecte les conventions de l'équipe. Il ne sait pas si le calcul qu'elle effectue correspond à la règle métier que tu veux vraiment appliquer.

Prenons un cas concret. Une fonction de remise commerciale s'applique sur le prix HT alors qu'elle devrait s'appliquer sur le prix TTC, ou l'inverse selon ton contexte fiscal. Le code est propre, le typage est strict, l'analyseur statique est content. Pourtant, le résultat est faux.

Et ça vaut pour bien plus que les calculs. Une commande qui passe en statut « facturée » avant « payée », parce que c'est l'ordre câblé dans le workflow, alors que le métier veut l'inverse. Un champ code postal qui rejette tout ce qui ne fait pas exactement 5 chiffres, et qui bloque silencieusement les prospects belges et suisses depuis l'ouverture à l'international. 

L'outil compte les issues techniques. Il ne sait pas laquelle te coûte de l'argent. Il ne sait même pas qu'une partie de ce qu'il signale n'a aucun impact, et qu'une partie de ce qui n'apparaît pas dans son rapport est en train de saper la valeur du produit.

## Les métriques delivery mentent par omission

DORA est devenu la référence pour mesurer la qualité et performance d'une équipe.

Quatre métriques au départ, désormais cinq : deployment frequency, lead time, change failure rate, time to restore, et reliability. Solides, sourcées, validées par des années de recherche.

Ces métriques ont aussi des limites que le rapport DORA 2025 reconnaît explicitement : elles disent « quoi », pas « pourquoi ».

Une vélocité en baisse peut être :

- une équipe qui croule sous la dette technique
- un changement de scope qui nécessite plus de réflexion
- une équipe qui investit dans la qualité (refacto, tests, documentation)

Le chiffre est le même. Les causes sont opposées. La décision à prendre aussi.

Ajoutez à ça la loi de Goodhart<sup>[3](#glossaire)</sup> : « quand une mesure devient un objectif, elle cesse d'être une bonne mesure ». Une équipe pressurée sur sa vélocité va gonfler les story points. Une équipe pressurée sur le deployment frequency va découper en micro-déploiements artificiels. Le chiffre monte, la valeur livrée stagne.

Plus profondément, le problème vient de ce qu'on mesure. Presque toutes les métriques que je croise en entreprise sont des métriques de delivery, jamais des métriques d'impact. Nombre de commits, nombre de déploiements, tickets fermés, et désormais prompts générés ou tokens consommés. C'est mesurable, c'est rassurant. C'est aussi du bruit si on avance dans la mauvaise direction.

On peut aller très vite et faire la mauvaise chose. Aller plus vite n'aide pas si on s'est trompé de cap.

Les vrais critères devraient être reliés à l'impact. Est-ce qu'on répond au besoin de l'utilisateur ? Est-ce qu'un indicateur produit qui compte vraiment a bougé ? Des frameworks récents commencent à poser ce cadre. Le DX Core 4 ajoute explicitement une dimension Impact (le pourcentage du temps R&D consacré à de nouvelles capabilities). SPACE, dans sa lecture la plus exigeante, demande d'aller au-delà du temps de cycle pour évaluer comment le logiciel répond aux besoins métier.

Mais aucun de ces cadres ne dispense d'analyser le besoin, de challenger le problème et la solution, et parfois d'accepter qu'il faut changer d'angle. Cette analyse, elle, est humaine.

Aucune métrique, aussi bien posée soit-elle, ne sait si la baisse que tu vois est un signal de régression ou un signe d'investissement.

## Les scanners et agents IA noient le signal dans le bruit

Un scanner de sécurité remonte régulièrement des centaines d'alertes. Combien sont des vraies failles exploitables ?

Malgré toutes les améliorations du monde, beaucoup d'alertes remontées restent des faux positifs. Et le tri n'est pas optionnel : un faux positif non traité, c'est soit une fausse alerte qui pollue les KPI, soit une vraie faille noyée dans le bruit.

Le scanner ne sait pas qu'une « faille » a un mécanisme de compensation en place. Il ne remonte pas parfaitement la chaîne d'exécution pour vérifier si la faille est réellement exploitable depuis l'extérieur. Il signale un pattern. Quelqu'un derrière doit signer : « celle-ci est un faux positif, j'assume ».

L'IA peut aller encore plus loin, parce qu'elle peut elle-même utiliser ces outils, croiser leurs résultats, raisonner sur la chaîne d'exécution. Certains modèles remontent désormais cette chaîne avec une précision impressionnante.

Et pourtant, le nombre de faux positifs ne baisse pas. Il augmente.

L'IA peut mal interpréter un pattern. Elle diagnostique parfois un problème là où il n'y en a pas. Et elle remonte régulièrement en criticité haute des mauvaises pratiques qui restent inoffensives en pratique. Plus elle est capable, plus elle a de matière à mal interpréter.

À ça s'ajoutent des erreurs d'un nouveau genre : hallucinations subtiles, raccourcis silencieux, fausses affirmations qui ressemblent à de vraies analyses détaillées. Le format est plus convaincant qu'avant. Le tri devient plus difficile, pas plus facile.

Une prise de recul, un regard externe, une expertise capable de dire « ce signal-là, en pratique, n'a pas d'impact dans ton contexte » ou encore « ce que tu dis est faux » : c'est ce qui fait la différence entre un rapport bruité de 500 lignes et un diagnostic actionnable de 30.

Le rapport public d'Anthropic sur l'évaluation des risques d'alignement formule clairement le cadre :

> « If AI models were routinely used to carry out significant technical workflows with very little human oversight (...) then we believe the impact of concern would be higher. »

Anthropic, dans son propre rapport, indique qu'utiliser ses modèles sans supervision humaine augmente le risque.

Ce point structurel est traité en profondeur dans un autre article de cette série. Pour ce qu'il faut retenir ici : l'IA n'échappe pas à la règle. Elle l'amplifie.

## L'angle mort que personne ne mesure : l'organisation

Aucun outil ne capture la vraie cause de la majorité des problèmes de code.

Aucun outil ne mesure :

- les silos entre équipes
- le turnover qui efface la connaissance métier
- la pression qui force les raccourcis
- la maturité inégale dans l'équipe
- le droit de l'erreur (psychologically safe ou non)
- les décisions politiques qui dictent l'architecture

Et pourtant, ces facteurs expliquent souvent mieux ton code que toutes les métriques techniques réunies.

Un couplage fort entre deux modules en dit plus sur les équipes qui les ont écrits que sur l'architecture choisie. Trois manières de faire la même chose dans le même projet, c'est de l'histoire : chaque époque a laissé ses patterns.

Cette dimension est traitée en profondeur dans un autre article de la série. Ce qu'il faut acter ici : aucun outil automatisé ne lit cette couche. Elle se lit avec un humain qui parle à l'équipe, qui regarde le git log, qui croise les données et les zones de friction, et qui en tire une interprétation.

J'ai vu ces impacts à profils égaux mais dans des contextes opposés. Deux projets PHP. Le premier : forfait, pression sur les délais, équipe sous-staffée. Code spaghetti, dette qui s'accumule, sentiment d'impuissance. Le second : carte blanche, équipe autonome, contact direct avec le métier. Trunk-based<sup>[4](#glossaire)</sup>, déploiement continu, qualité élevée.

Aucun outil ne voit la différence entre ces deux contextes. Pourtant, c'est cette différence qui détermine la majeure partie du résultat dans le code.

Cette dimension organisationnelle peut toutefois se retrouver dans le code, avec des signaux précis.

Un projet qui n'a fait aucune montée de version pendant des années, et qui s'y met soudain en bloc. Ça ne devrait jamais arriver. Bloquer le delivery pour rattraper des mises à jour, ce n'est pas une solution pérenne. C'est le symptôme d'une organisation qui ne sait pas absorber l'amélioration continue de manière fluide.

Pareil pour les tests qu'on ajoute après coup pour gonfler la couverture. Les tests servent à conceptualiser un produit, à challenger le design, à guider l'écriture du code. Quand on en écrit pour valider du code de prod déjà fonctionnel, on a déjà raté l'usage et l'utilité du test. Test qui devient un coût au lieu d'un gain.

L'historique git raconte la même chose. Quand la part de maintenance grossit au fil des mois pendant que la part de nouvelles fonctionnalités diminue, on peut se demander jusqu'où on laisse ça avant de changer ? La réponse classique consiste à ajouter des développeurs pour absorber la charge. C'est presque toujours la mauvaise. Il vaudrait mieux changer de posture.

Et c'est là que se joue le malentendu le plus coûteux : la faute est presque toujours renvoyée à celui qui développe le produit. Au dev, à l'équipe tech, parfois au tech lead. « Le code est de mauvaise qualité. » « Il n'y a aucun tests. » « L'équipe ne livre pas. »

Mais le code reflète d'abord le cadre dans lequel il a été écrit. Les délais imposés. Les arbitrages priorité/qualité tranchés en haut. Les specs floues. Les changements de cap. L'absence d'expert métier disponible. Le refus d'investir sur la qualité et la pérennité du produit.

Ces décisions ne sont pas dans les mains de celui qui code. Elles sont dans les mains de celui qui dicte le cadre.

Un audit honnête remonte cette responsabilité. Il ne pointe pas le développeur qui a fait ce qu'il pouvait dans ce qu'on lui a donné. Il pointe le système de décisions qui a produit ce contexte.

## Ce que l'humain fait et que l'outil ne peut pas

Un audit utile ne se limite pas à exécuter des outils. Il fait sept choses qu'aucun outil ne peut faire à ta place.

Sept gestes qui suivent le déroulé d'une mission, du premier entretien à la signature du rapport : écouter, traduire, arbitrer, trancher, challenger, assumer.

### 1. Communiquer et aligner

Un audit, c'est d'abord des conversations. Avec l'équipe, avec la direction, et pas seulement en réunion planifiée.

Les échanges informels sont souvent les plus riches : une pause café, un aparté après un point d'équipe, et des non-dits remontent à la surface. Une contrainte que tout le monde subit sans jamais l'avoir écrite, un désaccord ancien qui structure encore les choix techniques d'aujourd'hui. Ces éléments ne figurent dans aucun document ; ils pèsent pourtant plus que bien des schémas d'architecture.

L'Event Storming<sup>[5](#glossaire)</sup> a un nom pour ça : les unknown unknowns, ces choses qu'on ne sait pas qu'on ne sait pas. Aucune spec ne les mentionnera, puisque personne n'a conscience de les porter. Elles n'émergent que quand on met les bonnes personnes dans la même pièce et qu'on les fait parler du même flux métier. Un atelier de deux heures révèle parfois un malentendu que le code paie depuis deux ans.

Faire converger ces perceptions divergentes vers une vision commune, c'est le premier livrable d'un audit. L'outil, lui, ne fait pas de réunion. Il ne lit pas les tensions d'une roadmap, et il ne sait pas que le tech lead et le PO ne se parlent plus depuis trois mois.

### 2. Propager la vision dans le code

L'alignement obtenu dans la conversation ne survit pas tout seul : il faut le traduire en architecture, puis l'y maintenir. Des frontières techniques et organisationnelles qui suivent le métier, un couplage choisi plutôt que subi.

Cette traduction commence par les mots. Quand le produit vend des « réservations » et que le code parle encore de « commandes », c'est que la vision a bougé sans que le code suive : chaque échange entre le métier et les développeurs repasse par une traduction, et chaque traduction est une occasion de malentendu, donc de bug. La dérive s'installe version après version, sans bruit, puisque le code compile très bien avec le mauvais mot.

Et ce qui vaut pour les mots vaut pour l'effort. Traduire la vision, c'est aussi investir le design là où le métier se différencie, et accepter la solution la plus simple qui marche sur les sous-domaines génériques. Cette carte des enjeux ne se déduit d'aucune métrique : elle vient de la stratégie, et elle se redessine à chaque décision de design.

Voilà pourquoi aucun outil ne sait si ton couplage sert le métier ou le trahit : il faudrait connaître la vision pour en juger. Cette traduction de la stratégie en design technique est un travail humain.

### 3. Gérer la dette, pas l'ignorer

Le quadrant de Fowler distingue la dette intentionnelle et prudente de la dette accidentelle et imprudente.

« On prend ce raccourci pour tenir la date du salon, on le documente, on planifie le remboursement » : c'est de la dette assumée, et c'est parfois la meilleure décision de l'année. « On ne savait pas qu'on créait un problème » : c'est de la dette subie, et elle se paie avec intérêts au moment où on s'y attend le moins. Dans le code, les deux se ressemblent ; un outil les note pareil.

Cette lecture suppose de connaître l'intention initiale, le contexte de l'époque, les contraintes qui pèsent aujourd'hui. Elle suppose aussi de calibrer l'effort sur la zone d'intervention : une dette logée dans un module que personne ne touche ne coûte presque rien, tandis que la même dette sur la zone où l'équipe intervient chaque semaine se paie à chaque modification. Rembourser la première avant la seconde, c'est dépenser l'effort au mauvais endroit.

Gérer la dette, ce n'est donc pas viser zéro. C'est savoir laquelle on porte, pourquoi on la porte, et laquelle rembourser en premier.

### 4. Prioriser, arbitrer, dire non

Un audit utile ne rend pas une liste de 500 problèmes. Il classe, il priorise, il filtre.

Le critère de tri n'est pas la sévérité technique, c'est l'impact. Une alerte « critique » de l'outil peut être sans conséquence dans ton contexte, parce que le chemin d'exécution n'est pas atteignable ou qu'une compensation existe. À l'inverse, un détail que personne ne signale, comme un champ de formulaire trop strict ou une règle métier câblée à l'envers, peut coûter des clients chaque semaine. L'outil classe par gravité théorique ; l'expert classe par ce que ça te coûte.

C'est un acte de pouvoir, pas d'analyse. Quelqu'un doit assumer le « ignorer » par écrit. Quelqu'un doit défendre le « à corriger maintenant » contre la pression du delivery. Et parfois, quelqu'un doit dire non au commanditaire lui-même : non à la refonte totale qui semble évidente, non au chantier séduisant qui ne rapportera rien.

### 5. Découpler au bon endroit

Extraire un sous-domaine feuille<sup>[6](#glossaire)</sup>, poser un Anti-Corruption Layer<sup>[7](#glossaire)</sup>, choisir où passe la frontière entre l'ancien et le nouveau.

Ces décisions sont des choix de design, pas des résultats de mesure. Elles supposent une lecture stratégique du métier et de la trajectoire produit.

### 6. Challenger le métier en profondeur

L'IA peut challenger un PO. Elle pose des questions, propose des alternatives, soulève des contradictions. Mais sa vision reste prisonnière du contexte qu'on lui donne. Elle reflète, amplifie, recompose ce qu'elle a vu. La remise en cause profonde du besoin, l'angle qui n'était pas dans le prompt, la question qui décale tout, ça revient à l'humain.

Ces signaux peuvent venir du code ou d'une simple conversation.

Quand je vois une action d'écriture massive, qui touche un gros volume de données, déclenchée en synchrone depuis une interface utilisateur, je m'interroge. C'était peut-être la demande initiale : pouvoir tout sauvegarder d'un coup, en one-shot, parce que c'est ce que l'équipe produit a demandé à un moment.

Et puis je me pose les vraies questions. Le temps de réponse, ça donne quoi ? La charge en pic, ça tient ? La concurrence quand deux personnes déclenchent l'action en même temps, c'est géré ? Et l'interface elle-même, n'est-elle pas devenue trop lourde, avec trop d'éléments à afficher et à manipuler en même temps ?

Pourquoi ne pas découper ? Plus d'éléments réactifs, des endpoints plus petits, des actions atomiques que l'utilisateur enchaîne à son rythme.

Le code peut révéler une anomalie fonctionnelle dont l'équipe n'a plus conscience parce qu'elle a toujours fait comme ça. La détecter et la remonter, c'est une lecture humaine. Un outil signalera peut-être la complexité ou le couplage. Il ne dira jamais « cette fonctionnalité, telle qu'elle est conçue, est un mauvais choix produit ».

### 7. Conserver la décision, l'éthique, la responsabilité

Si une faille est ignorée parce qu'elle est jugée non exploitable dans le contexte, c'est une décision humaine qui engage. Si une dette technique est portée volontairement pour aller plus vite, c'est un arbitrage humain qui engage.

On me demande souvent si une refonte est nécessaire. Sans vouloir jeter la faute sur l'équipe, ma réponse honnête est : rarement. Sans changement organisationnel et parfois sans accompagnement de l'équipe interne, une refonte reproduit les mêmes causes 6 mois ou 2 ans plus tard. Les meilleures intentions du monde, les patterns qu'on s'est juré de ne pas reproduire, l'équipe motivée : tout ça ne suffit pas si l'organisation continue de produire les contraintes qui ont mené à l'état initial. Les anomalies de l'applicatif sont des symptômes. Les causes sont dans les méthodes de travail, dans les pratiques de développement, dans une organisation qui ne déploie pas le plein potentiel de son équipe et la contraint à des choix qui produisent des problèmes à retardement.

Quand je signe une recommandation, c'est ce que je remonte. Pas pour désigner un coupable : un audit qui distribue les fautes ne répare rien. L'objectif est de poser les causes sur la table, y compris celles qui relèvent du cadre plutôt que du code, pour que celui qui décide ait enfin les moyens d'agir dessus. C'est ce qu'on attend d'un regard extérieur : dire les choses, et les dire de façon à pouvoir avancer ensemble.

## L'outil reste indispensable

Ce n'est pas un article anti-outils.

De l'analyse statique, des tests, de l'observabilité, des KPI et maintenant l'IA...
Les outils sont le socle. Ils libèrent du temps humain pour ce qui compte vraiment : l'arbitrage, la priorisation, l'interprétation. 
Sans outils, tu passes tes journées à faire ce qu'une machine ferait mieux.

L'erreur n'est pas d'utiliser des outils. C'est de croire qu'ils suffisent. C'est de penser qu'un score au vert dispense d'avoir un humain qui comprend, qui décide, qui assume.

## Conclusion

Les outils mesurent. L'expert comprend.

Un audit utile lance les outils, bien sûr. Mais ce n'est jamais l'essentiel. L'essentiel, c'est tout ce que l'outil ne fait pas seul : parler à l'équipe, écouter la vision tech et la vision produit, rassembler les informations qui ne sont nulle part dans le code, comprendre le contexte avant d'interpréter les chiffres.

Sans cette couche humaine, l'outil reste interprété sur la base de suppositions qui comblent les trous. Et une supposition mal posée, c'est un diagnostic faux.

Les outils servent à confirmer ou infirmer des hypothèses humaines, pas à produire des rapports en pilotage automatique. À la fin, c'est un humain qui finit par lire ce rapport. Autant ne pas noyer le poisson.

C'est cette lecture humaine que je propose dans [mes audits](/audit). Pas un rapport de 500 lignes généré par un outil. Un diagnostic qui distingue le voulu de l'accidentel, qui priorise par impact business, qui assume les décisions qu'il propose.

Si ton équipe galère malgré des dashboards au vert, c'est probablement qu'il manque la lecture qu'aucun outil ne fait à ta place. [Discutons de ton contexte](/audit).

## Glossaire

1. **Complexité cyclomatique** : nombre de chemins d'exécution indépendants dans une fonction. Plus il est élevé, plus la fonction est difficile à tester et à faire évoluer.
2. **Couplage** : degré de dépendance entre deux modules. Plus il est fort, plus une modification de l'un force une modification de l'autre.
3. **Loi de Goodhart** : « quand une mesure devient un objectif, elle cesse d'être une bonne mesure. »
4. **Trunk-based development** : intégration continue de tout le travail sur la branche principale, par petits incréments, plutôt que via de longues branches.
5. **Event Storming** : atelier collaboratif (Alberto Brandolini) qui cartographie un processus métier par ses événements, en réunissant toutes les parties prenantes dans la même pièce.
6. **Sous-domaine feuille** : dans la décomposition d'un métier en sous-domaines, le niveau terminal qu'on ne découpe plus. C'est la bonne granularité pour extraire un module autonome, car les dépendances entrantes y sont les plus faibles.
7. **Anti-Corruption Layer (ACL)** : couche qui protège un contexte de tout ce qui vient d'un système extérieur : son vocabulaire, son modèle, ses changements, ses instabilités. On traduit à la frontière plutôt que de laisser l'extérieur dicter l'intérieur.


## Sources

- [Les métriques DORA : mesurer la performance DevOps](https://blog.stephane-robert.info/docs/devops/fondamentaux/dora/) — Stéphane Robert — référence francophone sur les métriques DORA
- [DORA 2025: Measuring Software Delivery After AI](https://redmonk.com/rstephens/2025/12/18/dora2025/) — RedMonk — analyse du rapport DORA 2025 et de ses limites
- [The DORA 4 key metrics become 5](https://cd.foundation/blog/2025/10/16/dora-5-metrics/) — CD Foundation — la cinquième métrique
- [Loi de Goodhart](https://fr.wikipedia.org/wiki/Loi_de_Goodhart) — Wikipédia
- [DX Core 4](https://getdx.com/blog/dora-metrics/) — DX — framework qui ajoute une dimension Impact à DORA
- [SPACE Framework](https://queue.acm.org/detail.cfm?id=3454124) — Forsgren, Storey, Maddila, Zimmermann, Houck, Butler (ACM Queue, 2021)
- [False Positive Vulnerability](https://tuxcare.com/blog/false-positive-vulnerability/) — TuxCare — sur la prévalence des faux positifs et la fatigue d'alerte
- [Alignment Risk Update: Claude Mythos Preview](https://www-cdn.anthropic.com/3edfc1a7f947aa81841cf88305cb513f184c36ae.pdf) — Anthropic — citation au conditionnel sur la supervision humaine
- [Technical Debt Quadrant](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html) — Martin Fowler — le quadrant de la dette technique
