# TinyTokens.js
TinyTokens is a simple token system in javascript. You can define single tokens like ``{{smiley}}`` or token containers like ``{{strong}}text{{/strong}}``.

Furthermore you can set parameters in single tokens like ``{{emoticon::SMILING FACE WITH SMILING EYES}}`` and token containers like ``{{color::red}}text{{/color}}``.

Nesting of token containers is possible too.

## How to use
Just include the [tinytokens.js](tinytokens.js) or [tinytokens.min.js](tinytokens.min.js) before your code. And initialize the TinyTokens class.

```html
<script src="tinytokens.min.js"></script>
<script>
  const tt = new TinyTokens();
  // Let's go!
</script>
```

## How to define a token
You can define a token with the function "addToken".

```js
// A text with the token {{smiley}}
var inputText = "Have a nice day. {{smiley}}";

// Definition of the {{smiley}} token
tt.addToken("smiley", function(arg) {
  return "&#x1F60A;";
});

// Use the function "replace" to replace all defined tokens
var outputText = tt.replace(inputText);
```

Output:
```html
Have a nice day. 😊
```

## Working with arguments
You can set additional arguments inside a token. For example to define several emoticons. The first parameter in the token callback function contains an array of all arguments including the name of the token.

```js
var inputText = "Have a nice day. {{emoticon::FACE WITH TEARS OF JOY}}";

tt.addToken('emoticon', function(arg) {
  var tokenName = arg[0]; // "emoticon"
  var emoticon = arg[1];

  switch(emoticon) {
    case 'GRINNING FACE':                   return '&#x1F600;';
    case 'GRINNING FACE WITH SMILING EYES': return '&#x1F601;';
    case 'FACE WITH TEARS OF JOY':          return '&#x1F602;';
    default:                                return '';
  }
});
```

Output:
```html
Have a nice day. 😂
```

## Working with containers
You can use token containers to modify textblocks. When you define a callback function with two parameters instead of one the token is automatically handled as a token container.

```js
var inputText = "Have a nice {{strong}}day{{/strong}}.";

// Define a second parameter in the callback function to handle the token as a container.
tt.addToken('strong', function(arg, content) {
  return '<strong>' + content + '</strong>';
});
```

Output:
```html
Have a nice <strong>day</strong>.
```

### Containers with arguments

You can also combine containers with additional arguments.

```js
var inputText = "Have a nice {{color::blue}}day{{/color}}.";

tt.addToken('color', function(arg, content) {
  var color = arg[1];

  return '<span style="color:' + color + '>' + content + '<span>';
});
```

Output:
```html
Have a nice <span style="color:blue">day</span>.
```

## More examples

### Visibility token
```js
var inputText = "Have a nice {{visible::false}}day{{/visible}}.";

tt.addToken('visible', function(arg, content) {
  var visible = (arg[1] !== 'false' && arg[1] !== '');

  return visible ? content : '';
});
```

### If/Else
```js
var inputTextIf = "{{if::1::EQ::1}}Its true{{/if}}";
var inputTextIfElse = "{{if::1::EQ::1}}Its true{{else}}its not true{{/if}}";

tt.addToken('if', function(arg, content) {
  var a = arg[1];
  var b = arg[3];
  var operator = arg[2];
  var splitContent = content.split('{{else}}');
  var result;
				
  switch(operator) {
    case "EQ": result = a === b; break;
    case "NE": result = a !== b; break;
    case "GT": result = a > b; break;
    case "LT": result = a < b; break;
    default: result = false; break;
  }

  return result ? splitContent[0] : (splitContent[1] || '');
});
```

### Variables
```js
var inputTextIf = "{{vars::a::Hello::b::world!}}Hello World! = {{a}} {{b}}{{/vars}}";

tt.addToken('vars', function(arg, content) {
  var modifiedContent = content;

  for (let i=1; i<arg.length; i += 2) {
    modifiedContent = modifiedContent.replace(new RegExp("{{" + arg[i] + "}}", "g"), arg[i+1]);
  }

  return modifiedContent;
});
```

### Image
```js
var inputText = "{{image::https://www.stevensegallery.com/320/240}}";

tt.addToken('image', function(arg) {
  var path = arg[1];
  return '<img src="' + path + '">';
});
```
