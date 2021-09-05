export function validateUnmatched(token, parseLogger) {
	parseLogger(`No unmatched tokens should be found after parsing valid QBasic code.  Unmatched token found with val ${token.val} and a children.length of ${token.children.length}`, token);
};