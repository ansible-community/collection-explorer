import { CollectionLoader } from '../lib';
import * as path from 'path';
import { DocsEntryType } from '../types';
import * as vscode from 'vscode';

export class DocLoader {
  static loadDoc(
    collectionID: string,
    contentIdentifiers: DocsEntryType,
    context: vscode.ExtensionContext,
    collectionLoader: CollectionLoader
  ) {
    const importResult = collectionLoader.getCollection(collectionID);
    const content = CollectionLoader.getContent(
      importResult,
      contentIdentifiers.name,
      contentIdentifiers.type
    );

    const panel = vscode.window.createWebviewPanel(
      collectionID,
      contentIdentifiers.display,
      vscode.ViewColumn.Active,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'plugin-render-dist'))
        ]
      }
    );

    if (content.type === 'html') {
      panel.webview.html = getHTMLWebview(content.data);
    } else {
      const reactAppPathOnDisk = vscode.Uri.file(
        path.join(context.extensionPath, 'plugin-render-dist', 'pluginRender.js')
      );
      const reactAppUri = panel.webview.asWebviewUri(reactAppPathOnDisk);

      panel.webview.html = getAnsiblePluginWebview(reactAppUri, content.data);
    }
  }
}

function getHTMLWebview(html: string) {
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

function getAnsiblePluginWebview(reactAppUri: any, data: any) {
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
