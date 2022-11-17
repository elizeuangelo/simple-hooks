<h1 align="center">Simple Hooks</h1>
<p align="center"><i>Simple component for creating and calling hooks in Deno</i></p>
<p align="center">
    <a href="https://github.com/elizeuangelo/simple-hooks/releases">
        <img src="https://img.shields.io/github/release/elizeuangelo/simple-hooks.svg?color=bright_green&label=latest&style=flat-square">
    </a>
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square">
    </a>
</p>

## 📦 Importing

Import the module by using

```
import * as Hooks from "https://deno.land/x/simple-hooks/mod.ts";
```

## 📖 Usage

#### Registering Callbacks

You can use `on` to register a persistent callback:
`Hooks.on("hook-name", CallbackFunction)`

Or `once` to register a single use:
`Hooks.once("hook-name", CallbackFunction)`

#### Removing Callbacks

You can remove a specific callback using the `off` method:
`Hooks.off("hook-name", CallbackFunction)`

Or remove all callbacks using `reset`:
`Hooks.reset()`

#### Calling Hooks

Once you have a callbacks registered, you can call them using a normal `call` method:
`Hooks.call("hook-name", ...args)`

This will call every callback in the order they were registered, if any callbacks returns `false`, it stops calling the remaining.
If you don't want this behavior, you can force all callbacks to be called by using the `callAll` method.
`Hooks.callAll("hook-name", ...args)`

### 📚 Example:

```
import * as Hooks from "https://deno.land/x/simple-hooks/mod.ts";

function callBack1(arg1) {
    console.log("callback1: " + arg1);
}

function callBack2() {
    console.log("callback2");
}

Hooks.on("test", callBack1);    // Will be called everytime the hook is called
Hooks.once("test", callBack2);  // Will only be called once

Hooks.call("test", "first argument"); // callBack1 and 2 will be called
Hooks.call("test", "first argument"); // Only callBack1 will be called

// You can call the hook anywhere you want inside a project, passing by any arguments you desire

Hooks.on("pre-test"), () => console.log("pre-test");
Hooks.on("after-test"), () => console.log("after-test");
function test() {
    Hooks.call("pre-test");
    // Beginning of function workflow
    const a = true;
    // End of function workflow
    Hooks.call("after-test", a);
}

test();
```

## 📃 License

This package is licensed using the MIT License.

Please have a look at [`LICENSE.md`](LICENSE.md).
