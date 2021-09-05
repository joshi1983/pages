import { matchesARegex } from '../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const antisignals = [
	// indicator of Java or Processing
	// This wouldn't be in Holy-C because you can't define a class or enum as a built-in data type.
	/(^|\s)(class|enum)\s+(I16|I32|I64|I8|U0|U16|U32|U64|U8)\s*([{]|\s(extends|implements)\s+)/,
];
const signals = [
	/(^|[\r\n\(]|static|private|public)\s*(I16|I32|I64|I8|U0|U16|U32|U64|U8)\s*(\*)?\s*[a-zA-Z_][a-zA-Z\d_]*\s*([\[\),\=;])/ 
	// common variable or parameter declaration
];

export function isLikelyHolyC(code) {
	if (matchesARegex(antisignals, code))
		return false;
	if (matchesARegex(signals, code))
		return true;
	return false;
};