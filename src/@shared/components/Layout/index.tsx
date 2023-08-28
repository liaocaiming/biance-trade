import * as React from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from "@ant-design/icons";
import { Button, Layout, Menu, Spin } from "antd";
import { connect } from "@containers/app";
import { renderRoutes } from "react-router-config";
const { Header, Content, Footer, Sider } = Layout;
import SubMenu from "antd/lib/menu/SubMenu";
import { Link } from "react-router-dom";
import "./index.css";
import menuData from "./menuData";
import ErrorBoundary from "@shared/components/ErrorBoundary";

interface IMenu {
  key: string;
  title: string;
  listConfig?: any;
  detailConfig?: any;
  detailTitle?: string;
  iconType?: string;
  children?: IMenu[];
  hasChild?: number;
  id?: string;
}

export interface IProps {
  $$app?: any;
  actions?: any;
  menu?: any;
  router?: any;
  routes?: any;
  history?: any;
  $$screen: any;
}

// tslint:disable-next-line:interface-name
interface IPlatformItem {
  href: string;
  value: string;
  label: string;
}

export interface IState {
  collapsed?: boolean;
  routes: any;
  menuArray: any;
  marginLeft: number;
  platformList: IPlatformItem[];
}

// 拆分url
export function splitUrl(pathName: any, defaultPath = "/") {
  const splitArray = pathName.split("/");
  const tempArray: any = [];

  splitArray.map((item: any) => {
    if (item) {
      tempArray.push(item);
    }
  });
  tempArray.push(defaultPath);
  return tempArray;
}

@connect()
export default class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      collapsed: false,
      routes: [],
      menuArray: [],
      marginLeft: 200,
      platformList: [],
    };
  }


  private renderItemOrSub(item: IMenu, key: any) {
    let concatKey = `${key}/${item.key}`;
    if (concatKey.substring(0, 1) !== "/") {
      concatKey = "/" + concatKey;
    }
    if (item.children && item.children.length && item.hasChild) {
      return this.renderSubMenu(item, concatKey);
    } else if (!item.hasChild) {
      return this.renderMenuItem(item, concatKey);
    } else {
      return;
    }
  }

  private renderMenuItem(item: any, key: any) {
    return (
      <Menu.Item key={item.key} icon={item.icon}>
        <Link
          className={"margin_right_5"}
          to={{
            pathname: key,
            state: item,
          }}
        >
          {/* {item.iconType && <Icon type={item.iconType} />} */}
          <span style={{ fontSize: "14px" }}>{item.title}</span>
        </Link>
      </Menu.Item>
    );
  }

  private renderSubMenu(item: any, key: any) {
    return (
      <SubMenu
        key={item.key}
        title={
          <span>
            <span>{item.title}</span>
          </span>
        }
      >
        {item.children &&
          item.children.map((childItem: any) => {
            return this.renderItemOrSub(childItem, key);
          })}
      </SubMenu>
    );
  }

  private toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      marginLeft: this.state.collapsed ? 200 : 80,
    });

    window.localStorage.setItem("isNotFirstTime", "true");
  };


  render() {
    const { history, menu } = this.props;
    const saving = this.props.$$app && this.props.$$app.getIn(["saving"]);
    const fetching = this.props.$$app && this.props.$$app.getIn(["fetching"]);
    const { collapsed } = this.state;

    return (
      <Layout className="layout">
        <Sider collapsed={this.state.collapsed} className="layout-side">
          <div className="layout-system-name">
            {!collapsed ? <span>数据统计</span> : null}

            {
              collapsed ? <MenuFoldOutlined onClick={this.toggleCollapsed} /> : <MenuUnfoldOutlined onClick={this.toggleCollapsed} />
            }
          </div>

          <Menu
            theme="dark"
            selectedKeys={splitUrl(history.location.pathname)}
            defaultOpenKeys={splitUrl(history.location.pathname)}
            mode="inline"
            inlineIndent={16}
            style={{ backgroundColor: "rgba(34,51,77,1)" }}
          >
            {menu || menuData.map((item: any) => {
              return this.renderItemOrSub(item, "/boss");
            })}
          </Menu>
        </Sider>

        {/* <Layout style={{ marginLeft }}> */}
        <Layout>
          <Header className="layout-header">
            <div className="layout-title">最牛逼网站, 不接受反驳</div>
            <Button className="sign-out-btn" type="primary">
              退出
            </Button>
          </Header>
          <Content style={{ padding: "10px 20px" }} className="layout-content">
            <Spin size="large" spinning={saving || fetching}>
              <ErrorBoundary>{renderRoutes(this.props.routes)}</ErrorBoundary>
            </Spin>
          </Content>
          <Footer style={{ textAlign: "center" }}>最牛逼网站</Footer>
        </Layout>
      </Layout>
    );
  }
}
