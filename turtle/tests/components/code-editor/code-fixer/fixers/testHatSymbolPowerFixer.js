import { hatSymbolPowerFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/hatSymbolPowerFixer.js';
import { processTestCases } from './processTestCases.js';

export function testHatSymbolPowerFixer(logger) {
	const cases = [
		{'code': 'print "^', 'logged': false},
		{'code': 'print ^', 'logged': false},
		{'code': 'print 2 ^', 'logged': false},
		{'code': 'print ^ 3', 'logged': false},
		{'code': 'print 2 ^ 3', 'to': 'print  power 2 3', 'logged': true},
		{'code': 'print 1 + 2 ^ 3', 'to': 'print 1 +  power 2 3', 'logged': true},
		{'code': 'print 1 + 2 ^ 3 + 4', 'to': 'print 1 +  (power  2 3)+ 4', 'logged': true},
		{'code': 'print 1 + 2 ^ 3 ^ 4', 'to': 'print 1 +  power   power 2 3 4', 'logged': true},
		{'code': 'print (1 + :x) ^ :y', 'to': 'print power  (1 + :x):y', 'logged': true},
		// it would be nicer to have a space immediately before the :y but this won't cause an error so that's good enough for now.
		// formatCode would fix it completely.
		
		{'code': 'print :x ^ :y', 'to': 'print  power :x :y', 'logged': true},
		{'code': 'print :x^:y', 'to': 'print power :x :y', 'logged': true},
		{'code': 'print :x^sum 1 2', 'to': 'print power :x sum 1 2', 'logged': true},
		{'code': 'print 1+2^sum 1 2', 'to': 'print 1+ power 2 sum 1 2', 'logged': true},
		{'code': 'print 1*2^sum 1 2', 'to': 'print 1*power 2 sum 1 2', 'logged': true},
	];
	processTestCases(cases, hatSymbolPowerFixer, logger);
};