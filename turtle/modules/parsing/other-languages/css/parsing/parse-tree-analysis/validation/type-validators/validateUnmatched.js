export function validateUnmatched(token, parseLogger) {
	parseLogger.error(`Unable to classify ${token.val} to a recognized token type`, token);
};