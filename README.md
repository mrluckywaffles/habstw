http://hasanimebeensavedthisweek.com

Simple static website that tells if you this week's episode of (insert currently-airing anime*) has been subbed and released.

Checks both legitimate and fansub RSS feeds for anything named (anime*) uploaded since last Sunday morning. If it detects something, it will display a message and provide related links.

It also plays music for some reason?!?

*originally made for Kill la Kill, currently displaying status for new JoJo episodes

NOTICE ON HOW TO USE REPO IN CASE YOU WANT TO BRANCH/FORK:

The easiest way to code in this repo is to make all your changes in the "qatest" directory. That's where the real coding happens/file changes matter.

To see those changes "come to life" in the main site, just run "minify.sh" in the main directory. It clears out the current non-qa code, copies qa over, then concats all js files into one larger file (to ease traffic on my modest host provider).

The ftp.sh also performs the minify if you pass "-m" but you would need creds to ftp soooooo :)

TODO:

- cleanup (make class either hyphen or camel, make modules _ or not, etc)
- extract refresh logic into a module
- figure out if possible to rss official channels
	- http://www.crunchyroll.com/feed
	- http://www.funimation.com/shows/ping-pong-the-animation/home
- figure out solution to "the commie problem" (releasing so late it trigger next week)
- fix favicon
- adjust cookies to save songs based on show
- fix bug(?) where songs dont loop
