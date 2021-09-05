export function validateUnrecognized(token, parseLogger) {
	parseLogger.error(`Unrecognized token value "${token.val}"`, token);
};