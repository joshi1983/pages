const defPrefixes = [
	'defdbl',
	'defint', 'deflng', 'defsng',
	'defstr'
];

export function sToTypePrefix(s) {
	s = s.toLowerCase();
	for (const prefix of defPrefixes) {
		if (s.startsWith(prefix))
			return prefix;
	}
};