import * as React from 'react';
import * as ReactDOM from 'react-dom';

import '@patternfly/patternfly/patternfly.css';
import { CollectionLoader } from './containers/collection-loader';
import { hot } from 'react-hot-loader/root';

// Create main element
const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

// Render components
const render = (Component: () => JSX.Element) => {
    ReactDOM.render(<Component />, mainElement);
};

render(hot(() => <CollectionLoader />));
