export function validatePrepositionSuffix(commandInfo, logger) {
	if (commandInfo.returnTypes !== 'bool')
		return; // the preposition check applies only to commands that return boolean.

	const primaryName = commandInfo.primaryName.toLowerCase();
	if (primaryName.endsWith('p') && commandInfo.hintNames !== undefined) {
		const shortenedPrimaryName = primaryName.substring(0, primaryName.length - 1);
		const match = commandInfo.hintNames.filter(hn => hn.endsWith('?') && hn === shortenedPrimaryName)[0];
		if (match !== undefined)
			logger(`${match} would be a better primary name than ${commandInfo.primaryName}.  We don't want the p suffix because in WebLogo to be short for preposition.  ? is clearer.`);
	}
	else if (primaryName.endsWith('?')) {
		const shortenedPrimaryName = primaryName.substring(0, primaryName.length - 1);
		const hintNameToLookFor = shortenedPrimaryName + 'p';
		const msg = `.  A lot of other Logo versions offer p replacing ? as an alternative name.`;
		if (commandInfo.hintNames === undefined)
			logger(`Consider adding a hintName of ${hintNameToLookFor}${msg}`);
		else {
			if (!commandInfo.hintNames.some(hn => hn === hintNameToLookFor))
				logger(`Expected to find ${hintNameToLookFor} in hintNames but did not${msg}`);
		}
	}
};