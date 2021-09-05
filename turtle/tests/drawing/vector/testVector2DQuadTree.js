import { Vector2D } from '../../../modules/drawing/vector/Vector2D.js';
import { Vector2DQuadTree } from '../../../modules/drawing/vector/Vector2DQuadTree.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testEmptyQuadTree(logger) {
	const tree = new Vector2DQuadTree();
	if (tree.vectors.length !== 0)
		logger(`vectors.length expected to be 0 but got ${tree.vectors.length}`);
	if (tree.subtrees.length !== 0)
		logger(`subtrees.length expected to be 0 but got ${tree.subtrees.length}`);
	const result = tree.getVectorsWithinCircle(new Vector2D(0, 0), 10);
	if (!(result instanceof Array))
		logger('Expected an Array but got: ' + result);
	else if (result.length !== 0)
		logger(`Expected 0 vectors but got ${result.length}`);
}

function testLeafQuadTree(logger) {
	const tree = new Vector2DQuadTree([new Vector2D(0, 0), new Vector2D(1, 2), new Vector2D(0, 1), new Vector2D(-1, 1)]);
	if (tree.vectors.length !== 4)
		logger(`vectors.length expected to be 4 but got ${tree.vectors.length}`);
	if (tree.subtrees.length !== 0)
		logger(`subtrees.length expected to be 0 but got ${tree.subtrees.length}`);
	const result1 = tree.getVectorsWithinCircle(new Vector2D(0, 0), 10);
	if (!(result1 instanceof Array))
		logger('Expected an Array but got: ' + result1);
	else if (result1.length !== 4)
		logger(`Expected 4 vectors but got ${result1.length}`);
	const result2 = tree.getVectorsWithinCircle(new Vector2D(0, 0), 0.5);
	if (!(result2 instanceof Array))
		logger('Expected an Array but got: ' + result2);
	else if (result2.length !== 1)
		logger(`Expected 1 vector but got ${result2.length}`);
	else if (result2[0].getX() !== 0 || result2[0].getY() !== 0)
		logger(`Expected (0, 0) but got ${result2[0]}`);
}

export function testVector2DQuadTree(logger) {
	wrapAndCall([
		testEmptyQuadTree,
		testLeafQuadTree
	], logger);
};