import { compile } from '../compile.js';
import { getDrawingSnapshot } from '../../drawing/vector/animation/getDrawingSnapshot.js';
import { isNumber } from '../../isNumber.js';
import { LogoParser } from '../LogoParser.js';
import { ParseLogger } from '../loggers/ParseLogger.js';

export function codeToDrawing(code, animationTime, animationDuration) {
	if (!isNumber(animationTime))
		animationTime = 0;
	if (!isNumber(animationDuration))
		animationDuration = 10;
	const logger = new ParseLogger();
	const extraProcedures = new Map();
	const tree = LogoParser.getParseTree(code, logger, extraProcedures);
	const initialVariables = new Map();
	return new Promise(function(resolve, reject) {
		if (logger.hasLoggedErrors())
			reject('Parsing failed with errors');
		else {
			const program = compile(code, tree, logger, extraProcedures, {'translateToJavaScript': true}, initialVariables);
			getDrawingSnapshot(program, animationTime, animationDuration).then(function(drawing) {
				resolve(drawing);
			}).catch(function() {
				reject(...arguments);
			});
		}
	});
};