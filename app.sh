#!/bin/sh
#### vars
_PATH="/data/app"
_REPO_NAME="deno-page"
_REPO_AUTHOR="blubbll"
_REPO="https://github.com/$_REPO_AUTHOR/$_REPO_NAME.git"
_ENTRY_FILE="https://raw.githubusercontent.com/$_REPO_AUTHOR/$_REPO_NAME/glitch/index.ts.js"
####
# clear cache
rm  $_PATH/*
# clone repo
git clone $_REPO $_PATH/$_REPO_NAME && cp -R $_PATH/$_REPO_NAME/* $_PATH
# get entry script and run it
wget -O $_PATH/script.ts $_ENTRY_FILE && deno run --allow-all script.ts