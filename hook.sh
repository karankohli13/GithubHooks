#!/bin/bash

branch=$1

wget -O projectmaster.zip -q "https://github.com/karankohli13/marketsfx-vue/archive/$branch.zip"

target_dir="marketsfx-vue"

if [ -f projectmaster.zip ]; then

    unzip -q projectmaster.zip

    rm projectmaster.zip

    (cd "staging-$branch"; npm i; npm run build)

    rm -rf $target_dir

    mv "staging-$branch" $target_dir

    sleep 5

    echo "Started :)"
fi
