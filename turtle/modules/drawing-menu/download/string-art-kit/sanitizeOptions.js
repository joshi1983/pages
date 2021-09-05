export function sanitizeOptions(options) {
	if (options === undefined)
		options = {
			'lineHints': false
		};
	if (typeof options !== 'object')
		throw new Error('options must be an object.  Not: ' + options);
	if (typeof options.lineHints !== 'boolean')
		options.lineHints = false;
	return options;
};