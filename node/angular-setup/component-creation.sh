#!/bin/bash
cd $1
echo "In component create" 
echo "$1"
echo "$2"
echo "$3"
echo "$4"
if [ "$2" = 'app' ]; then
    if [ ! -d "$1/modules/$3/$4" ]; then
        npx ng g c "modules/$3/$4" --module="modules/$3/$3.module.ts"
        if [ ! -d "$1/modules/$3/$4.service.ts" ]; then
        npx ng g s "modules/$3/$3"
        fi
    fi
else
    if [ ! -d "$1/modules/$2/$3/$4" ]; then
        npx ng g c "modules/$2/$3/$4" --module="modules/$2/$3/$3.module.ts"
        if [ ! -d "$1/modules/$2/$3/$3.service.ts" ]; then
        npx ng g s "modules/$2/$3/$3"
        fi
    fi  
fi