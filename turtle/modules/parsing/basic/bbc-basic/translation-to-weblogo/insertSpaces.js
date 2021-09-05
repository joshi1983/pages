import { genericInsertSpaces } from '../../helpers/genericInsertSpaces.js';

const insertSpaces = genericInsertSpaces([
	[/^\s*([1-9][0-9]*\s*\:?)?\s*DEFPROC/i, 4],
	[/^\s*([1-9][0-9]*\s*\:?)?\s*FOR\S/i, 1],
	[/^\s*([1-9][0-9]*\s*\:?)?\s*INPUT\S/i, 1],
	[/^\s*([1-9][0-9]*\s*\:?)?\s*MODE\S/i, 1],
	[/^\s*([1-9][0-9]*\s*\:?)?\s*PRINT\S/i, 1],
	[/^\s*([1-9][0-9]*\s*\:?)?\s*VDU\S/i, 1]
]);

export { insertSpaces };