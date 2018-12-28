import { Button, Col, Icon, Layout, notification, Row, Tooltip } from "antd";
import Menu, { SelectParam } from "antd/lib/menu";
import * as React from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { Firebase } from "../../config/FirebaseInitializer";
import { IRoute, routes } from "../../routes";
import styles from "./AuthenticatedLayout.module.scss";

interface IAuthenticatedLayoutProps {
}

interface IAuthenticatedLayoutState {
    activeMenuItem: IMenuItem;
    isSidebarCollapsed: boolean;
}

interface IMenuItem {
    route: IRoute;
    iconType: string;
}

class AuthenticatedLayout extends React.Component<IAuthenticatedLayoutProps, IAuthenticatedLayoutState> {

    private menuItems: IMenuItem[] = [
        { route: routes.studentsRoute, iconType: "team" },
        { route: routes.schoolsRoute, iconType: "bank" },
    ];

    constructor(props: IAuthenticatedLayoutProps) {
        super(props);

        this.state = {
            activeMenuItem: this.menuItems[0],
            isSidebarCollapsed: false,
        };

        this.handleSidebarCollapse = this.handleSidebarCollapse.bind(this);
        this.handleSelectMenuItem = this.handleSelectMenuItem.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Helmet>
                    <title>{this.state.activeMenuItem.route.title}</title>
                </Helmet>
                <Layout>
                    <Layout.Sider
                        breakpoint="md"
                        collapsible={true}
                        onCollapse={this.handleSidebarCollapse}
                    >
                        <div className={styles.logo}>
                            {this.state.isSidebarCollapsed ? "SP" : "Student Planner"}
                        </div>
                        <Menu
                            theme="dark"
                            selectedKeys={[this.state.activeMenuItem.route.url]}
                            onSelect={this.handleSelectMenuItem}
                        >
                            {this.renderMenuItems()}
                        </Menu>
                    </Layout.Sider>
                    <Layout className={styles.contentLayout}>
                        <Layout.Header className={styles.header}>
                            <Row type="flex" justify="space-between" align="middle">
                                <Col >
                                    <h1 className={styles.title}>
                                        {this.state.activeMenuItem.route.title}
                                    </h1>
                                </Col>
                                <Col>
                                    <Tooltip title="Logout">
                                        <Button icon="logout" type="ghost" onClick={this.handleLogout} />
                                    </Tooltip>
                                </Col>
                            </Row>
                        </Layout.Header>
                        <Layout.Content className={styles.content}>
                            <div className={styles.innerContent}>
                                {this.props.children}
                            </div>
                        </Layout.Content>
                    </Layout>
                </Layout>
            </React.Fragment>
        );
    }

    private renderMenuItems(): React.ReactNode {
        return this.menuItems.map((menuItem) => {
            return (
                <Menu.Item key={menuItem.route.url}>
                    <Link to={menuItem.route.url}>
                        <Icon type={menuItem.iconType} />
                        <span>{menuItem.route.title}</span>
                    </Link>
                </Menu.Item>
            );
        });
    }

    private handleSidebarCollapse(isCollapsed: boolean): void {
        this.setState({
            isSidebarCollapsed: isCollapsed,
        });
    }

    private handleSelectMenuItem(selectParam: SelectParam): void {
        const newMenuItem = this.menuItems.find((menuItem) => menuItem.route.url === selectParam.key);

        if (newMenuItem !== undefined) {
            this.setState({
                activeMenuItem: newMenuItem,
            });
        }
    }

    private handleLogout(event: React.FormEvent): void {
        event.preventDefault();

        Firebase.auth().signOut()
            .then(() => {
                notification.success({
                    message: "Succesvol uitgelogd!",
                });
            })
            .catch(() => {
                notification.error({
                    message: "Iets ging fout bij het uitloggen... Herlaad de pagina a.u.b.",
                });
            });
    }
}

export default AuthenticatedLayout;
