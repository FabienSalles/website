---
title: "Vous ressentez de la frustration à cause de vos Pull Requests ?"
description: "Voici 10 cas personnels et des solutions que l’on peut envisager pour y répondre👇 "
pubDate: 2023-06-14
categories: ["CI/CD", "mindset", "organisation"]
linkedinPostUrl: "https://www.linkedin.com/feed/update/urn:li:share:7074446162908311553/"
draft: false
---

Voici 10 cas personnels et des solutions que l’on peut envisager pour y répondre👇

1️⃣ “Cela fait une journée que j’attends ma review” ⇒  
👉 Relire en priorité les PRs en attente avant de commencer à travailler (début de matiné/arpès-midi)  
👉 Relire les PRs avant de commencer un nouveau sujet  
👉 Notifier l’équipe d’une nouvelle PR en attente de relecture

2️⃣  “Cela fait 2 jours que j’attends un approval (ou un merge)” ⇒  
👉 Ne pas hésiter à relancer  
👉 Utiliser des outils pour notifier lorsque la PR attend depuis longtemps : [Reviewpad](https://reviewpad.com/) , [GitLab Triage](https://gitlab.com/gitlab-org/ruby/gems/gitlab-triage)

3️⃣ ”J’ai des échanges interminables sur ma PR” ⇒  
👉 Échanger de vive voix avec la personne concernée et indiquer la conclusion en commentaire de PR  
👉 Faire une Peer Review

4️⃣ ”Je dois traiter des retours liés à des conventions de codage” ⇒ 👉 Automatiser cela via la CI et un Linter

5️⃣ ”On n'arrête pas de me proposer des améliorations mais ce que j’ai fait fonctionne et pourrait déjà être mergé !”⇒  
👉 Catégoriser les retours et différer la prise en compte de ceux qui sont non bloquants  
👉 Utiliser Promyze

6️⃣ ”On a 5 montées de versions en attentes ” ⇒  
👉 Automatiser (avec le merge) les montées de version via des outils comme Dependabot , [Renovate](https://github.com/renovatebot/renovate)

7️⃣ ”On a 10 PR en attentes de review” ⇒  
👉 Mettre en avant le bottleneck via un dashboard Kanban  
👉 Automatiser des alertes  
👉 Limiter la review à des PRs vraiment importantes grâce à la méthode [Ship Show Ask](https://martinfowler.com/articles/ship-show-ask.html)

8️⃣ ”Ta PR est vraiment trop grosse et difficile à comprendre”  
👉 Accélérer le rythme de review afin de faire des PRs atomiques sans bloquer les développements  
👉 Ne pas mélanger fonctionnalité et refactoring  
👉 Utiliser le feature flipping pour ne pas faire de BC Break tout en permettant de merge de manière itératif

9️⃣ ”On me dit que ce que j’ai fait ne va pas mais je n’ai pas compris la correction que je devais apporter” ⇒  
👉 Éviter de créer des retours bloquants  
👉 Donner à chaque fois des pistes de solutions aux problèmes remontés  

🔟 ”Si on m’aurait dit cela avant, j’aurais pu gagner du temps et éviter de partir dans une direction incorrecte”  
👉 Mieux spécifier le besoin et accentuer la communication avec l’équipe  
👉 Réduire la boucle de feedback en faisant du Pair/Mob et passer en Trunk-based development

Qu’en est-il de votre côté sur vos frustrations et solutions trouvées ?

---