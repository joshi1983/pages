import { processTokens } from './helpers/processTokens.js';

export function processInGeneral(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken must be a function but got ${processToken}`);
	return function(token, result, settings) {
		if (typeof settings === 'object') {
			if (settings.tokenProcessMap !== undefined) {
				const processor = settings.tokenProcessMap.get(token);
				if (processor !== undefined)
					return processor(token, result, settings);
			}
			if (settings.shouldUseCustomProcessTokenForToken !== undefined) {
				if (settings.shouldUseCustomProcessTokenForToken(token))
					return settings.processToken(token, result, settings);
			}
		}
		if (token.val !== null)
			result.append(token.val);
		processTokens(processToken, token.children, result, settings);
	};
};