#!/bin/bash

# check if tectonic is available, if not download it
if ! command -v ./tectonic &> /dev/null && ! command -v tectonic &> /dev/null; then
    echo "Tectonic not found. Downloading..."
    curl -L -O https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.15.0/tectonic-0.15.0-x86_64-apple-darwin.tar.gz
    tar -xzf tectonic-0.15.0-x86_64-apple-darwin.tar.gz
    chmod +x tectonic
    rm tectonic-0.15.0-x86_64-apple-darwin.tar.gz
fi

TECTONIC_BIN="./tectonic"
if command -v tectonic &> /dev/null; then
    TECTONIC_BIN="tectonic"
fi

$TECTONIC_BIN "$1"
