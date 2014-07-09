#!/bin/sh

python3 python/transfer_qa.py
echo delete and copy successful
python3 python/min_js.py
echo minify successful