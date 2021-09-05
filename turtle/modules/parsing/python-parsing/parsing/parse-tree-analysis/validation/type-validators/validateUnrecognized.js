export function validateUnrecognized(token, parseLogger) {
	parseLogger.error(`Unrecognized token type found for a token with val ${token.val}`, token);
};