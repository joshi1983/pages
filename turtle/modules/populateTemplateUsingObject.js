const templateSymbolExpression = /\$\$_[a-zA-Z0-9_]+_\$\$/g;

export function populateTemplateUsingObject(template, obj) {
	if (typeof template !== 'string')
		throw new Error('template must be a string');
	if (typeof obj !== 'object')
		throw new Error('obj must be an object');

	function replacer(match, offset, string) {
		const propName = match.substring(3, match.length - 3);
		if (obj[propName] !== undefined)
			return '' + obj[propName];
		else
			return match; // no substitution
	}

	return template.replace(templateSymbolExpression, replacer);
};