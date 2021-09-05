import { createDrawingFromCode } from
'./createDrawingFromCode.js';

export function createDrawingWithPenGradient(logger) {
	const code = `setPenGradient createRadialGradient pos 100 createPList2 [
		[0 "red] [0.5 "black] [0.75 "#7000] [1 transparent]
	]
	forward 100

	setPenGradient createLinearGradient [0 0] pos createPList2 [
		[0 "red] [0.5 "black] [0.75 "#7000] [1 transparent]
	] "pad
	backward 100`;
	return createDrawingFromCode(code, logger);
};