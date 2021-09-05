export function prefixWrapper(prefix, log) {
	if (typeof log !== 'function')
		throw new Error('log must be specified and must be a function');
	if (typeof prefix !== 'string' && !(prefix instanceof Element))
		throw new Error('prefix must be a string or an Element');
	if (prefix === '')
		throw new Error('The prefix must not be an empty string.  You may aswell not use prefixWrapper if your prefix is empty.');
	const result = function(msg) {
		const [arg1, ...remainingArgs] = Array.from(arguments);
		let tagName = 'div';
		if (msg.tagName !== 'DIV') {
			tagName = 'span';
		}
		let s;
		if (typeof prefix === 'string')
			s = document.createTextNode(prefix + ': ');
		else {
			s = document.createElement('span');
			s.appendChild(prefix);
			s.appendChild(document.createTextNode(': '));
		}
		let s2 = document.createElement(tagName);
		s2.classList.add('prefixed-container');
		s2.appendChild(s);
		if (typeof msg === 'string')
			msg = document.createTextNode(msg);
		s2.appendChild(msg);
		log(s2, ...remainingArgs);
	};
	result.indicators = log.indicators;

	return result;
};