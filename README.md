Simple static website that tells if you this week's episode of (insert currently-airing anime*) has been subbed and released.

Checks both legitimate and fansub RSS feeds for anything named (anime*) uploaded since last Sunday morning. If it detects something, it will display a message and provide related links.

It also plays music for some reason?!?

*originally made for Kill la Kill, currently displaying status for new JoJo episodes



TODO:

- cleanup (make class either hyphen or camel, make modules _ or not, etc)
- extract refresh logic into a module
- automate copying qa
- add crunchyroll http://www.crunchyroll.com/feed
- add commie
- replace "soon" with something more helpful
- add link to KLK version
