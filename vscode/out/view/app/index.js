"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const galaxy_doc_builder_1 = require("@ansible/galaxy-doc-builder");
// I followed this guide to add react components to vs code:
// https://medium.com/younited-tech-blog/reactception-extending-vs-code-extension-with-webviews-and-react-12be2a5898fd
ReactDOM.render(React.createElement(galaxy_doc_builder_1.RenderPluginDoc, { renderModuleLink: s => React.createElement("span", null, s), renderDocLink: (s, s1) => React.createElement("span", null, s), renderTableOfContentsLink: (title, section) => React.createElement("div", null, title), plugin: window.initialData, renderWarning: text => React.createElement("div", null, text) }), document.getElementById('root'));
//# sourceMappingURL=index.js.map