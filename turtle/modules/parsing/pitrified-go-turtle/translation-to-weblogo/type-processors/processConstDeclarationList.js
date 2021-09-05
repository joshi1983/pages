import { filterBracketsAndCommas } from './helpers/filterBracketsAndCommas.js';
import { getDescendentsOfType } from '../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

export function processConstDeclarationList(token, result, settings) {
	let iotaVal = 0;
	for (const child of filterBracketsAndCommas(token.children)) {
		// look for iota references in child.
		const iotas = getDescendentsOfType(child, ParseTreeTokenType.IDENTIFIER).filter(t => t.val === 'iota');
		for (const iotaToken of iotas) {
			settings.tokenProcessors.set(iotaToken, function() {
				result.append(`${iotaVal} `);
			});
		}
		processToken(child, result, settings);
		iotaVal++;
	}
};