http://hasanimebeensavedthisweek.com

Simple static website that tells if you this week's episode of (insert currently-airing anime*) has been subbed and released.

Checks both legitimate and fansub RSS feeds for anything named (anime*) uploaded since last Sunday morning. If it detects something, it will display a message and provide related links.

It also plays music for some reason?!?

*originally made for Kill la Kill, currently displaying status for ???

TODO:

- fix whitespace on solicitation message (see overlay CSS)
- cleanup (make class either hyphen or camel, make modules _ or not, etc)
- extract refresh logic into a module
- figure out if possible to rss official channels
	- http://www.crunchyroll.com/feed
	- http://www.funimation.com/shows/ping-pong-the-animation/home
- figure out solution to "the commie problem" (releasing so late it trigger next week)
- adjust cookies to save songs based on show!!
