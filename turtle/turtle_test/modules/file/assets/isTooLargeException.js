export function isTooLargeException(e) {
	if (e instanceof DOMException) {
		if (e.name === 'QuotaExceededError')
			return true;
		if (e.message.indexOf('exceeded the quota') !== -1)
			return true;
	}
	return false;
};