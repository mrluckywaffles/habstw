#!/bin/sh

python3 minify.py
echo minify successful

scp -r website/* mpaulweeks_hasanimebeensavedthisweek@ssh.phx.nearlyfreespeech.net:/home/public
