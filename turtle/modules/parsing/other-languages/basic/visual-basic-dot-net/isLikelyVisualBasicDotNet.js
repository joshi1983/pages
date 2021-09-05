import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyExpressions = [
	/(^|[\r\n])\s*;/,
	/(^|[\r\n])\s*\/\//,
	/(^|[\r\n])\s*go[ \t]+to[ \t]/i,
];

const likelyExpressions = [
	/(^|[\r\n])\s*Friend[ \t]+Sub[ \t]+[A-Z][a-z_\d]*[ \t]*\(/,
	/(^|[\r\n])\s*Imports[ \t]+System[\.\s]/,
	/(^|[\r\n])\s*Module[ \t]+[A-Z][a-z_\d]*\s*[\r\n]/,
	/(^|[\r\n])\s*(Partial[ \t]+)?Class[ \t]+[A-Z][a-z_\d]*\s*:\s*Inherits\s*[A-Z][a-z_\d]*/,
	/(^|[\r\n])\s*Partial[ \t]+Class[ \t]+[A-Z][a-z_\d]*[ \t]*[\r\n]/,
];

function hasMissingPattern(code) {
	if (/(^|[\r\n])\s*class[ \t]+[a-z_][a-z_\d]*[:\s]/i.test(code)) {
		// classes in VB.net must end with End Class.
		if (!/(^|[\r\n])\s*end\s+class\s*([\r\n']|$)/i.test(code))
			return true;
	}
	if (/(^|[\r\n])\s*((continue|exit)[ \t]+)?for[ \t]+/i.test(code)) {
		// for-loops in VB.net must be ended using the next keyword.
		if (!/(^|[\r\n])\s*next\s*([\r\n']|$)/i.test(code))
			return true;
	}
	if (/(^|[\r\n])\s*function[ \t]+[a-z_][a-z_\d]*[ \t]*\(/i.test(code)) {
		// function definitions in VB.net must end with "End Function".
		if (!/(^|[\r\n])\s*end\s+function\s*([\r\n']|$)/i.test(code))
			return true;
	}
	if (/(^|[\r\n])\s*if[\s\(]/i.test(code)) {
		// if-statements in VB.net must end with "End If".
		if (!/(^|[\r\n])\s*end\s+if\s*([\r\n']|$)/i.test(code))
			return true;

		if (!/[\)\s]then[\s']/i.test(code))
			return true;
	}
	if (/(^|[\r\n])\s*module[ \t]+[a-z_][a-z_\d]*[:\s]/i.test(code)) {
		if (!/(^|[\r\n])\s*end\s+module\s*([\r\n']|$)/i.test(code))
			return true;
	}
	if (/(^|[\r\n])\s*select\s/i.test(code)) {
		// Select statements in VB.net must end with End Select.
		if (!/(^|[\r\n])\s*end\s+select\s*([\r\n']|$)/i.test(code))
			return true;

		// Select statements in VB.net must use the Case keyword.
		if (!/(^|[\r\n])\s*case\s/i.test(code))
			return true;
	}
	if (/(^|[\r\n])\s*sub[ \t]+[a-z_][a-z_\d]*[ \t]*\(/i.test(code)) {
		// Subroutines in VB.net must end with End Sub.
		if (!/(^|[\r\n])\s*end\s+sub\s*([\r\n']|$)/i.test(code))
			return true;
	}
	return false;
}

export function isLikelyVisualBasicDotNet(code) {
	if (matchesARegex(unlikelyExpressions, code))
		return false;

	if (hasMissingPattern(code))
		return false;

	if (matchesARegex(likelyExpressions, code))
		return true;

	return false;
};