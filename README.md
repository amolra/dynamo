# dynamo

Convert mechanical work in electronic media
Steps to setup project

1. first clone your project on your system.
2. in repo you will indentify 2 folders node and UI.
   2.1 Node -- This folder is used to setup the project for angular / react and creation of backend api.
   2.2 UI --- This folder is used for angular project through which we will call node api to setup project.--- Currently under progress.
3. Now go into node project and run npm install
4. Check file node/angular-setup/constants.ts file. Please check basePath constant for setup project path.
5. now run "npm run dev". this will start your node server.
6. Once your node server is up then execute below api in sequence
   6.1 http://localhost:3000/project-setup It will take 5 minutes to execute.
   6.2 http://localhost:3000/app-file-code-add This will do the changes related app modules, cration of routing module and routing linking
   6.3 http://localhost:3000/login-file-code-add This will create login page related code.
   6.4 login api code creation page is in progress. Or coming soon ;)
