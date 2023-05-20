#!/bin/bash
if [ ! -d "$1/my-app" ]; then
npx ng new my-app 
cd my-app
npm install @angular/material@15.0.2
npx ng generate module app-routing --flat --module=app
npx ng generate module modules/material --module=app
else 
echo "already exit;"
fi