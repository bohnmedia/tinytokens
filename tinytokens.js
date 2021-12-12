function TinyTokens() {
  this.callbacks = {};

  this.replaceTokens = function (inputText, name, callback) {
    var match,
      text = inputText,
      rgxpStr = "{{(" + name + "(?:::(?:(?!}}).)*)?)}}";

    // Callbacks with two parameters are for containers
    const container = callback.length === 2;

    // Modify single token regular expression for containers
    if (container) {
      rgxpStr +=
        "((?:(?!{{" + name + "(?:::(?:(?!}}).)*)?}}).)*?){{/" + name + "}}";
    }

    const rgxp = new RegExp(rgxpStr, "s");

    while ((match = text.match(rgxp))) {
      let arguments = match[1].split("::");
      let replacement = container
        ? callback(arguments, match[2])
        : callback(arguments);

      // Add control characters to avoid an infinitive loop
      replacement = replacement.replace(/{/g, String.fromCharCode(0) + '{');

      text =
        match.input.substr(0, match.index) +
        replacement +
        match.input.substr(match.index + match[0].length);
    }

    // Return without control characters
    return text.replace(new RegExp(String.fromCharCode(0), 'g'), '');
  };

  this.addToken = function (name, callback) {
    this.callbacks[name] = callback;
  };

  this.replace = function (inputText) {
    var text = inputText;

    for (var name in this.callbacks) {
      text = this.replaceTokens(text, name, this.callbacks[name]);
    }

    return text;
  };
}
