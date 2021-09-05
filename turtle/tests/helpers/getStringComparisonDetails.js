export function getStringComparisonDetails(s1, s2) {
	if (s1 === s2)
		return 'They are equal';
	else {
		if (typeof s1 !== 'string')
			return 'At least one is not a string.  type of one is ' + typeof s1;
		if (typeof s2 !== 'string')
			return 'The second value is not a string.  type of it is ' + typeof s2;
		for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
			const c = s1.charAt(i);
			if (c !== s2.charAt(i))
				return 'The first index that is not equal is ' + i + '. One string has character(' + c + ') and the other has (' + s2.charAt(i) + ').  The remainder of the strings are "' + s1.substring(i) + '" and "' + s2.substring(i) + '"';
		}
		return 'Lengths are not equal.  One length is ' + s1.length + ' and the other is ' + s2.length;
	}
};