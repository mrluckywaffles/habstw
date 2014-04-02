#!/bin/sh

python3 minify.py

scp -r website/* mpaulweeks_hasanimebeensavedthisweek@ssh.phx.nearlyfreespeech.net:/home/public
