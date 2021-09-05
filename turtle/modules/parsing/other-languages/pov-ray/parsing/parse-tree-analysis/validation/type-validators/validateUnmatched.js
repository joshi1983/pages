export function validateUnmatched(token, parseLogger) {
	parseLogger.error(`Unable to find an appropriate ParseTreeTokenType for ${token.val}`, token);
};