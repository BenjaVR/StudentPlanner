import { Button, Col, Popconfirm, Row, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import React from "react";
import { stringSorter } from "../../helpers/sorters";
import { ISchool } from "../../models/School";
import styles from "./SchoolList.module.scss";

interface ISchoolListProps {
    isLoading: boolean;
    schools: ISchool[];
    deleteSchool: (school: ISchool) => Promise<void>;
    onAddSchoolRequest: () => void;
}

class SchoolList extends React.Component<ISchoolListProps> {

    private columns: Array<ColumnProps<ISchool>> = [
        {
            title: "Naam",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => stringSorter(a.name, b.name),
        },
        {
            title: "Acties",
            key: "actions",
            width: 120,
            align: "center",
            render: (record: ISchool) => this.renderActions(record),
        },
    ];

    constructor(props: ISchoolListProps) {
        super(props);

        this.renderActions = this.renderActions.bind(this);
        this.renderTableTitle = this.renderTableTitle.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <Table
                rowKey={this.getTableRowKey}
                title={this.renderTableTitle}
                columns={this.columns}
                dataSource={this.props.schools}
                loading={this.props.isLoading}
                bordered={true}
                size="middle"
                scroll={{ x: 250 }}
            />
        );
    }

    private renderActions(school: ISchool): React.ReactNode {
        const deleteFunc = () => this.props.deleteSchool(school);
        return (
            <React.Fragment>
                <Button
                    size="small"
                    icon="edit"
                    type="primary"
                    ghost={true}
                    className={styles.actionButton}
                />
                <Popconfirm
                    title="Weet u zeker dat u deze school wilt verwijderen?"
                    onConfirm={deleteFunc}
                >
                    <Button
                        size="small"
                        icon="delete"
                        type="danger"
                        ghost={true}
                        className={styles.actionButton}
                    />
                </Popconfirm>

            </React.Fragment>
        );
    }

    private renderTableTitle(): React.ReactNode {
        return (
            <Row type="flex" justify="space-between">
                <Col>
                    <h2 className={styles.tableTitleText}>Scholen</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={this.props.onAddSchoolRequest}>
                        Nieuwe school
                </Button>
                </Col>
            </Row>
        );
    }

    private getTableRowKey(record: ISchool, index: number): string {
        return record.id || index.toString();
    }
}

export default SchoolList;
