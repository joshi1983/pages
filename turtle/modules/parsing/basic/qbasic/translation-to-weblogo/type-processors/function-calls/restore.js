export function restore(token, result, options) {
	if (options.restoreProcName !== undefined) {
		result.append('\n' + options.restoreProcName + '\n');
	}
};