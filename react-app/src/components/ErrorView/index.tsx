import React from 'react';
import {Collapse, Result} from 'antd';
import {BugTwoTone, CaretRightOutlined} from "@ant-design/icons";
import {isJSONArray, isJSONObject, JSONValue} from '@kbase/ui-lib/lib/json';
import {AppError, InfoTable} from '@kbase/ui-components';


export interface ErrorViewProps {
    title?: string;
    error: AppError;
}

interface ErrorViewState {

}

export default class ErrorView extends React.Component<ErrorViewProps, ErrorViewState> {
    renderJSON(info: JSONValue) {
        const r = (d: JSONValue): React.ReactNode => {
            switch (typeof d) {
                // case 'undefined':
                //     // TODO: not possible if actually a JSONValue, but
                //     // this handles optional properties...
                //     return <span style={{fontStyle: 'italic'}}>undefined</span>;
                case 'string':
                    return <span>{d}</span>;
                case 'boolean':
                    return d ? <span>True</span> : <span>False</span>;
                case 'number':
                    return <span>{String(d)}</span>;
                case 'object':
                    if (d === null) {
                        return <span><code>null</code></span>;
                    } else if (isJSONArray(d)) {
                        return <div>
                            {
                                d.map((item, index) => {
                                    return <div key={index}>
                                        {r(item)}
                                    </div>;
                                })
                            }
                        </div>;
                    } else if (isJSONObject(d)) {
                        const table = Object.entries(d).map(([label, value]) => {
                            return {
                                label,
                                render: () => r(value)
                            };
                        });
                        return <InfoTable table={table} bordered={true}/>;
                    } else {
                        return <span>** Not a JSONValue ** {typeof d}</span>;
                    }
            }
        };

        return r(info);
    }

    renderDetail() {
        if (!('info' in this.props.error) || (typeof this.props.error.info === 'undefined')) {
            return;
        }

        return <Collapse defaultActiveKey={['detail']}
                         bordered={false}
                         collapsible="disabled"
                         expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                         ghost={true}>
            <Collapse.Panel key="detail"
                            header="Detail"
                            collapsible="header">
                {this.renderJSON(this.props.error.info)}
            </Collapse.Panel>
        </Collapse>;
    }

    renderBody() {
        const table = [
            {
                label: 'Code',
                value: this.props.error.code
            }];

        return <div>
            <InfoTable table={table}/>

            {this.renderDetail()}
        </div>;
    }

    render() {
        return <Result
            status="error"
            title={this.props.title || 'Error'}
            icon={<BugTwoTone twoToneColor="red"/>}
            subTitle={this.props.error.message}
        >
            <div style={{display: 'flex', justifyContent: 'center'}}>
                {this.renderBody()}
            </div>
        </Result>;
    }
}
