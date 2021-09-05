import { isPenSizeAlwaysZeroAtToken } from '../isPenSizeAlwaysZeroAtToken.js';

export function validateArrowCalls(cachedParseTree, parseLogger) {
	const arrowCalls = cachedParseTree.getCommandCallsByName('arrow');
	arrowCalls.forEach(function(arrowCall) {
		if (isPenSizeAlwaysZeroAtToken(arrowCall, cachedParseTree))
			parseLogger.warn(`<span class="command">penSize</span> is always 0 when arrow is called here meaning your arrow will be drawn like a triangle.  Note that the penSize is used by the <span class="command">arrow command</span> to determine width of the rectangular part of the arrow.  Call <span class="command">setPenSize</span> with something other than 0 if you don't want a triangle.  Consider the <span class="command">isoTriangle command</span>, if you want to draw an isosceles triangle instead of an arrow.`, arrowCall, true);
	});
};