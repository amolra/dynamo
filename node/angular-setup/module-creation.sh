#!/bin/bash
echo "In" 
echo "$1"
echo "$2"
echo "$3"
cd "$1"
if [ "$2" = 'app' ]; then
    echo "In" 
    echo  "$1/modules/$3"
    if [ ! -d  "$1/modules/$3" ]; then
        npx ng generate module "modules/$3" --module="$2"
    fi
else
    if [ ! -d  "$1/modules/$2/$3" ]; then
        npx ng generate module "modules/$2/$3" --module="$2"
    fi
fi
