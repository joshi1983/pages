export function prefixWrapper(prefix, log) {
	if (typeof log !== 'function')
		throw new Error('log must be specified and must be a function');
	if (typeof prefix !== 'string')
		throw new Error('prefix must be a string');

	return function(msg) {
		const [arg1, ...remainingArgs] = Array.from(arguments);
		log(prefix + ': ' + msg, ...remainingArgs);
	}
};