import { Button, Col, Popconfirm, Row, Table, Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import React from "react";
import { stringSorter } from "../../helpers/sorters";
import { IEducation } from "../../models/Education";
import styles from "../DataTable.module.scss";

interface IEducationsTableProps {
    isLoading: boolean;
    educations: IEducation[];
    deleteEducation: (education: IEducation) => Promise<void>;
    onAddEducationRequest: () => void;
    onEditEducationRequest: (education: IEducation) => void;
}

class EducationsTable extends React.Component<IEducationsTableProps> {

    private columns: Array<ColumnProps<IEducation>> = [
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
            render: (record: IEducation) => this.renderActions(record),
        },
    ];

    constructor(props: IEducationsTableProps) {
        super(props);

        this.renderActions = this.renderActions.bind(this);
        this.renderTableTitle = this.renderTableTitle.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <Table
                title={this.renderTableTitle}
                columns={this.columns}
                rowKey={this.generateTableRowKey}
                dataSource={this.props.educations}
                loading={this.props.isLoading}
                size="middle"
                bordered={true}
                scroll={{ x: true }}
                className={styles.table}
            />
        );
    }

    private renderActions(education: IEducation): React.ReactNode {
        const deleteFunc = () => this.props.deleteEducation(education);
        const editFunc = () => this.props.onEditEducationRequest(education);
        return (
            <React.Fragment>
                <Tooltip title="Bewerken">
                    <Button
                        size="small"
                        icon="edit"
                        type="primary"
                        ghost={true}
                        onClick={editFunc}
                        className={styles.actionButton}
                    />
                </Tooltip>
                <Tooltip title="Verwijderen">
                    <Popconfirm
                        title="Weet u zeker dat u deze opleiding wilt verwijderen?"
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
                </Tooltip>
            </React.Fragment>
        );
    }

    private renderTableTitle(): React.ReactNode {
        return (
            <Row type="flex" justify="space-between" align="middle">
                <Col className={styles.col}>
                    <Button icon="plus" type="primary" onClick={this.props.onAddEducationRequest}>
                        Nieuwe opleiding
                    </Button>
                </Col>
            </Row>
        );
    }

    private generateTableRowKey(record: IEducation, index: number): string {
        return record.id || index.toString();
    }
}

export default EducationsTable;
