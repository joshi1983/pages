export function validateArgCount(argCount, logger) {
	if (argCount !== undefined) {
		if (typeof argCount === 'object') {
			['default', 'min', 'max'].forEach(function(key) {
				const val = argCount[key];
				if (val !== undefined) {
					if (!Number.isInteger(val))
						logger(`${key} must either be undefined or be an integer but found ${val}`);
				}
			});
		}
	}
};