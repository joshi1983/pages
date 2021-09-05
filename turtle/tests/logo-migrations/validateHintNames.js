export function validateHintNames(commandInfo, logger) {
	const hintNames = commandInfo.hintNames;
	if (hintNames !== undefined) {
		if (!(hintNames instanceof Array))
			logger(`hintNames must either be undefined or be an Array but found ${hintNames}`);
		else {
			for (const hintName of hintNames) {
				if (typeof hintName !== 'string')
					logger(`Every hintNames element must be a string but found ${hintName}`);
			}
		}
	}
};