import { Icon, Layout } from "antd";
import Menu, { SelectParam } from "antd/lib/menu";
import * as React from "react";
import { Link } from "react-router-dom";
import { IRoute, routes } from "../../../routes";

interface ISignedInLayoutProps {
}

interface ISignedInLayoutState {
    activeMenuItem: IMenuItem;
}

interface IMenuItem {
    route: IRoute;
    iconType: string;
}

export class SignedInLayout extends React.Component<ISignedInLayoutProps, ISignedInLayoutState> {

    private menuItems: IMenuItem[] = [
        { route: routes.studentsRoute, iconType: "team" },
        { route: routes.schoolsRoute, iconType: "bank" },
    ];

    constructor(props: ISignedInLayoutProps) {
        super(props);

        this.state = {
            activeMenuItem: this.menuItems[0],
        };

        this.handleSelectMenuItem = this.handleSelectMenuItem.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <Layout>
                <Layout.Sider
                    breakpoint="md"
                    collapsible={true}
                    collapsedWidth={0}
                >
                    <div className="logo">
                        SOME LOGO
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[this.state.activeMenuItem.route.url]}
                        onSelect={this.handleSelectMenuItem}
                    >
                        {this.renderMenuItems()}
                    </Menu>
                </Layout.Sider>
                <Layout style={{ minHeight: "100vh" }}>
                    <Layout.Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
                        <div style={{ padding: 24, background: "#fff", textAlign: "center" }}>
                            {this.props.children}
                        </div>
                    </Layout.Content>
                </Layout>
            </Layout>
        );
    }

    private renderMenuItems(): React.ReactNode {
        return this.menuItems.map((menuItem) => {
            return (
                <Menu.Item key={menuItem.route.url}>
                    <Link to={menuItem.route.url}>
                        <Icon type={menuItem.iconType} />
                        <span className="nav-text">{menuItem.route.title}</span>
                    </Link>
                </Menu.Item>
            );
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
}
