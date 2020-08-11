import React from 'react';
import { Row, Col, Modal, Button } from 'antd';
import { Sample } from '../Main/types';
import './styles.css';
import { SelectValue } from 'antd/lib/select';
import Versions from '../Versions';
import UserCard from '../UserCard/view';

export interface OverviewProps {
    sample: Sample;
}

interface OverviewState {
    showVersions: boolean;
}

export default class Overview extends React.Component<OverviewProps, OverviewState> {
    constructor(props: OverviewProps) {
        super(props);
        this.state = {
            showVersions: false
        };
    }

    onChangeVersion(version: SelectValue) {
        const hash = `samples/view/${this.props.sample.id}/${version}`;
        if (window.parent) {
            window.parent.location.hash = hash;
        } else {
            window.location.hash = hash;
        }
    }

    render() {
        const {
            name, created, source, sourceId, sourceParentId
        } = this.props.sample;

        const idLabel = 'IGSN';
        const parentIdLabel = 'Parent IGSN';

        return <div className="Grouper Overview">
            <Row>
                <Col span={12}>
                    <div className="InfoTable">
                        <div>
                            <div>
                                Name
                            </div>
                            <div data-testid="name">
                                {name}
                            </div>
                        </div>
                        <div>
                            <div>
                                Source
                        </div>
                            <div data-testid="id">
                                {source}
                            </div>
                        </div>
                        <div>
                            <div>
                                {idLabel}
                            </div>
                            <div data-testid="version">
                                {sourceId.id}
                            </div>
                        </div>
                        <div>
                            <div>
                                {parentIdLabel}
                            </div>
                            <div data-testid="type">
                                {sourceParentId.id || "-"}
                            </div>
                        </div>

                    </div>
                </Col>
                <Col span={12} >
                    <div className="InfoTable">
                        <div>
                            <div>
                                Saved
                            </div>
                            <div data-testid="save_date">
                                {Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric',
                                    timeZoneName: 'short'
                                }).format(created.at)}
                            </div>
                        </div>
                        <div>
                            <div>
                                By
                            </div>
                            <div data-testid="save_date">
                                <UserCard user={this.props.sample.currentVersion.by} />
                            </div>
                        </div>
                        <div>
                            <div>
                                Version
                            </div>
                            <div data-testid="save_date">
                                {this.props.sample.currentVersion.version}
                                {' of '}
                                {this.props.sample.latestVersion.version}
                                {' - '}
                                <Button type="link" onClick={() => {
                                    this.setState({
                                        showVersions: !this.state.showVersions
                                    });
                                }}>
                                    Show all versions
                                </Button>
                                <Modal title="All Versions"
                                    visible={this.state.showVersions}
                                    width={"45em"}
                                    onCancel={() => {
                                        this.setState({
                                            showVersions: false
                                        });
                                    }}
                                    footer={null}
                                >
                                    <Versions sample={this.props.sample} onChangeVersion={this.onChangeVersion.bind(this)} />
                                </Modal>
                            </div>
                        </div>
                    </div>

                </Col>

            </Row>
        </div>;
    }
}
