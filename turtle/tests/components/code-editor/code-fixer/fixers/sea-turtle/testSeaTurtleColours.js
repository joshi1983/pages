import { Colour } from
'../../../../../../modules/Colour.js';
import { SeaTurtleColours } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/sea-turtle/SeaTurtleColours.js';

await Colour.asyncInit();

export function testSeaTurtleColours(logger) {
	const greenInfo = SeaTurtleColours.getColourInfo('green');
	if (typeof greenInfo !== 'object')
		logger(`greenInfo expected to be an object but found ${greenInfo}`);

	for (const colourInfo of SeaTurtleColours.getAll()) {
		const info = Colour.getColourInfoByName(colourInfo.name);
		if (info === undefined)
			logger(`Unable to find a WebLogo colour matching the SeaTurtle colour name ${colourInfo.name}.  Consider translating to a hex colour code alternative.`);
	}
};