import { formatCode } from '../../../components/code-editor/format/formatCode.js';
import { processBlock } from './block-processors/processBlock.js';
import { StringBuffer } from '../../../StringBuffer.js';

export function translateTurtleBlocksToWebLogo(code) {
	const data = JSON.parse(code);
	const result = new StringBuffer();
	const elementsMap = new Map();
	for (const element of data) {
		const key = element[0];
		elementsMap.set(key, element);
	}
	const settings = {
		'map': elementsMap
	};
	const firstElement = data[0];
	processBlock(firstElement, result, settings);
	return formatCode(result.toString());
};