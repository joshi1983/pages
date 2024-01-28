export function getAnimationTips(cachedParseTree, parseLogger) {
	const animationTimeTokens = cachedParseTree.getCommandCallsByName('animation.time');
	const proceduresMap = cachedParseTree.getProceduresMap();
	if (proceduresMap.has('animation.setup')) {
		if (animationTimeTokens.length === 0) {
			const procsFromTree = cachedParseTree.getProceduresStrictlyFromTree().map(p => p.name);
			// is it defined in the current parse tree?
			// We don't want to give a tip about using animation.time if the code was processed from the commander.
			// It just gets annoying.
			if (procsFromTree.indexOf('animation.setup') !== -1)
				parseLogger.tip('Use the <span class="command">animation.time</span> command.  <span class="command">animation.time</span> outputs the animation time which your code can use to draw differently based on time.', 
					proceduresMap.get('animation.setup').getStartToken(), true);
		}
	}
	else if (animationTimeTokens.length !== 0) {
		parseLogger.tip('Add an animation.setup procedure.  In the editor, click <strong>Edit</strong> -&gt; <strong>Set up Animation</strong>.  The <span data-helpid="animation.setup">animation.setup procedure</span> transforms your code from something describing a static drawing into something that animates.', animationTimeTokens[0], true);
	}
};