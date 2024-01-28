function leftTrimComment(s) {
	for (let i = 0; i < s.length; i++) {
		const ch = s.charAt(i);
		if (ch === ';')
			return s.substring(0, i) + s.substring(i + 1);
		else if (!(/\s/g.test(ch)))
			break;
	}
	return s;
}

function commentAtFirstNonWhitespace(s) {
	for (let i = 0; i < s.length; i++) {
		const ch = s.charAt(i);
		if (ch === ';')
			return s;
		else if (!(/\s/g.test(ch)))
			return s.substring(0, i) + ';' + s.substring(i);
	}
	return s + ';';
}

export class Comments {
	static removeCommentPrefixes(s) {
		const lines = s.split('\n');
		return lines.map(l => leftTrimComment(l)).join('\n');
	}

	static addCommentPrefixes(s) {
		if (s === '')
			return ';';
		const lines = s.split('\n');
		return lines.map(l => commentAtFirstNonWhitespace(l)).join('\n');
	}
};