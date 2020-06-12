#!/bin/sh
#### vars
_PATH="/data/app"
_REPO_NAME="deno-page"
_REPO_AUTHOR="blubbll"
_REPO="https://github.com/$_REPO_AUTHOR/$_REPO_NAME.git"
_DENO_REMOTE_BIN="https://libs.b-cdn.net/deno"
_ENTRY_FILE="https://raw.githubusercontent.com/$_REPO_AUTHOR/$_REPO_NAME/glitch/index.ts.js"
####
# clear cache
rm  $_PATH/*
# clone it again
git clone $_REPO $_PATH/$_REPO_NAME
cp -R $_PATH/$_REPO_NAME/* $_PATH
# get deno executable
wget -O $_PATH/deno $_DENO_REMOTE_BIN
# make it executable
chmod u+x $_PATH/deno
# get entry script
wget -O $_PATH/script.ts $_ENTRY_FILE
# and run it...
$_PATH/deno run --allow-all script.ts