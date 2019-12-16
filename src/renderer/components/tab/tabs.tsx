import * as React from 'react';
import './tab.scss';

import { TabsType } from '../../../types';
import { CloseIcon } from '@patternfly/react-icons';

interface IProps {
    tabs: TabsType;
    selectedTab: string;
    removeTab: (id) => void;
    setCurrentTab: (tabID) => void;
}

export class Tabs extends React.Component<IProps> {
    render() {
        const { tabs, selectedTab } = this.props;

        return (
            <div className="pf-c-tabs tab-list">
                <ul className="pf-c-tabs__list">
                    {Object.keys(tabs.byID).map(tabID => (
                        <li
                            key={tabID}
                            className={`pf-c-tabs__item tab-container ${
                                selectedTab === tabID ? 'pf-m-current' : ''
                            }`}
                        >
                            <div
                                className="pf-c-tabs__button"
                                onClick={() => this.props.setCurrentTab(tabID)}
                            >
                                {tabs.byID[tabID].name} <div className="close-spacer" />
                            </div>
                            <div
                                className="close-button"
                                onClick={() => this.props.removeTab(tabID)}
                            >
                                <CloseIcon />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
