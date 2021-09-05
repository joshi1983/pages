import { processBlock } from './processBlock.js';
import { processChildren } from './processChildren.js';

export function processFill(block, result, settings) {
	result.append(`\npolyStart\n`);
	processChildren(block, result, settings);
	result.append(`\npolyEnd\n`);
};