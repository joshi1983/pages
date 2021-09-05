export function validateBasics(fullInfoObject, logger) {
	const strings = ['name', 'externalLink', 'description'];
	strings.forEach(function(string) {
		if (typeof fullInfoObject[string] !== 'string')
			logger(`Expected ${string} to be a string but got ${fullInfoObject[string]}`);
	});
	if (fullInfoObject.toProcPath !== undefined && typeof fullInfoObject.toProcPath !== 'string')
		logger(`Expected toProcPath to be a string but it is ${fullInfoObject.toProcPath}`);
	const boolProps = ['caseSensitiveCommandNames', 'poundStartsComments'];
	for (const prop of boolProps) {
		if (fullInfoObject[prop] !== undefined &&
		typeof fullInfoObject[prop] !== 'boolean')
			logger(`Expected ${prop} to be either not specified or boolean but got ${fullInfoObject[prop]}`);
	}
};