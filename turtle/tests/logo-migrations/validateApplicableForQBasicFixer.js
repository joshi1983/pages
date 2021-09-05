export function validateApplicableForQBasicFixer(commandInfo, logger) {
	if (commandInfo.applicableForQBasicFixer !== true)
		return; // nothing more to check.
	const keys = ['to', 'toProc', 'migrateToCode'];
	for (const key of keys) {
		if (commandInfo[key] !== undefined)
			return;
	}
	logger(`When applicableForQBasicFixer is true, one of the following must be specified: ${keys.join(',')}  None of those were defined.`);
};