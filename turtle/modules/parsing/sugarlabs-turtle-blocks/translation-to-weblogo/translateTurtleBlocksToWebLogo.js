import { blockInfoToName } from './block-processors/blockInfoToName.js';
import { formatCode } from '../../../components/code-editor/format/formatCode.js';
import { htmlProjectExportToJSON } from '../htmlProjectExportToJSON.js';
import { isLikelySugarLabsTurtleBlocksJSON } from '../isLikelySugarLabsTurtleBlocksJSON.js';
import { processBlock } from './block-processors/processBlock.js';
import { processPredefinedProcedures } from './processPredefinedProcedures.js';
import { StringBuffer } from '../../../StringBuffer.js';

function getStartingElements(elementsArray) {
	let candidateStartingElements = elementsArray.filter(function(e) {
		if (e.length < 5)
			return false;
		const linksElement = e[4];
		if (!(linksElement instanceof Array))
			return false;
		const linksFirstElement = linksElement[0];
		return linksFirstElement === null || linksFirstElement === -1; // no previous block
	});
	// filter down to starts only.
	const onlyStarts = candidateStartingElements.filter(e => blockInfoToName(e) === 'start');
	if (onlyStarts.length !== 0)
		candidateStartingElements = onlyStarts;
	if (candidateStartingElements.length !== 0)
		return candidateStartingElements;
	return [elementsArray[0]];
}

export function translateTurtleBlocksToWebLogo(code) {
	if (!isLikelySugarLabsTurtleBlocksJSON(code))
		code = htmlProjectExportToJSON(code);
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
	const startingElements = getStartingElements(data);

	for (const startingElement of startingElements) {
		processBlock(startingElement, result, settings);
	}
	code = processPredefinedProcedures(result.toString());
	return formatCode(code);
};