import { Button, Calendar, Col, List, notification, Row, Spin, Tag, Tooltip } from "antd";
import React from "react";
import { IStudent } from "studentplanner-functions/shared/contract/IStudent";
import { AnyRouteComponentProps } from "../../routes";
import { StudentsService } from "../../services/StudentsService";
import styles from "./PlanningsPage.module.scss";

type PlanningsPageProps = AnyRouteComponentProps;

interface IPlanningsPageState {
    unplannedStudents: IStudent[];
    areStudentsLoading: boolean;
    showOnlyConfirmedStudents: boolean;
    isCalendarLoading: boolean;
}

class PlanningsPage extends React.Component<PlanningsPageProps, IPlanningsPageState> {

    private calendarRef: Calendar | null = null;

    private readonly studentsService = new StudentsService();
    private readonly studentLoadFailedNotificationKey = "studentLoadFailed";

    constructor(props: PlanningsPageProps) {
        super(props);

        this.state = {
            unplannedStudents: [],
            areStudentsLoading: false,
            showOnlyConfirmedStudents: true,
            isCalendarLoading: false,
        };

        this.renderStudentListHeader = this.renderStudentListHeader.bind(this);
        this.renderStudentListItem = this.renderStudentListItem.bind(this);
        this.handleReloadStudents = this.handleReloadStudents.bind(this);
        this.handleNextMonth = this.handleNextMonth.bind(this);
        this.handlePrevMonth = this.handlePrevMonth.bind(this);
    }

    public componentWillMount(): void {
        this.loadStudents();
    }

    public render(): React.ReactNode {
        return (
            <Row type="flex">
                <Col span={24} xl={16}>
                    <Spin spinning={this.state.isCalendarLoading}>
                        <div className={styles.buttonsInCalendarComponent}>
                            <Button icon="left" onClick={this.handlePrevMonth} />
                            <Button icon="right" onClick={this.handleNextMonth} />
                        </div>
                        <Calendar mode="month" ref={(ref) => this.calendarRef = ref} />
                    </Spin>
                </Col>
                <Col span={24} xl={8}>
                    <List
                        dataSource={this.state.unplannedStudents}
                        header={this.renderStudentListHeader()}
                        renderItem={this.renderStudentListItem}
                        loading={this.state.areStudentsLoading}
                        bordered={true}
                        pagination={{ position: "bottom" }}
                    />
                </Col>
            </Row>
        );
    }

    private renderStudentListHeader(): React.ReactNode {
        return (
            <Row type="flex" justify="space-between">
                <Col>
                    <h2>In te plannen studenten</h2>
                </Col>
                <Col>
                    <Tooltip title="Vernieuw de lijst" placement="bottomRight">
                        <Button
                            icon="reload"
                            type="ghost"
                            onClick={this.handleReloadStudents}
                        />
                    </Tooltip>
                </Col>
            </Row>
        );
    }

    private renderStudentListItem(student: IStudent): React.ReactNode {
        const onListItemClickFn = () => this.handlePlanStudent(student);
        return (
            <List.Item actions={[<a key={0} onClick={onListItemClickFn}>Inplannen</a>]}>
                {student.firstName} {student.lastName}
                &nbsp;
                {!student.isConfirmed &&
                    <Tag className={styles.notClickableTag} color="volcano">Niet bevestigd</Tag>
                }
            </List.Item>
        );
    }

    private handleReloadStudents(): void {
        this.loadStudents();
    }

    private handlePlanStudent(student: IStudent): void {
        alert(student.firstName);
    }

    private handleNextMonth(): void {
        this.doMonthChange("next");
    }

    private handlePrevMonth(): void {
        this.doMonthChange("prev");
    }

    private doMonthChange(action: "next" | "prev"): void {
        if (this.calendarRef === null) {
            return;
        }

        const currentMoment = this.calendarRef.state.value;

        if (action === "next") {
            this.calendarRef.setValue(currentMoment.add(1, "month"), "changePanel");
        }
        if (action === "prev") {
            this.calendarRef.setValue(currentMoment.subtract(1, "month"), "changePanel");
        }
    }

    private loadStudents(): void {
        this.setState({ areStudentsLoading: true });
        this.studentsService.getNotPlannedStudents()
            .then((students) => {
                this.setState({ unplannedStudents: students });
                notification.close(this.studentLoadFailedNotificationKey);
            })
            .catch(() => {
                notification.error({
                    key: this.studentLoadFailedNotificationKey,
                    message: "Kon de studenten niet ophalen. Probeer later opnieuw.",
                    duration: null,
                });
            })
            .finally(() => {
                this.setState({ areStudentsLoading: false });
            });
    }
}

export default PlanningsPage;
