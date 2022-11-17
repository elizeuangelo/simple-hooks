/**
 * A simple hook component for creating and calling hooks
 */

type Callback = (...args: unknown[]) => boolean | void;

let _hooks: { [key: string]: Callback[] } = {};
let _id = 0;
let _ids: { [key: number]: Callback } = {};
let _once: Callback[] = [];

/**
 * Register a callback handler for an event.
 * @param hook Hook name
 * @param fn Function to be called
 * @returns Id number of the function
 */
export function on(hook: string, fn: Callback) {
	console.log(`Hooks | Registered callback for ${hook} hook`);
	const id = _id++;
	_hooks[hook] = _hooks[hook] || [];
	_hooks[hook].push(fn);
	_ids[id] = fn;
	return id;
}

/**
 * Register a callback handler for an event which is only triggered once the first time the event occurs.
 * After a "once" hook is triggered the hook is automatically removed.
 * @param hook Hook name
 * @param fn Function to be called
 */
export function once(hook: string, fn: Callback) {
	_once.push(fn);
	return on(hook, fn);
}

/**
 * Unregister a callback handler for a particular hook event.
 * @param hook Hook name
 * @param fn Function to be called OR its Id
 */
export function off(hook: string, fn: Callback | number) {
	if (typeof fn === 'number') {
		const id = fn;
		fn = _ids[fn];
		delete _ids[id];
	}
	if (!(hook in _hooks)) return;
	const fns = _hooks[hook];
	const idx = fns.indexOf(fn);
	if (idx !== -1) fns.splice(idx, 1);
	console.log(`Hooks | Unregistered callback for ${hook} hook`);
}

/**
 * Call all hook listeners in the order in which they were registered
 * Hooks called this way can not be handled by returning false and will always trigger every hook callback.
 */
export function callAll(hook: string, ...args: unknown[]) {
	if (!(hook in _hooks)) return;
	const fns = _hooks[hook];
	for (const fn of fns) _call(hook, fn, args);

	return true;
}

/**
 * Call hook listeners in the order in which they were registered.
 * Continue calling hooks until either all have been called or one returns `false`.
 *
 * Hook listeners which return `false` denote that the original event has been adequately handled and no further
 * hooks should be called.
 */
export function call(hook: string, ...args: unknown[]) {
	if (!(hook in _hooks)) return;
	const fns = _hooks[hook];
	for (let i = 0; i < fns.length; i++) {
		const fn = fns[i];
		const callAdditional = _call(hook, fn, args);
		if (callAdditional === false) return false;
	}
	return true;
}

/**
 * Call a hooked function using provided arguments and perhaps unregister it.
 * @private
 */
function _call(hook: string, fn: Callback, args: unknown[] = []) {
	if (_once.includes(fn)) off(hook, fn);
	try {
		return fn(...args);
	} catch (err) {
		console.warn(`Hooks | Error thrown in hooked function ${fn.name}`);
		console.error(err);
	}
}

/**
 * Reset and remove all Hooks
 */
export function reset() {
	_hooks = {};
	_once = [];
	_ids = {};
}
