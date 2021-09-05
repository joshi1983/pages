export function validateArgCount(commandInfo, logger) {
	if (commandInfo.argCount !== undefined) {
		if (typeof commandInfo.argCount === 'string') {
			if (commandInfo.argCount !== '?')
				logger('If argCount is a string, it should be \'?\' but got ' + commandInfo.argCount);
		}
		else if (typeof commandInfo.argCount === 'object') {
			['default', 'min', 'max'].forEach(function(key) {
				const val = commandInfo.argCount[key];
				if (typeof val !== 'number' && val !== undefined)
					logger(`If argCount.${key} is specified, it should be a number.  Not: ${val}`);
			});
		}
		else
			logger('If argCount is specified, it should either be "?" or an object defining either min or max');
	}
};