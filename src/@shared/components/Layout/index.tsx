import * as React from "react";

import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Avatar, Button, Dropdown, Layout, Menu, Spin } from "antd";

import { connect } from "@containers/app";

import { renderRoutes } from "react-router-config";

const { Header, Content, Footer, Sider } = Layout;

import SubMenu from "antd/lib/menu/SubMenu";

import { Link } from "react-router-dom";

import User from "@utils/lib/User";

import "./index.css";

import menuData from "./menuData";

import ErrorBoundary from "@shared/components/ErrorBoundary";

function isFirstTime() {
  const isNotFirstTime = window.localStorage.getItem("isNotFirstTime");

  return isNotFirstTime !== "true";
}

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
  private isFirstTime: boolean;

  constructor(props: IProps) {
    super(props);
    this.state = {
      collapsed: false,
      routes: [],
      menuArray: [],
      marginLeft: 200,
      platformList: [],
    };
    this.isFirstTime = isFirstTime();
  }

  public UNSAFE_componentWillMount() { }

  public componentDidMount() {
    // if (!User.isLogin()) {
    //   const { history } = this.props;
    //   history.push("/");
    // }
  }

  // 退出登陆
  public handleLogout = () => {
    User.removeUserInfo();
    const { history } = this.props;
    history.push("/");
  };

  // 数组转成对象
  public arrChangeToObj = (arr: any[], key: string) => {
    const res = {};
    if (!arr || !key) {
      return;
    }

    const fn = (array: any[], keyStr: string) => {
      array.forEach((item: any) => {
        const concatKey = `${keyStr}_${item[key]}`;
        if (item.children && item.children.length) {
          res[concatKey] = item;
          fn(item.children, concatKey);
        } else {
          res[concatKey] = item;
        }
      });
    };

    arr.forEach((item: any) => {
      const concatKey = item[key];
      res[concatKey] = item;
      if (item.children && item.children.length) {
        fn(item.children, concatKey);
      }
    });

    return res;
  };

  // 右边用户退出入口
  public renderDropdown = (userInfo: any) => {
    const menu = (
      <Menu onClick={this.handleLogout} className="fe-user-menu">
        <Menu.Item key="center" disabled>
          <UserOutlined />
          个人中心
        </Menu.Item>
        <Menu.Item key="settings" disabled>
          <SettingOutlined />
          设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <LogoutOutlined />
          <Button>退出</Button>
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link">
          <Avatar
            icon={<UserOutlined />}
            size={"small"}
            className="margin_right_10 fe-header-avatar"
          />
          <span>{userInfo && userInfo.realName}</span> <DownOutlined />
        </a>
      </Dropdown>
    );
  };

  public renderItemOrSub(item: IMenu, key: any) {
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

  public renderMenuItem(item: any, key: any) {
    return (
      <Menu.Item key={item.key}>
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

  public renderSubMenu(item: any, key: any) {
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

  public toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      marginLeft: this.state.collapsed ? 200 : 80,
    });

    window.localStorage.setItem("isNotFirstTime", "true");
    this.isFirstTime = isFirstTime();
  };

  public getToggleMenuButtonTip() {
    let ret = "";

    if (this.isFirstTime) {
      ret = "点击切换菜单伸缩状态";
    }

    return ret;
  }

  // 通过菜单获取路由
  public getRoutesByMenuData = () => {
    const { menu } = this.props;
    this.setState({
      menuArray: menu || menuData,
    });
  };

  public render() {
    const { history, menu } = this.props;
    const saving = this.props.$$app && this.props.$$app.getIn(["saving"]);
    const fetching = this.props.$$app && this.props.$$app.getIn(["fetching"]);

    return (
      <Layout className="layout">
        <Sider collapsed={this.state.collapsed} className="layout-side">
          <div className="layout-system-name">
            <span>boss</span>
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
