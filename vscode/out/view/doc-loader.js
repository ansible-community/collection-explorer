"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocLoader = void 0;
const lib_1 = require("../lib");
const path = require("path");
const vscode = require("vscode");
class DocLoader {
    static loadDoc(collectionID, contentIdentifiers, context, collectionLoader) {
        const importResult = collectionLoader.getCollection(collectionID);
        const content = lib_1.CollectionLoader.getContent(importResult, contentIdentifiers.name, contentIdentifiers.type);
        const panel = vscode.window.createWebviewPanel(collectionID, contentIdentifiers.display, vscode.ViewColumn.Active, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(context.extensionPath, 'plugin-render-dist'))
            ]
        });
        if (content.type === 'html') {
            panel.webview.html = getHTMLWebview(content.data);
        }
        else {
            const reactAppPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'plugin-render-dist', 'pluginRender.js'));
            const reactAppUri = panel.webview.asWebviewUri(reactAppPathOnDisk);
            panel.webview.html = getAnsiblePluginWebview(reactAppUri, content.data);
        }
    }
}
exports.DocLoader = DocLoader;
function getHTMLWebview(html) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    ${html}
</body>
</html>`;
}
function getAnsiblePluginWebview(reactAppUri, data) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Security-Policy"
            content="default-src 'none';
                     img-src https:;
                     script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                     style-src vscode-resource: 'unsafe-inline';">


    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script>
      window.initialData = ${JSON.stringify(data)};
    </script>
</head>
<body>
<div id="root"></div>

<script src="${reactAppUri}"></script>
</body>
</html>`;
}
//# sourceMappingURL=doc-loader.js.map