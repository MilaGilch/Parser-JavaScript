This is an extremely complicated and almost completely useless browser sniffing library written in JavaScript. Useless because you shouldn't use browser sniffing. So stop right now and go read something about feature detecting instead. I'm serious. Go away. You'll thank me later.

![Build Status](https://github.com/WhichBrowser/Parser-JavaScript/actions/workflows/main.yml/badge.svg?event=push)
[![npm](https://img.shields.io/npm/l/which-browser.svg)](https://www.npmjs.com/package/which-browser)
[![npm](https://img.shields.io/npm/v/which-browser.svg)](https://www.npmjs.com/package/which-browser)
[![Twitter Follow](https://img.shields.io/twitter/follow/simariot.svg?style=social)](https://twitter.com/simariot)

---

If you are looking for the PHP version of WhichBrowser, please go to the [WhichBrowser/Parser-PHP](https://github.com/WhichBrowser/Parser-PHP) project.

If you are looking for the server written in PHP that provides a Javascript API for the browser, please go to the [WhichBrowser/Server](https://github.com/WhichBrowser/Server) project.

---

**But why _almost completely useless_ and not completely useless?**  
Well, there is always an exception to the rule. There are valid reasons to do browser sniffing: to improve the user experience or to gather intelligence about which browsers are used on your website. The original author website is html5test.com and he wanted to know which score belongs to which browser. And to do that you need a browser sniffing library.

**Why is it extremely complicated?**  
Because everybody lies. Seriously, there is not a single browser that is completely truthful. Almost all browsers say they are Netscape 5 and almost all WebKit browsers say they are based on Gecko. Even Internet Explorer 11 now no longer claims to be IE at all, but instead an unnamed browser that is like Gecko. And it gets worse. That is why it is complicated.

**What kind of information does it give?**
You get a nice object which has information about the browser, rendering engine, os and device. It gives you names and versions and even device manufacturer and model. And WhichBrowser is pretty tenacious. It gives you info that others don't. For example:

    JUC (Linux; U; 2.3.6; zh-cn; GT-I8150; 480*800) UCWEB8.7.4.225/145/800
    UC Browser 8.7 on a Samsung Galaxy W running Android 2.3.6

Android is never mentioned

    Mozilla/5.0 (Series40; Nokia501/10.0.2; Profile/MIDP-2.1 Configuration/CLDC-1.1) Gecko/20100401 S40OviBrowser/3.0.0.0.73
    Nokia Xpress 3.0.0 on a Nokia Asha 501 running Nokia Asha Platform

Despite the useragent header claiming to be a Series40 device, we know it's actually running the Asha Platform and we also know that OviBrowser has been renamed to Nokia Xpress.

    Opera/9.80 (X11; Linux zvav; U; zh) Presto/2.8.119 Version/11.10
    Opera Mini on a Nokia 5230 running Series60 5.0

The useragent header looks like Opera 11.10 on Linux, but we know it's Opera Mini. We can even figure out the real operating system and device model from other headers.

## Requirements

WhichBrowser requires node 6 or higher.

## Dependencies

WhichBrowser has no dependencies, is just plain ES6.

## How to install it

You can install WhichBrowser by NPM and Yarn

    npm install which-browser

or

yarn add which-browser

Do not stick to a specific WhichBrowser version, otherwise you will miss all the sniffing engine updates

## How to use it (short version)

```js
const WhichBrowser = require("which-browser");
const http = require("http");
const port = 3000;

const server = http.createServer((request, response) => {
  const result = new WhichBrowser(request.headers);
  response.end(result.toString());
});

server.listen(port, (err) => {
  if (err) {
    return console.log("Something is broken ¯\\_(ツ)_/¯", err);
  }
  console.log(`Server is listening on port ${port} ✌(-‿-)✌`);
});
```

## How to use it (long version)

The first step require WhichBrowser:

```js
const WhichBrowser = require("which-browser");
```

The second step is to create a new instance of the `WhichBrowser` class. This object will contain all the information the library could find about the browser. The object has a required parameter, either the headers send by the browser, or a useragent string. Using the request headers is preferable, because it will allow a better detection, but if you have just the useragent string, this will also work.

For example:

```js
const result = new WhichBrowser(request.headers);
```

or:

```js
const result = new WhichBrowser(request.headers['user-agent']));
```

The variable `result` now contains an object which you can query for information. There are various ways to access the information.

First of all, you can call to `toString()` function to get a human readable identification:

```js
`You are using ${result.toString()}`;
// You are using Chrome 27 on OS X Mountain Lion 10.8
```

Another possiblity is to query the object:

```js
result.isType("desktop");
// true

result.isType("mobile", "tablet", "media", "gaming:portable");
// false

result.isBrowser("Maxthon", "<", "4.0.5");
// false

result.isOs("iOS", ">=", "8");
// false

result.isOs("OS X");
// true

result.isEngine("Blink");
// true
```

You can also access these properties directly:

```js
result.browser.toString();
// Chrome 27

result.engine.toString();
// Blink

result.os.toString();
// OS X Mountain Lion 10.8
```

Or access parts of these properties directly:

```js
result.browser.name;
// Chrome

`${result.browser.name} ${result.browser.version.toString()}`;
// Chrome 27

result.browser.version.value;
// 27.0.1453.110

result.engine.name;
// Blink
```

Finally you can also query versions directly:

```js
result.browser.version.is(">", 26);
// true

result.os.version.is("<", "10.7.4");
// false
```

## Options

It is possible to set additional options by passing an object as the second parameter when creating the `WhichBrowser` object.

### Disabling detection of bots

In some cases you may want to disable the detection of bots. This allows the bot the deliberately fool WhichBrowser, so you can pick up the identity of useragent what the bot tries to mimic. This is especially handy when you want to use WhichBrowser to switch between different variants of your website and want to make sure crawlers see the right variant of the website. For example, a bot that mimics a mobile device will see the mobile variant of you site.

```js
result = new WhichBrowser(request.headers, { detectBots: false });
```

## Enable result caching

WhichBrowser can cache results between requests. Using a cache is especially useful if you use WhichBrowser on every page of your website and a user visits multiple pages. During the first visit the headers will be parsed and the result will be cached. Upon further visits, the cached results will be used, which is much faster than having to parse the headers again and again.

In order to enable caching you need to specify in the options object which type of cache you want use.

For example, if you want to enable the cache you need to construct the `WhichBrowser` object in this way:

```js
const result = new WhichBrowser(request.header, {
  cache: WhichBrowser.SIMPLE_CACHE,
});
```

If a result is retrieved from the cache it has the `cached` property set to `true`

```js
if (result.cached) {
  // from cache
} else {
  // just parsed for the first time
}
```

You can also specify after how many seconds a cached result should be discarded. The default value is 900 seconds or 15 minutes. If you think WhichBrowser uses too much memory for caching, you should lower this value. You can do this by setting the `cacheExpires` property in the options object.

For example, if you want that your cached results lasts for 300 seconds or 5 minutes do:

```js
const result = new WhichBrowser(request.header, {
  cache: WhichBrowser.SIMPLE_CACHE,
  cacheExpires: 300,
});
```

A value for `cacheExpires` less or equal to `0` disable the expiry for that result and it will last until you restart node or you parse the same set of headers with a `cacheExpires` greater than `0`.

Cache validity is checked at a rate of `cacheExpires / 5` so, with a `cacheExpires` of `500`, you can rest assured that your result has been reaped from the cache after `500 + 500 / 5 + 1` seconds.

If you want to speed up the process of validity check you can set the `cacheCheckInterval` property in the options object. This property can't be smaller than `1`.

```js
const result = new WhichBrowser(request.header, {
  cache: WhichBrowser.SIMPLE_CACHE,
  cacheExpires: 300,
  cacheCheckInterval: 1,
});
```

In this way the cache lasts for `300` seconds but is checked every `1` second.

> Be aware that changing `cacheExpiries` or `cacheCheckInterval` impact the cache validity check rate for **ALL** records in the cache. For example setting `cacheExpiries` to `0` will prevent **ALL** results to expire because it will disable the cache validity check (for the sake of truth it will be done every `57085` years, `5` months, `10` days, `7` hours, `35` minutes and `48` seconds).

## API reference

### The WhichBrowser object

After a new `WhichBrowser` object is created, it contains a number of properties and functions. All of these properties are guaranteed to be present.

**Properties:**

- `browser`  
  an object that contains information about the browser itself
- `engine`  
  an object that contains information about the rendering engine
- `os`  
  an object that contains information about the operating system
- `device`  
  an object that contains information about the device

**Functions:**

`getType()`  
Returns the `type` and `subtype` property of the `device` object. If a subtype is present it is concatenated to the type and seperated by a semicolor, for example: `mobile:smart` or `gaming:portable`. If the subtype is not applicable, it just return the type, for example: `desktop` or `ereader`.

`isType(type [,type [,type [,type]]])`  
If a single argument is used, the function returns `true` if the argument matches the `type` propery of `device` object. The argument can optionally also provide a subtype by concatenating it to the type and seperating it with a semicolon. It can use multiple arguments in which case the function returns `true` if one of the arguments matches. If none of the arguments matches, it returns `false`

`isMobile()`  
Return `true` if the browser is a mobile device, like a phone, tablet, ereader, camera, portable media player, watch or portable gaming console. Otherwise it returns `false`.

`isBrowser($name [, comparison, version])`  
Is used to query the `name` and `version` property of the `browser` object. The funcion can contain a single argument to a simple comparison based on `name`, or three arguments to compare both `name` and `version`. The first argument always contains the name of the browser. The second arguments is a string that can container either `<`, `<=`, `=`, `=>` or `>`. The third is an integer, float or string that contains the version. You can use versions like `10`, `10.7` or `'10.7.4'`. For more information about how version comparisons are performed, please see the `is()` function of the `Version` object.

`isEngine(name [, comparison, version])`  
Is used to query the `name` and `version` property of the `engine` object. This function works in exactly the same way as `isBrowser`.

`isOs(name [, comparison, version])`  
Is used to query the `name` and `version` property of the `os` object. This function works in exactly the same way as `isBrowser`.

`isDetected()`  
Is there actually some browser detected, or did we fail to detect anything?

`toString()`  
Get a human readable representation of the detected browser, including operating system and device information.

### The Browser object

An object of the `Browser` class is used for the `browser` property of the main `WhichBrowser` object and contains a number of properties. If a property is not applicable in this situation it will be null or undefined.

**Properties:**

- `name`  
  a string containing the name of the browser
- `alias`  
  a string containing an alternative name of the browser
- `version`  
  a version object containing information about the version of the browser
- `stock`  
  a boolean, true if the browser is the default browser of the operating system, false otherwise
- `channel`  
  a string containing the distribution channel, ie. 'Nightly' or 'Next'.
- `mode`  
  a string that can contain the operating mode of the browser, ie. 'proxy'.
- `hidden`  
  a boolean that is true if the browser does not have a name and is the default of the operating system.
- `family`  
  an object that contains information about to which family this browser belongs
- `using`  
  an object that contains information about to which kind of webview this browser uses

**Functions:**

`isFamily(name)`  
Does the family of this browser have this name, or does the browser itself have this name.

`isUsing(name)`  
Is the browser using a webview using with the provided name.

`getName()`  
Get the name of the browser

`getVersion()`  
Get the version of the browser

`toString()`  
Get a human readable representation of the detected browser

### The Engine object

An object of the `Engine` class is used for the `engine` property of the main `WhichBrowser` object and contains a number of properties. If a property is not applicable in this situation it will be null or undefined.

**Properties:**

- `name`  
  a string containing the name of the rendering engine
- `version`  
  a version object containing information about the version of the rendering engine

**Functions:**

`getName()`  
Get the name of the rendering engine

`getVersion()`  
Get the version of the rendering engine

`toString()`  
Get a human readable representation of the detected rendering engine

### The Os object

An object of the `Os` class is used for the `os` property of the main `WhichBrowser` object and contains a number of properties. If a property is not applicable in this situation it will be null or undefined.

**Properties:**

- `name`  
  a string containing the name of the operating system
- `version`  
  a version object containing information about the version of the operating system
- `family`  
  an object that contains information about to which family this operating system belongs

**Functions:**

`isFamily(name)`  
Does the family of this operating system have this name, or does the operating system itself have this name.

`getName()`  
Get the name of the operating system

`getVersion()`  
Get the version of the operating system

`toString()`  
Get a human readable representation of the detected operating system

### The Device object

An object of the `Device` class is used for the `device` property of the main `Parser` object and contains a number of properties. If a property is not applicable in this situation it will be null or undefined.

**Properties:**

- `type`  
  a string containing the type of the browser.
- `subtype`  
  a string containing the subtype of the browser.
- `identified`  
  a boolean that is true if the device has been positively identified.
- `manufacturer`  
  a string containing the manufacturer of the device, ie. 'Apple' or 'Samsung'.
- `model`  
  as string containing the model of the device, ie. 'iPhone' or 'Galaxy S4'.

The `type` property can contain any value from the following list:

- desktop
- mobile
- pda
- dect
- tablet
- gaming
- ereader
- media
- headset
- watch
- emulator
- television
- monitor
- camera
- printer
- signage
- whiteboard
- devboard
- inflight
- appliance
- gps
- car
- pos
- bot
- projector

If the `type` is "mobile", the `subtype` property can contain any value from the following list:

- feature
- smart

If the `type` is "gaming", the `subtype` property can contain any value from the following list:

- console
- portable

**Functions:**

`getManufacturer()`  
Get the name of the manufacturer

`getModel()`  
Get the name of the model

`toString()`  
Get a human readable representation of the detected device

### The Family object

An object of the `Family` class is used for the `family` property of the `Browser` and `Os` object and contains a number of properties. If a property is not applicable in this situation it will be null or undefined.

**Properties:**

- `name`  
  a string containing the name of the family
- `version`  
  a version object containing information about the version of the family

**Functions:**

`getName()`  
Get the name of the family

`getVersion()`  
Get the version of the family

`toString()`  
Get a human readable representation of the family

### The Using object

An object of the `Using` class is used for the `using` property of the `Browser` object and contains a number of properties. If a property is not applicable in this situation it will be null or undefined.

**Properties:**

- `name`  
  a string containing the name of the webview
- `version`  
  a version object containing information about the version of the webview

**Functions:**

`getName()`  
Get the name of the webview

`getVersion()`  
Get the version of the webview

`toString()`  
Get a human readable representation of the webview

### The Version object

An object of the `Version` class is used for the `version` property of the `Browser`, `Engine` and `Os` object and contains a number of properties and functions. If a property is not applicable in this situation it will be null or undefined.

**Properties:**

- `value`  
  a string containing the original version number.
- `alias`  
  a string containing an alias for the version number, ie. 'XP' for Windows '5.1'.
- `nickname`  
  a string containing a nickname for the version number, ie. 'Mojave' for OS X '10.14'.
- `details`  
  an integer containing the number of digits of the version number that should be printed.

**Functions:**

`is(version)` or `is(comparison, version)`  
Using this function it is easy to compare a version to another version. If you specify only one argument, this function will return if the versions are the same. You can also specify two arguments, in that case the first argument contains the comparison operator, such as `<`, `<=`, `=`, `=>` or `>`. The second argument is the version you want to compare it to. You can use versions like `10`, `10.7` or `'10.7.4'`, but be aware that `10` is not the same as `10.0`. For example if our OS version is `10.7.4`:

```js
result.os.version.is("10.7.4");
// true

result.os.version.is("10.7");
// true

result.os.version.is("10");
// true

result.os.version.is("10.0");
// false

result.os.version.is(">", "10");
// false

result.os.version.is(">", "10.7");
// false

result.os.version.is(">", "10.7.3");
// true
```
