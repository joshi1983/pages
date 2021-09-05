import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { getAllAssignableDataTypesString } from '../../helpers/getAllAssignableDataTypesString.js';
import { getPossibleDataTypesForVariableAtToken } from '../../../modules/parsing/parse-tree-analysis/getPossibleDataTypesForVariableAtToken.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';

const allTypesString = getAllAssignableDataTypesString();

export function testGetPossibleDataTypesForVariableAtToken(logger) {
	const cases = [
		{'code': 'make "x 5 print "here', 'types': 'int'},
		{'code': 'make "X 5 print "here', 'types': 'int'}, // variables are case-insensitive.
		{'code': 'make "x 5.4 print "here', 'types': 'num(finite)'},
		{'code': 'make "x true print "here', 'types': 'bool'},
		{'code': 'make "x [] print "here', 'types': 'list'},
		{'code': 'make "x :x print "here', 'types': allTypesString},
		{'code': 'queue "x 1 print "here', 'types': 'list'},
		{'code': 'fd :x print "here', 'types': 'num(finite)'},
		{'code': 'fd :X print "here', 'types': 'num(finite)'}, // variables are case-insensitive.
		{'code': 'make "x "here\nfd :x', 'types': allTypesString},
		// since the tokan being checked changes the value, the instructions after should not narrow the possible data types.

		{'code': 'make "x []\nsetFillColor mix :x transparent 0.5\nprint "here', 'types': 'list'},
		{'code': 'make "x []\nmake "x "here\nfd :x', 'types': 'list'},
		{'code': 'make "y 5\nmake "x :y print "here', 'types': 'int'},

		{'code': 'print 4 + :x\nprint "here', 'types': 'num'},
		{'code': 'fd :x\nprint 4 + :x\nprint "here', 'types': 'num(finite)'},
		{'code': 'setfillcolor :x\nprint "here', 'types': 'alphacolor|transparent'},
		{'code': 'for ["x 0 5 1] [\nprint "here]', 'types': 'int'},
		{'code': 'for ["y 0 5 1] [\nprint "here]', 'types': allTypesString},
		{'code': 'for ["x 0 5 1] [for ["y 0 5 1] [\nprint "here]]', 'types': 'int'},
		{'code': 'print "here setpencolor :x', 'types': 'alphacolor|transparent'},
		{'code': 'print "here setpencolor :x fd :x', 'types': 'int'},
		{'code': 'print "here setpencolor :x make "x 10 fd :x', 'types': 'alphacolor|transparent'},
		{'code': 'make "x 5 if 1 < 2 [print :x print "here]', 'types': 'int'},
		{'code': 'to f\nmake "x 5 if 1 < 2 [print :x print "here]\nend', 'types': 'int'},
		{'code': 'to f\nlocalmake "x 5 if 1 < 2 [print :x print "here]\nend', 'types': 'int'},
		{'code': 'make "x createPList print "here', 'types': 'plist'},
		{'code': 'to f :x\nsetProperty "x "key 5\nprint "here\nend\nmake "y createPList\nf :y\nprint "here', 'types': 'plist'},
		{'code': 'to p\nlocalmake "x 5\nprint "here\nend', 'types': 'int'},
		{'code': 'to p\nlocalmake "y 5\nlocalmake "x :y\nprint "here\nend', 'types': 'int'},
		{'code': 'to p :n\nlocalmake "a 0\nrepeat :n [\nlocalmake "x :a\nlocalmake "a :b\nlocalmake "b :x + :b\nprint "here]\nend', 'types': 'int'},
		{'code': 'to FibonacciList :n\nlocalmake "a 0\nlocalmake "b 1\nlocalmake "result []\nrepeat :n [\nlocalmake "result rput :a :result\nlocalmake "x :a\nlocalmake "a :b\nlocalmake "b :x + :b\nprint "here]\noutput :result\nend', 'types': 'int'},
		{'code': 'make "x mix "#0fff "blue 0.4\nprint "here', 'types': 'alphacolorlist'},
		{'code': 'to p\nlocalmake "x 1\nif true [\n\nlocalmake "x 1 - power :x 2\n]\nforward 5 * ( :x )\nprint "here\nend',
			'types': 'int'},
		{'code': `to p :radius
	localmake "x pos
	localmake "size2 :radius * 0.2

	print "here
	jumpTo :x
	repeat 2 [
		localmake "size2 -:size2
	]
end

		p 100`, 'types': 'list(minlen=3)'},
		// list<num>(minlen=3) would be nice but that's more specific than we can confidently know given the simplified algorithm used.
		{'code': `make "x pos\nprint "here`, 'types': 'list(minlen=3)'},
		{'code': `make "x pos\nqueue "x "hi\nprint "here`, 'types': 'list(minlen=3)'}, 
		// minlen=4 would be better but the static analysis code isn't processing the queue call yet
		// and VariableScope doesn't have a good way to represent that change to the datatype from 
		// first assignment to through that mutation.
		{'code': `make "x pos\nqueue2 "x "hi\nprint "here`, 'types': 'list(minlen=3)'}, // minlen=4 would be better.
	];
	cases.forEach(function(caseInfo, index) {
		const parseLogger = new TestParseLogger(logger, caseInfo.code);
		const tree = LogoParser.getParseTree(caseInfo.code, parseLogger);
		const token = ParseTreeToken.flatten(tree).filter(t => t.val === 'here')[0];
		const plogger = prefixWrapper('Case ' + index + ' with code: ' + caseInfo.code, logger);
		if (!(token instanceof ParseTreeToken))
			plogger('A token with value "here" expected but not found');
		else {
			const types = getPossibleDataTypesForVariableAtToken(token, 'x', new Map(), new Set());
			if (!(types instanceof DataTypes))
				plogger('Expected to get an instance of DataTypes but got ' + types);
			else {
				types.optimize();
				const typeString = types.toString();
				if (typeString !== caseInfo.types) {
					plogger(escapeHTML('Expected ' + caseInfo.types + ' but got ' + typeString));
				}
			}
		}
	});
};