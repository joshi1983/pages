import { Block } from
'../../../modules/parsing/sugarlabs-turtle-blocks/Block.js';

export function testBlock(logger) {
	const info = Block.getBlockInfo('penup');
	if (typeof info !== 'object')
		logger(`Expected getBlockInfo to find information object for penup but found ${info}`);
};