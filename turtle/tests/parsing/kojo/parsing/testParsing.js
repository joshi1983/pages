import { testParseAssignment } from './testParseAssignment.js';
import { testParseClass } from './testParseClass.js';
import { testParseDef } from './testParseDef.js';
import { testParseEventHandlers } from './testParseEventHandlers.js';
/*import { testParseExpressionDotProperty } from './testParseExpressionDotProperty.js';
import { testParseFor } from './testParseFor.js';
import { testParseFuncCall } from './testParseFuncCall.js';
import { testParseIf } from './testParseIf.js';
import { testParseImport } from './testParseImport.js';
import { testParseMatch } from './testParseMatch.js';
import { testParseNew } from './testParseNew.js';
import { testParseOperators} from './testParseOperators.js';
import { testParseRepeat } from './testParseRepeat.js';
import { testParseRepeatFor } from './testParseRepeatFor.js';
import { testParseTreeAnalysis } from './parse-tree-analysis/testParseTreeAnalysis.js';
import { testParseVal } from './testParseVal.js';
import { testParseVar } from './testParseVar.js';
import { testParseVariousExamples } from './testParseVariousExamples.js';
import { testParseWhile } from './testParseWhile.js';
*/import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testParsing(logger) {
	wrapAndCall([
		testParseAssignment,
		testParseClass,
		testParseDef,
		testParseEventHandlers,
		/*testParseExpressionDotProperty,
		testParseFor,
		testParseFuncCall,
		testParseIf,
		testParseImport,
		testParseMatch,
		testParseNew,
		testParseOperators,
		testParseRepeat,
		testParseRepeatFor,
		testParseTreeAnalysis,
		testParseVal,
		testParseVar,
		testParseVariousExamples,
		testParseWhile*/
	], logger);
};