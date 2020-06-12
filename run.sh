#!/bin/sh
#
_PATH="/data/app/deno-page"
_REPO="https://github.com/blubbll/deno-page.git"
_DENO_REMOTE_BIN="https://libs.b-cdn.net/deno"
_ENTRY_FILE="https://raw.githubusercontent.com/blubbll/deno-page/glitch/index.ts.js"
#
rm -r $_PATH
git clone $_REPO
wget -O $_PATH/deno $_DENO_REMOTE_BIN
chmod u+x $_PATH/deno
wget -O $_PATH/script.ts $_ENTRY_FILE
$_PATH/deno run --allow-all $_PATH/script.ts