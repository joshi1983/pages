import { ShortTermBase64Cache } from '../../../../modules/command-groups/helpers/drawing/ShortTermBase64Cache.js';

export async function testShortTermBase64Cache(logger) {
	const result = ShortTermBase64Cache.getBase64('');
	if (!(result instanceof Promise))
		logger(`Expected result to be a Promise but got ${result}`);
	const base64String = await result;
	if (typeof base64String !== 'string')
		logger(`Expected a base64 data URL string but got ${base64String}`);
};