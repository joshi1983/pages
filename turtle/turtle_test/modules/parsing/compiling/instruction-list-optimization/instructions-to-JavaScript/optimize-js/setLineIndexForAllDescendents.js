import { getAllDescendentsAsArray } from '../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getSortedFirstTokenFromArray } from '../../../../generic-parsing-utilities/getSortedFirstTokenFromArray.js';

export function setLineIndexForAllDescendents(token, lineIndex, colIndex) {
	const descendents = getAllDescendentsAsArray(token);
	descendents.push(token);
	const firstToken = getSortedFirstTokenFromArray(descendents);
	const colIndexOffset = colIndex - firstToken.colIndex + 1;
	descendents.forEach(function(t) {
		t.lineIndex = lineIndex;
		t.colIndex += colIndexOffset;
	});
};