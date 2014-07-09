http://hasanimebeensavedthisweek.com

Simple static website that tells if you this week's episode of (insert currently-airing anime*) has been subbed and released.

Checks both legitimate and fansub RSS feeds for anything named (anime*) uploaded since last Sunday morning. If it detects something, it will display a message and provide related links.

It also plays music for some reason?!?

*originally made for Kill la Kill, currently displaying status for new JoJo episodes

NOTICE ON HOW TO USE REPO IN CASE YOU WANT TO BRANCH/FORK:

The easiest way to code in this repo is to make all your changes in the "qatest" directory. That's where the real coding happens/file changes matter.

To see those changes "come to life" in the main site, just run "copy_qa_and_minify.sh" in the main directory. It copies (and overwrites) qa into the main directory, then concats all js files into one larger file with a timestamp.

NOTE: If you delete a directory in qa, you will need to delete it manually in the main site. The copy script is cautious about deleting things so that it doesn't wipe out this README or the favicon.

TODO:

- cleanup (make class either hyphen or camel, make modules _ or not, etc)
- extract refresh logic into a module
- figure out if possible to rss official channels
	- http://www.crunchyroll.com/feed
	- http://www.funimation.com/shows/ping-pong-the-animation/home
- figure out solution to "the commie problem" (releasing so late it trigger next week)
- adjust cookies to save songs based on show
