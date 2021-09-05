export function validateRemoveCallTokenOnly(commandInfo, logger) {
	if (commandInfo.removeCallTokenOnly !== undefined) {
		const removeCallTokenOnly = commandInfo.removeCallTokenOnly;
		if (typeof removeCallTokenOnly !== 'boolean')
			logger(`removeCallTokenOnly must to be boolean or undefined.  Not: ${removeCallTokenOnly}`);
		else if (removeCallTokenOnly) {
			if (commandInfo.args !== undefined && commandInfo.args.length !== 1)
				logger(`When removeCallTokenOnly is true, args should either not be specified or indicate 1 in length but you specified ${commandInfo.args.length}.  More than 1 args means removing the call token is very likely going to make at least 1 argument not useful and erroneous in the resulting code.  If 0 args is specified, removeInMigration should be used instead of removeCallTokenOnly.`);
		}
	}
};