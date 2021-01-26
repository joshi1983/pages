var v = [0, 0, 0];

var info = ArbitraryAxisRotation.getRotateArbitraryAxisMatrices(1, 0, 0, 0);
console.log('info is: ' + JSON.stringify(info));
var rotatedPoint = ArbitraryAxisRotation.rotateArbitraryUsingInfo(info, v);
console.log('rotatedPoint should be [0,0,0] and is: ' + JSON.stringify(rotatedPoint));
console.log('');
if (!(rotatedPoint instanceof Array)) {
	console.error('rotatedPoint is not an Array.');
}
else {
	console.log('rotatedPoint is an Array.');
}

v = [1, 2, 3];
rotatedPoint = ArbitraryAxisRotation.rotateArbitraryUsingInfo(info, v);
console.log('rotatedPoint should be [1,2,3] and is: ' + JSON.stringify(rotatedPoint));

console.log('');
info = ArbitraryAxisRotation.getRotateArbitraryAxisMatrices(1, 0.5, 0.3, 0);
console.log('with radians of 0, info is: ' + JSON.stringify(info));

console.log('');
info = ArbitraryAxisRotation.getRotateArbitraryAxisMatrices(1, 0.5, 0.3, 0.5);
console.log('with radians of 0.5, info is: ' + JSON.stringify(info));
rotatedPoint = ArbitraryAxisRotation.rotateArbitraryUsingInfo(info, v);
console.log('with radians of 0.5, rotatedPoint is: ' + JSON.stringify(rotatedPoint));
