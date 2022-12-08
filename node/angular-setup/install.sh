#!/bin/bash
npx ng new my-app
cd my-app
npm i @angular/material
npx ng generate module app-routing --flat --module=app
npx ng generate module modules/login --module=app
npx ng generate module modules/material --module=app
npx ng g c modules/login/login --module=modules/login/login.module.ts
npx ng g s modules/login/login