#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

cd ${SCRIPT_DIR}/../web

CUR_TIME=$(date +%s)

docker build --build-arg DISABLE_CACHE=$CUR_TIME -t bestinapi:0.4 .

cd -

docker save -o bestinapi_0.4.tar bestinapi:0.4