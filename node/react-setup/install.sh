#!/bin/bash
if [ ! -d "$1/my-app" ]; then
    npm init vite@latest my-app -- --template react-ts
    cd my-app
    npm i react-router-dom
    npm i react-hook-form
    npm i axios
    npm install @mui/material @emotion/react @emotion/styled
    npm install -E react-router-dom @types/react-router-dom
     
else
    echo "already exists;"
fi
