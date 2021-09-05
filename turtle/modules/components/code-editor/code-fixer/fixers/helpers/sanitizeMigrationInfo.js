/*
json/commands.json is maintained in a more strict format than the data in the
json/logo-migrations directory.  The format of Logo migrations is more
relaxed because there is a lot more data in there and maintaining each and 
every attribute would take longer than maintaining it with just completeness 
to pass some tests in tests/testLogoCodeMigrationsJSON.js.

This helps to fix some issues so modules/parsing/Command.js can be
used on commands from migration files.
*/
export function sanitizeMigrationInfo(info) {
	for (const commandInfo of info.commands) {
		if (commandInfo.names === undefined)
			commandInfo.names = [];
	}
	if (info.operators === undefined)
		info.operators = [];
};