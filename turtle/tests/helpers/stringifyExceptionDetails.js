export function stringifyExceptionDetails(details) {
	if (typeof details === 'object') {
		if (typeof details.e === 'object' && typeof details.e.message === 'string')
			return details.e.message;
	}
	return '' + details;
};