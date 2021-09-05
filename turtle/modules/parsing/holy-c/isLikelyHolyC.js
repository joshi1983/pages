import { matchesARegex } from '../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const antisignals = [];
const signals = [
	/(^|[\r\n\(]|static|private|public)\s*(I32|I64|U0|U64|U8)\s*(\*)?\s*[a-zA-Z_][a-zA-Z\d_]*\s*([\[\),\=;])/ 
	// common variable or parameter declaration
];

export function isLikelyHolyC(code) {
	if (matchesARegex(antisignals, code))
		return false;
	if (matchesARegex(signals, code))
		return true;
	return false;
};