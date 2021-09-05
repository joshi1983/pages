import { CommentDumpingStringBuffer } from
'../../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { formatCode } from
'../../../../components/code-editor/format/formatCode.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getPropertyValues } from './getPropertyValues.js';
import { getReferencedProceduresCode } from
'./getReferencedProceduresCode.js';
import { getVariableInitializations } from './getVariableInitializations.js';
import { improveCode } from './improveCode.js';
import { parse } from '../parse.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processCommentToken } from './type-processors/processCommentToken.js';
import { processToken } from './type-processors/processToken.js';
import { sanitize } from './sanitization/sanitize.js';

export function translate0LToWebLogo(code) {
	const parseResult = parse(code);
	sanitize(parseResult.root);
	const settings = {
		'arrows': new Set(getDescendentsOfType(parseResult.root, ParseTreeTokenType.ARROW)
			.filter(t => t.children.length !== 0 && t.children[0].type === ParseTreeTokenType.IDENTIFIER).map(t => t.children[0].val))
	};
	const result = new CommentDumpingStringBuffer(parseResult.comments, processCommentToken);
	processToken(parseResult.root, result, settings);
	const translatedWithoutStandardProcedures = result.toString();
	const procs = getReferencedProceduresCode(translatedWithoutStandardProcedures);
	result.insertAtStart('\n' + procs + '\n');
	// add variable initializations.
	const propertyOverridesMap = getPropertyValues(parseResult.root);
	result.append(getVariableInitializations(result.toString(), propertyOverridesMap) + '\n');

	const translated = improveCode(result.toString() + '\naxiom 6 :length'); // call the axiom procedure to draw something.
	
	return formatCode(translated);
};