import { Avatar, Button, Col, Icon, Layout, notification, Row, Tooltip } from "antd";
import Menu, { SelectParam } from "antd/lib/menu";
import classNames from "classnames";
import * as React from "react";
import Helmet from "react-helmet";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import { AnyRouteComponentProps, IRoute, routes } from "../../routes";
import { Firebase } from "../../services/FirebaseInitializer";
import styles from "./AppContainer.module.scss";

type AppContainerProps = AnyRouteComponentProps;

interface IAppContainerState {
    activeMenuItem: IMenuItem;
    isSiderCollapsed: boolean;
}

interface IMenuItem {
    route: IRoute;
    iconType: string;
}

class AppContainer extends React.Component<AppContainerProps, IAppContainerState> {

    private menuItems: IMenuItem[] = [
        { route: routes.planningsRoute, iconType: "calendar" },
        { route: routes.studentsRoute, iconType: "team" },
        { route: routes.schoolsRoute, iconType: "bank" },
        { route: routes.educationsRoute, iconType: "edit" },
        { route: routes.departmentsRoute, iconType: "home" },
    ];

    constructor(props: AppContainerProps) {
        super(props);

        this.state = {
            activeMenuItem: this.getMenuItemByUrl(this.props.location.pathname) || this.menuItems[0],
            isSiderCollapsed: false,
        };

        this.handleBreakpoint = this.handleBreakpoint.bind(this);
        this.handleSiderCollapseToggle = this.handleSiderCollapseToggle.bind(this);
        this.handleSelectMenuItem = this.handleSelectMenuItem.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    public render(): React.ReactNode {
        if (Firebase.auth().currentUser === null) {
            return <Redirect to={routes.logInRoute.url} />;
        }
        return (
            <React.Fragment>
                <Helmet>
                    <title>{this.state.activeMenuItem.route.title}</title>
                </Helmet>
                <Layout>
                    <Layout.Sider
                        breakpoint="sm"
                        onBreakpoint={this.handleBreakpoint}
                        collapsible={true}
                        trigger={null}
                        collapsed={this.state.isSiderCollapsed}
                    >
                        <div className={classNames(styles.siderContentWrapper, { [styles.siderContentWrapperCollapsed]: this.state.isSiderCollapsed })}>
                            <div className={styles.logo}>
                                {this.state.isSiderCollapsed ? "SP" : "Student Planner"}
                            </div>
                            <Menu
                                theme="dark"
                                selectedKeys={[this.state.activeMenuItem.route.url]}
                                onSelect={this.handleSelectMenuItem}
                            >
                                {this.renderMenuItems()}
                            </Menu>
                            <div className={classNames(styles.siderFooter, { [styles.siderFooterCollapsed]: this.state.isSiderCollapsed })}>
                                <Tooltip title={this.getUserEmail()} placement="right">
                                    <p className={styles.siderFooterUsername}>{this.getUserEmail()}</p>
                                </Tooltip>
                                <Button
                                    className={styles.siderFooterLogoutButton}
                                    type="ghost"
                                    size="small"
                                    icon="logout"
                                    onClick={this.handleLogout}
                                >
                                    {this.state.isSiderCollapsed ? "" : "Afmelden"}
                                </Button>
                            </div>
                        </div>
                    </Layout.Sider>
                    <Layout
                        className={styles.contentLayout}
                    >
                        <Layout.Header className={styles.header}>
                            <Icon
                                className={classNames("trigger", styles.triggerButton)}
                                type={this.state.isSiderCollapsed ? "menu-unfold" : "menu-fold"}
                                onClick={this.handleSiderCollapseToggle}
                            />
                            <h1 className={styles.title}>
                                {this.state.activeMenuItem.route.title}
                            </h1>
                        </Layout.Header>
                        <Layout.Content className={styles.content}>
                            <div className={styles.innerContent}>
                                {this.renderRoutes()}
                            </div>
                        </Layout.Content>
                    </Layout>
                </Layout>
            </React.Fragment >
        );
    }

    private renderRoutes(): React.ReactNode {
        return (
            <Switch>
                <Route exact={true} path={routes.planningsRoute.url} component={routes.planningsRoute.component} />
                <Route exact={true} path={routes.studentsRoute.url} component={routes.studentsRoute.component} />
                <Route exact={true} path={routes.schoolsRoute.url} component={routes.schoolsRoute.component} />
                <Route exact={true} path={routes.educationsRoute.url} component={routes.educationsRoute.component} />
                <Route exact={true} path={routes.departmentsRoute.url} component={routes.departmentsRoute.component} />

                <Redirect to={routes.planningsRoute.url} />
            </Switch>
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

    private handleBreakpoint(broken: boolean): void {
        this.setState({
            isSiderCollapsed: broken,
        });
    }

    private handleSiderCollapseToggle(): void {
        this.setState({
            isSiderCollapsed: !this.state.isSiderCollapsed,
        });
    }

    private handleSelectMenuItem(selectParam: SelectParam): void {
        const newMenuItem = this.getMenuItemByUrl(selectParam.key);

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
                this.props.history.push(routes.logInRoute.url);
            })
            .catch(() => {
                notification.error({
                    message: "Iets ging fout bij het uitloggen... Herlaad de pagina a.u.b.",
                });
            });
    }

    private getMenuItemByUrl(url: string): IMenuItem | undefined {
        return this.menuItems.find((menuItem) => menuItem.route.url === url);
    }

    private getUserEmail(): string {
        const user = Firebase.auth().currentUser;

        if (user === null) {
            return "";
        }

        if (user.email !== null) {
            return user.email;
        }

        return "";
    }
}

export default AppContainer;
