import { Icon, Layout, Menu } from "antd";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SchoolsPage } from "../../pages/SchoolsPage";

interface IAppState {
    siderCollapsed: boolean;
    siderWidth: number;
}

export class App extends React.Component<{}, IAppState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            siderCollapsed: false,
            siderWidth: 200,
        };

        this.onSideCollapse = this.onSideCollapse.bind(this);
    }

    public onSideCollapse() {
        const siderWidth = this.state.siderCollapsed ? 200 : 80;

        this.setState({
            siderCollapsed: !this.state.siderCollapsed,
            siderWidth,
        });
    }

    public render() { // TODO: add styles
        return (
            <Layout>
                <Layout.Sider
                    style={{ overflow: "auto", height: "100vh", position: "fixed", left: 0 }}
                    breakpoint="md"
                    collapsible={true}
                    collapsed={this.state.siderCollapsed}
                    onCollapse={this.onSideCollapse}
                >
                    <div className="logo">
                        SOME LOGO
                    </div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={["4"]}>
                        <Menu.Item key="1">
                            <Icon type="user" />
                            <span className="nav-text">nav 1</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="video-camera" />
                            <span className="nav-text">nav 2</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="upload" />
                            <span className="nav-text">nav 3</span>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Icon type="bar-chart" />
                            <span className="nav-text">nav 4</span>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Icon type="cloud-o" />
                            <span className="nav-text">nav 5</span>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Icon type="appstore-o" />
                            <span className="nav-text">nav 6</span>
                        </Menu.Item>
                        <Menu.Item key="7">
                            <Icon type="team" />
                            <span className="nav-text">nav 7</span>
                        </Menu.Item>
                        <Menu.Item key="8">
                            <Icon type="shop" />
                            <span className="nav-text">nav 8</span>
                        </Menu.Item>
                    </Menu>
                </Layout.Sider>
                <Layout style={{ marginLeft: this.state.siderWidth, minHeight: "100vh" }}>
                    <Layout.Header style={{ background: "#fff", paddingLeft: 20, paddingRight: 20 }}>
                        <h1 style={{ display: "inline-block" }}>Student Planner</h1>
                        <p style={{ float: "right" }}>Welcome, Benjamin!</p>
                    </Layout.Header>
                    <Layout.Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
                        <div style={{ padding: 24, background: "#fff", textAlign: "center" }}>
                            {this.renderRouter()}
                        </div>
                    </Layout.Content>
                </Layout>
            </Layout>
        );
    }

    private renderRouter() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact={true} path="/" component={SchoolsPage} />
                </Switch>
            </BrowserRouter>
        );
    }
}
