#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

cd ${SCRIPT_DIR}/../web

docker build . -t bestinapi:0.1