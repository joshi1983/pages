import { getAnimationTimeTokens } from
'../../../set/animation-time/isUsingAnimationTime.js';

export function getAnimationTips(cachedParseTree, parseLogger) {
	const animationTimeTokens = getAnimationTimeTokens(cachedParseTree.root);
	const usingTime = animationTimeTokens.length !== 0;
	const proceduresMap = cachedParseTree.getProceduresMap();
	if (proceduresMap.has('animation.setup')) {
		if (!usingTime) {
			const procsFromTree = cachedParseTree.getProceduresStrictlyFromTree().map(p => p.name);
			// is it defined in the current parse tree?
			// We don't want to give a tip about using animation.time if the code was processed from the commander.
			// It just gets annoying.
			if (procsFromTree.indexOf('animation.setup') !== -1)
				parseLogger.tip('Use the <span class="command">animation.time</span> command.  ' +
					'<span class="command">animation.time</span> outputs the animation time which ' +
					'your code can use to draw differently based on time.  Similar commands like ' +
					'<span class="command">animation.timeRatio</span> and ' +
					'<span class="command">animation.clampedTimeRatio</span> also let you draw ' +
					'differently based on time to make your animation change.', 
					proceduresMap.get('animation.setup').getStartToken(), true);
		}
	}
	else if (usingTime) {
		parseLogger.tip('Add an animation.setup procedure.  In the editor, click <strong>Edit</strong> -&gt; <strong>Set up Animation</strong>.  The <span data-helpid="animation.setup">animation.setup procedure</span> transforms your code from something describing a static drawing into something that animates.', 
			animationTimeTokens[0], true);
	}
};