#!/bin/sh

./minify.sh

scp -r website/* mpaulweeks_hasanimebeensavedthisweek@ssh.phx.nearlyfreespeech.net:/home/public
