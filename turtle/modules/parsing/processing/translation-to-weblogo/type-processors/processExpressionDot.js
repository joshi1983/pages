import { processPropertyRead } from './processPropertyRead.js';

export function processExpressionDot(token, result, settings) {
	result.trimRight();
	result.append(' (');
	processPropertyRead(token, result, settings);
	result.trimRight();
	result.append(' )');
};