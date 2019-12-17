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
                <div className="pf-c-tabs__list tabs">
                    {Object.keys(tabs.byID).map(tabID => (
                        <div
                            key={tabID}
                            className={`pf-c-tabs__item tab-container ${
                                selectedTab === tabID ? 'pf-m-current' : ''
                            }`}
                        >
                            <div
                                className="pf-c-tabs__button tab-button"
                                onClick={() => this.props.setCurrentTab(tabID)}
                            >
                                {tabs.byID[tabID].name}
                            </div>
                            <div className="close-button-container">
                                <div
                                    className="close-button"
                                    onClick={() => this.props.removeTab(tabID)}
                                >
                                    <CloseIcon />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
