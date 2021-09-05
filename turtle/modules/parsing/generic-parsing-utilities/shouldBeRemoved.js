export function shouldBeRemoved(commandInfo) {
	if (commandInfo !== undefined)
		return commandInfo.removeInMigration === true;
	return false;
};