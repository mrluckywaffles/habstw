Simple static website that tells if you this week's episode of (insert currently-airing anime*) has been subbed and released.

Checks both legitimate and fansub RSS feeds for anything named (anime*) uploaded since last Sunday morning. If it detects something, it will display a message and provide related links.

It also plays music for some reason?!?

*originally made for Kill la Kill, currently displaying status for new JoJo episodes



TODO:

- cleanup (make class either hyphen or camel, make modules _ or not, etc)
- extract refresh logic into a module
- figure out if possible to rss official channels
	- eg: crunchyroll http://www.crunchyroll.com/feed
- figure out solution to "the commie problem" (releasing so late it trigger next week)
- fix favicon
- adjust cookies to save songs based on show
- fix bug(?) where songs dont loop
