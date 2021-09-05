const renameWrap = (name, fn) => Object.defineProperty(function() { fn(...arguments)}, 'name', { value: name });

export { renameWrap };