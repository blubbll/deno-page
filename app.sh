#!/bin/sh
#### vars
_APP_PATH="/data/app"
_REPO_NAME="deno-page"
_REPO_AUTHOR="blubbll"
_REPO="https://github.com/$_REPO_AUTHOR/$_REPO_NAME.git"
_ENTRY_FILE="index"
####
_PATH=$_APP_PATH/$_REPO_NAME
#### action
# clear cache
rm -r $_PATH/*
# clone repo
git clone $_REPO $_PATH
# make script runnable...
mv $_PATH/$_ENTRY_FILE.ts.js $_PATH/$_ENTRY_FILE.ts
# ...and run it
deno run --allow-all $_PATH/$_ENTRY_FILE.ts