export function validateArgInfoTokenVals(argInfo, logger) {
	if (argInfo.tokenVals !== undefined) {
		if (!(argInfo.tokenVals instanceof Array))
			logger(`tokenVals must either be undefined or be an Array but found ${argInfo.tokenVals}`);
		else {
			for (const val of argInfo.tokenVals) {
				if (typeof val !== 'string')
					logger(`Every element in tokenVals must be a string but found ${val}`);
			}
		}
	}
};