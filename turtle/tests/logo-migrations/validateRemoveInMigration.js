export function validateRemoveInMigration(commandInfo, logger) {
	if (commandInfo.removeInMigration === true) {
		['removeCallTokenOnly', 'to', 'toProc', 'toInline'].forEach(function(key) {
			if (commandInfo[key] !== undefined)
				logger(`When removeInMigration is true, expected ${key} to be undefined but got ${commandInfo.to}`);
		});
		if (commandInfo.args === undefined && commandInfo.argCount === undefined)
			logger(`When removeInMigration is specified, args and/or argCount must be specified to determine how many arguments to remove with the command call.  args and argCount were not specified, though.`);
	}
};