import { processAsWebLogoFor } from
'./for/processAsWebLogoFor.js';

const forProcessors = [
	processAsWebLogoFor
];

export function processFor(token, result) {
	for (const process of forProcessors) {
		if (process(token, result))
			break;
	}
};