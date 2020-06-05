import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RenderPluginDoc } from '@ansible/galaxy-doc-builder';

// I followed this guide to add react components to vs code:
// https://medium.com/younited-tech-blog/reactception-extending-vs-code-extension-with-webviews-and-react-12be2a5898fd

ReactDOM.render(
  <RenderPluginDoc
    renderModuleLink={s => <span>{s}</span>}
    renderDocLink={(s, s1) => <span>{s}</span>}
    renderTableOfContentsLink={(title, section) => <div>{title}</div>}
    plugin={(window as any).initialData as any}
    renderWarning={text => <div>{text}</div>}
  />,
  document.getElementById('root')
);
