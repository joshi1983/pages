# modules/commandGroups

The commandGroups folder contains files for implementing various commands listed in json/commands.json.
The command implementations are split into different .js files because we don't want a single .js file growing to thousands of lines of code as many Logo commands get added to WebLogo.
There are an awful lot of Logo commands that can serve wildly different purposes so implementing them all in a single .js file doesn't seem like the best approach.
