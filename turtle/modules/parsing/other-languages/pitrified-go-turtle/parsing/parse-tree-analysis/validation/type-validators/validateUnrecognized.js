export function validateUnrecognized(token, parseLogger) {
	parseLogger.error(`All tokens should be recognized but found one unrecognized with val ${token.val}`, token);
};