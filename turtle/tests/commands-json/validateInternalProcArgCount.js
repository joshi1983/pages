export function validateInternalProcArgCount(commandInfo, logger) {
	const ipaCount = commandInfo.internalProcArgCount;
	if (ipaCount !== undefined) {
		if (!Number.isInteger(ipaCount))
			logger(`An integer is required but found ${ipaCount}`);
		else if (ipaCount < 0)
			logger(`A positive integer is required but found ${ipaCount}`);
		else if (typeof commandInfo.argCount !== 'object' || commandInfo.argCount === null)
			logger(`When internalProcArgCount is specified, argCount must also be specified but argCount found to be ${commandInfo.argCount}`);
		else {
			const argCount = commandInfo.argCount;
			if (!Number.isInteger(argCount.min) || !Number.isInteger(argCount.max))
				logger(`argCount min and max must be integers when internalProcArgCount is specified. min=${argCount.min}, max=${argCount.max}`);
			else if (argCount.min > ipaCount || argCount.max < ipaCount) {
				logger(`When internalProcArgCount is specified, it must be within the min.. max range of argCount. ${ipaCount} is not in the range ${argCount.min}.. ${argCount.max}`);
			}
		}
	}
};