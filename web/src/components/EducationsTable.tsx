import { Button, Col, notification, Popconfirm, Row, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import React from "react";
import { stringSorter } from "../helpers/sorters";
import { IEducation } from "../models/Education";
import { EducationsService } from "../services/EducationsService";
import styles from "./EducationsTable.module.scss";

interface IEducationsTableProps {
}

interface IEducationsTableState {
    educations: IEducation[];
    loading: boolean;
}

export type FormValidationTrigger = "onChange" | "";

class EducationsTable extends React.Component<IEducationsTableProps, IEducationsTableState> {

    private educationsService = new EducationsService();

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
            render: (record: IEducation) => this.renderRowActions(record),
        },
    ];

    constructor(props: IEducationsTableProps) {
        super(props);

        this.state = {
            educations: [],
            loading: true,
        };

        this.renderRowActions = this.renderRowActions.bind(this);
        this.renderTableTitle = this.renderTableTitle.bind(this);
        this.handleRequestAddEducation = this.handleRequestAddEducation.bind(this);
        this.handleDeleteEducation = this.handleDeleteEducation.bind(this);
        this.handleRequestEditEducation = this.handleRequestEditEducation.bind(this);
    }

    public componentDidMount(): void {
        this.educationsService.subscribe((educations): void => {
            this.setState({
                educations,
                loading: false,
            });
        });
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Table
                    title={this.renderTableTitle}
                    columns={this.columns}
                    rowKey={this.generateTableRowKey}
                    dataSource={this.state.educations}
                    loading={this.state.loading}
                    size="middle"
                    scroll={{ x: true }}
                    className={styles.table}
                />
            </React.Fragment>
        );
    }

    private renderTableTitle(): React.ReactNode {
        return (
            <Row type="flex" justify="space-between" align="middle">
                <Col className={styles.col}>
                    <h2 className={styles.tableTitleText}>Opleidingen</h2>
                </Col>
                <Col className={styles.col}>
                    <Button icon="plus" type="primary" onClick={this.handleRequestAddEducation}>
                        Nieuwe opleiding
                    </Button>
                </Col>
            </Row>
        );
    }

    private renderRowActions(record: IEducation): React.ReactNode {
        const deleteFunc = () => { this.handleDeleteEducation(record); };
        const editFunc = () => { this.handleRequestEditEducation(record); };
        return (
            <React.Fragment>
                <Button
                    size="small"
                    icon="edit"
                    type="primary"
                    ghost={true}
                    onClick={editFunc}
                    className={styles.actionButton}
                />
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
            </React.Fragment>
        );
    }

    private handleRequestAddEducation(): void {

    }

    private handleDeleteEducation(education: IEducation): void {
        this.setState({ loading: true });
        this.educationsService.delete(education)
            .then(() => {
                notification.success({
                    message: "Opleiding succesvol verwijderd",
                });
            })
            .catch((error) => {
                notification.error({
                    message: "Opleiding kon niet worden verwijderd",
                    description: error,
                });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    }

    private handleRequestEditEducation(education: IEducation): void {

    }

    private addEducation(education: IEducation): void {
        this.setState({ loading: true });

        this.educationsService.add({
            enabled: true,
            name: Math.random().toString(10),
        }).then(() => {
            notification.success({
                message: `Opleiding ${education.name} succesvol toegevoegd`,
            });
        }).catch((error) => {
            notification.error({
                message: "Kon opleiding niet toevoegen",
                description: error,
            });
        }).finally(() => {
            this.setState({ loading: false });
        });
    }
    
    private editEducation(education: IEducation): void {

    }

    private generateTableRowKey(record: IEducation, index: number): string {
        return record.id || index.toString();
    }
}

export default EducationsTable;
