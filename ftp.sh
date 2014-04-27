#!/bin/sh

minify=0

while [ "$1" != "" ]; do
    case $1 in
        -m | --minify )         minify=1
                                ;;
    esac
    shift
done


if [ "$minify" = "1" ]; then
	./minify.sh
fi

scp -r website/* mpaulweeks_hasanimebeensavedthisweek@ssh.phx.nearlyfreespeech.net:/home/public
