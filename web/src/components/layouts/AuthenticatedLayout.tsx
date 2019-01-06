import { Avatar, Button, Col, Icon, Layout, notification, Row, Tooltip } from "antd";
import Menu, { SelectParam } from "antd/lib/menu";
import classNames from "classnames";
import * as React from "react";
import Helmet from "react-helmet";
import { RouterProps } from "react-router";
import { Link } from "react-router-dom";
import { Firebase } from "../../config/FirebaseInitializer";
import { IRoute, routes } from "../../routes";
import styles from "./AuthenticatedLayout.module.scss";

interface IAuthenticatedLayoutProps {
    router: RouterProps;
}

interface IAuthenticatedLayoutState {
    activeMenuItem: IMenuItem;
    /**
     * This state field is used to update UI according to the sidebar collapse state.
     */
    isSidebarCollapsed: boolean;
}

interface IMenuItem {
    route: IRoute;
    iconType: string;
}

class AuthenticatedLayout extends React.Component<IAuthenticatedLayoutProps, IAuthenticatedLayoutState> {

    private menuItems: IMenuItem[] = [
        { route: routes.planningsRoute, iconType: "calendar" },
        { route: routes.studentsRoute, iconType: "team" },
        { route: routes.schoolsRoute, iconType: "bank" },
        { route: routes.departmentsRoute, iconType: "home" },
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
                        className={styles.sider}
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
                    <Layout
                        className={classNames(styles.contentLayout, { [styles.contentLayoutCollapsed]: this.state.isSidebarCollapsed })}
                    >
                        <Layout.Header className={styles.header}>
                            <Row type="flex" justify="space-between" align="middle">
                                <Col >
                                    <h1 className={styles.title}>
                                        {this.state.activeMenuItem.route.title}
                                    </h1>
                                </Col>
                                <Col>
                                    <Tooltip title={this.getUsername()} placement="bottom">
                                        {this.renderAvatar()}
                                    </Tooltip>
                                    <Tooltip title="Afmelden" placement="bottom">
                                        <Button
                                            shape="circle-outline"
                                            type="ghost"
                                            icon="logout"
                                            onClick={this.handleLogout}
                                            className={styles.logoutButton}
                                        />
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

    private renderAvatar(): React.ReactNode {
        const username = this.getUsername();
        const characters = username.indexOf("@") > -1
            ? [username.charAt(0)]
            : username.match(/\b(\w)/g);

        const avatarUsername = characters === null
            ? undefined
            : characters.map((c) => c.toUpperCase()).join("");

        if (avatarUsername === undefined) {
            return (
                <Avatar className={styles.avatar} icon="user" />
            );
        }

        return (
            <Avatar className={styles.avatar}>{avatarUsername}</Avatar>
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
                this.props.router.history.push(routes.signedOutHomeRoute.url);
            })
            .catch(() => {
                notification.error({
                    message: "Iets ging fout bij het uitloggen... Herlaad de pagina a.u.b.",
                });
            });
    }

    private getUsername(): string {
        const user = Firebase.auth().currentUser;

        if (user === null) {
            return "";
        }

        if (user.displayName !== null) {
            return user.displayName;
        }

        if (user.email !== null) {
            return user.email;
        }

        return "";
    }
}

export default AuthenticatedLayout;
