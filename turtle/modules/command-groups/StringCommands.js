export class StringCommands {
	ascii(char1) {
		if (char1.length < 1)
			return 0;
		else
			return char1.charCodeAt(0);
	}

	char(num1) {
		return String.fromCharCode(num1);
	}

	lowerCase(s) {
		return s.toLowerCase();
	}

	str(val) {
		return '' + val;
	}

	substringp(s1, s2) {
		if (typeof s1 !== 'string' || typeof s2 !== 'string')
			this._warn('strings expected but got ' + s1 + ' and ' + s2 + ' in a call to substringp');
		else
			return s2.indexOf(s1) !== -1;
	}

	upperCase(s) {
		return s.toUpperCase();
	}	
};