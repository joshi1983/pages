export function checkPrimaryName(primaryName, logger) {
	if (typeof primaryName === 'string') {
		if (primaryName.trim() !== primaryName)
			logger(`The primaryName should not begin or end with a whitespace but found "${primaryName}"`);
		else {
			const whitespaceFixed = primaryName.replace(/\s+/g, ' ');
			if (whitespaceFixed !== primaryName)
				logger(`The only whitespaces allowed in the primaryName must be regular spaces and only 1 consecutive space is allowed.  Found "${primaryName}" when it should be "${whitespaceFixed}"`);
		}
	}
};