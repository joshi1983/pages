export function cleanBorderSize(s) {
	if (s === undefined)
		s = 0;
	else if (typeof s === 'string' && s.endsWith('px'))
		s = s.substring(0, s.length - 2);
	if (typeof s === 'string') {
		s = parseFloat(s);
		if (isNaN(s))
			console.error('border size expected to be a number but got NaN');
	}
	return s;
};