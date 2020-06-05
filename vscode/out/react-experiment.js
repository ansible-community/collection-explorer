"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComponent = exports.TestComponent = void 0;
const React = require("react");
const ReactDOMServer = require("react-dom/server");
class TestComponent extends React.Component {
    render() {
        console.log('rendery mcrenderson');
        return React.createElement("h1", null, "test");
    }
}
exports.TestComponent = TestComponent;
function getComponent() {
    console.log('rendery mcrenderson');
    return ReactDOMServer.renderToStaticMarkup(React.createElement(TestComponent, null));
}
exports.getComponent = getComponent;
//# sourceMappingURL=react-experiment.js.map