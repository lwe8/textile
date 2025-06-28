import * as htmlparser2 from "htmlparser2";
export default function html2ml(html, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  options = options || {};
  const errors = null;
  let jsonMl = null;
  if (typeof html === "string") {
    jsonMl = [];
    let current = jsonMl;
    const currentChildren = null;
    const parents = [];
    const parentsChildren = [];
    const parser = new htmlparser2.Parser(
      {
        onopentag: function (name, attribs) {
          const parent = current;
          parents.push(parent);
          current = [name];
          if (attribs) {
            let found = false;
            for (const attr in attribs) {
              if (attribs.hasOwnProperty(attr)) {
                found = true;
                break;
              }
            }
            if (found || options.requireAttributes) {
              current.push(attribs);
            }
          } else if (options.requireAttributes) {
            current.push({});
          }
          if (options.childrenInArray) {
            if (!currentChildren) {
              currentChildren = [current];
              parent.push(currentChildren);
            } else {
              currentChildren.push(current);
            }
            parentsChildren.push(currentChildren);
            currentChildren = null;
          } else {
            parent.push(current);
          }
        },
        ontext: function (text) {
          if (options.childrenInArray) {
            if (!currentChildren) {
              currentChildren = [text];
              current.push(currentChildren);
            } else {
              currentChildren.push(text);
            }
          } else {
            current.push(text);
          }
        },
        onclosetag: function () {
          current = parents.pop();
          if (options.childrenInArray) {
            currentChildren = parentsChildren.pop();
          }
        },
        onprocessinginstruction: function (_, value) {
          if (!options.noProcessingInstructions)
            current.push([value.slice(0, 1), value.slice(1)]);
        },
        onerror: function (err) {
          if (null !== errors) {
            errors = [errors, err];
          } else {
            errors = err;
          }
        },
      },
      options
    );
    parser.write(html);
    parser.end();

    if (options.childrenInArray) {
      jsonMl = jsonMl[0];
    }

    if (jsonMl.length === 1) {
      jsonMl = jsonMl[0];
    } else if (jsonMl.length > 1) {
      if (options.childrenInArray) {
        jsonMl = [jsonMl];
      }
      if (options.requireAttributes) {
        jsonMl.unshift({});
      }
      jsonMl.unshift("");
    }

    if (html.length && !jsonMl.length) {
      jsonMl = null;
    }
  }
  if (callback) {
    if (null === jsonMl || null !== errors) {
      callback(null === errors ? new Error("Invalid HTML") : errors);
    } else {
      callback(null, jsonMl);
    }
  }
  return jsonMl;
}
