"use strict";
// import * as React from 'react';
// import * as ReactDOMServer from 'react-dom/server';
// import { PluginViewType } from './types';
// import { RenderPluginDoc } from '@ansible/galaxy-doc-builder';
//
// import * as JSDOM from 'jsdom';
//
// class TestComp extends React.Component<{ data: any }, { counter: number }> {
//   constructor(props) {
//     super(props);
//     this.state = { counter: props.data };
//   }
//   render() {
//     return (
//       <div>
//         <a onClick={() => this.setState({ counter: this.state.counter + 1 })}>update</a>{' '}
//         {this.state.counter}
//       </div>
//     );
//   }
// }
//
// var document = new JSDOM(``);
// var window = new Object();
//
// export function getPluginHTML(data: PluginViewType) {
//   console.log('rendery mcrenderson');
//   console.log(data);
//
//   // return ReactDOMServer.renderToString(<TestComp data={1} />);
//   return ReactDOMServer.renderToString(
//     <RenderPluginDoc
//       renderModuleLink={s => <span>{s}</span>}
//       renderDocLink={(s, s1) => <span>{s}</span>}
//       renderTableOfContentsLink={(title, section) => <div>{title}</div>}
//       plugin={data as any}
//       renderWarning={text => <div>{text}</div>}
//     />
//   );
// }
//# sourceMappingURL=doc-renderer.js.map