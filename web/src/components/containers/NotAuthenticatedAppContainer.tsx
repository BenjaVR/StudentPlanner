import { Col, Layout, Row } from "antd";
import React from "react";
import styles from "./NotAuthenticatedAppContainer.module.scss";

const NotAuthenticatedAppContainer: React.FunctionComponent = ({ children }) => (
    <Layout className={styles.layout}>
        <Row type="flex" justify="space-around" align="middle" className={styles.row}>
            <Col>
                {children}
            </Col>
        </Row>
    </Layout>
);

export default NotAuthenticatedAppContainer;
