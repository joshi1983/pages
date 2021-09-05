export function validateBasics(fullInfoObject, logger) {
	const strings = ['description', 'externalLink', 'name'];
	strings.forEach(function(string) {
		if (typeof fullInfoObject[string] !== 'string')
			logger(`Expected ${string} to be a string but got ${fullInfoObject[string]}`);
	});
	const optionalStrings = ['longStringSymbol', 'singleLineCommentSymbol'];
	optionalStrings.forEach(function(string) {
		if (fullInfoObject[string] !== undefined && typeof fullInfoObject[string] !== 'string')
			logger(`Expected ${string} to be undefined or a string but got ${fullInfoObject[string]}`);
	});
	if (fullInfoObject.longStringSymbol !== undefined &&
	fullInfoObject.longStringSymbol.length !== 1)
		logger(`Expected a single character for longStringSymbol but found "${fullInfoObject.longStringSymbol}"`);

	if (fullInfoObject.toProcPath !== undefined && typeof fullInfoObject.toProcPath !== 'string')
		logger(`Expected toProcPath to be a string but it is ${fullInfoObject.toProcPath}`);
	const boolProps = ['caseSensitiveCommandNames', 'numberLiteralsCanStartWithPlus', 'poundStartsComments'];
	for (const prop of boolProps) {
		if (fullInfoObject[prop] !== undefined &&
		typeof fullInfoObject[prop] !== 'boolean')
			logger(`Expected ${prop} to be either not specified or boolean but got ${fullInfoObject[prop]}`);
	}
};