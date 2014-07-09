#!/bin/sh

python3 transfer_qa.py
echo delete and copy successful
python3 min_js.py
echo minify successful