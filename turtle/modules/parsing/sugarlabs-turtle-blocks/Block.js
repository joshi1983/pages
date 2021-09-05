import { fetchJson } from '../../fetchJson.js';

const allData = await fetchJson('./json/logo-migrations/SugarLabsTurtleBlocks.json');
const blocks = new Map();
allData.commands.forEach(function(info) {
	blocks.set(info.primaryName, info);
	if (info.names !== undefined) {
		for (const name of info.names)
			blocks.set(name, info);
	}
});

export class Block {
	static getBlockInfo(name) {
		return blocks.get(name);
	}
};