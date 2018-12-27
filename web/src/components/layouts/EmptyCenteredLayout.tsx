import { Col, Layout, Row } from "antd";
import React from "react";
import styles from "./EmptyCenteredLayout.module.scss";

const EmptyCenteredLayout: React.FunctionComponent = ({ children }) => (
    <Layout className={styles.layout}>
        <Row type="flex" justify="space-around" align="middle" className={styles.row}>
            <Col>
                {children}
            </Col>
        </Row>
    </Layout>
);

export default EmptyCenteredLayout;
