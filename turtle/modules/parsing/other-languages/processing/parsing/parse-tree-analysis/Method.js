export class Method {
	constructor(methodToken) {
		this.name = methodToken.children[1].val;
		this.methodToken = methodToken;
	}
};