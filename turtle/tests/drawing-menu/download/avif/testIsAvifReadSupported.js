import { isAvifReadSupported } from '../../../../modules/drawing-menu/download/avif/isAvifReadSupported.js';

export function testIsAvifReadSupported(logger) {
	const result = isAvifReadSupported();
	if (!(result instanceof Promise))
		logger(`Expected isAvifReadSupported() to return a Promise but got ${result}`);
};