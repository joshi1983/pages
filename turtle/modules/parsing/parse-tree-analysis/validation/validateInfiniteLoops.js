import { validateDoWhileLoops } from './infinite-loops/validateDoWhileLoops.js';
import { validateForeverLoops } from './infinite-loops/validateForeverLoops.js';
import { validateForInfiniteRecursion } from './infinite-loops/validateForInfiniteRecursion.js';
import { validateInfiniteForLoops } from './infinite-loops/validateInfiniteForLoops.js';
import { validateInfiniteWhileLoops } from './infinite-loops/validateInfiniteWhileLoops.js';
import { validateUntilLoops } from './infinite-loops/validateUntilLoops.js';

/*
Developers may actually want an infinite loop in Logo but it would be very rare.

They might want to just trace how the loop behaves and see why it is infinite.

This is so extremely rare and most-likely a mistake, though.  
Therefore, they should be warned.

There are many ways to have an infinite loop that aren't detected here but 
warning about a few obvious cases still seems helpful.
*/

export function validateInfiniteLoops(cachedParseTree, parseLogger) {
	validateDoWhileLoops(cachedParseTree, parseLogger);
	validateForeverLoops(cachedParseTree, parseLogger);
	validateForInfiniteRecursion(cachedParseTree, parseLogger);
	validateInfiniteForLoops(cachedParseTree, parseLogger);
	validateUntilLoops(cachedParseTree, parseLogger);
	validateInfiniteWhileLoops(cachedParseTree, parseLogger);
};