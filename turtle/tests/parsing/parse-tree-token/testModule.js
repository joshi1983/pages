import { getCachedParseTreeFromCode } from
'../../helpers/getCachedParseTreeFromCode.js';
import { Module } from
'../../../modules/parsing/parse-tree-token/Module.js';

export function testModule(logger) {
	const newModule = new Module('test');
	if (newModule.name !== 'test')
		logger(`Expected name to be test but found ${newModule.test}`);
	
	const code = `to p
	output 4
end

print p
print map "sin [0 90 -90]`;
	const tree = getCachedParseTreeFromCode(code, logger).root;
	newModule.assignToParseTree(tree);
	if (!(tree.module instanceof Module))
		logger(`Expected module to be internal but found ${tree.module}`);
};