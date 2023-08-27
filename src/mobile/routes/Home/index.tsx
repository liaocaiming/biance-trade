import React, { useState, useEffect } from "react";
import IProps from "@typings/react.d";
import { Tabs, HoldList, TrustList, RecordList } from "./components/index";
import "./index.less";
import logoIcon from "./images/home-logo-icon.png";
import UIcon from "./images/home-u-icon.png";
import SetICon from "./images/home-set-icon.png";
import { pageUrlsMap } from "@src/mobile/config/routes";
import { api } from "@src/mobile/config/index";
import { fetch, constants } from "@utils/index";
import { User, queryToParamsStr } from "@utils/index";
import { Toast } from "antd-mobile";
import { Select } from '@src/mobile/components/index';
import { Modal } from 'antd-mobile';
const { alert } = Modal;

interface IComponent {
  data: any[];
  unbindRobot?: (params: any) => () => void;
  goDetail: (url: string, query: any) => () => void;
}

interface IData {
  name: number;
  type?: string;
  label: string;
  component: (props: IComponent) => JSX.Element;
}

// 持有:2,委托:1,历史:3
const data: IData[] = [
  {
    name: 2,
    label: "持有仓位",
    component: (props: IComponent) => <HoldList {...props} />,
  },

  {
    name: 1,
    label: "当前委托",
    component: (props: IComponent) => <TrustList {...props} />,
  },
  {
    name: 3,
    label: "历史数据",
    component: (props: IComponent) => <RecordList {...props} />,
  },
];

export default (props: IProps) => {
  const [type, setType] = useState(2);
  const [list, setList] = useState([]);
  const [orderType, setOrderType] = useState('-1');
  const userInfo = User.getUserInfo();

  const getList = (params: any) => {
    if (params.order_type === '-1') {
      delete params.order_type
    }

    fetch.get(api.followRecords, params).then((res) => {
      if (res.data) {
        setList(res.data || []);
      }
    });
  };

  // 解绑机器人
  const unbindRobot = (id: string) => {
    return () => {
      fetch.post(api.cancelFollowRecords, { id }).then((res) => {
        Toast.success((res && res.message) || "成功");
        getList({
          user_id: userInfo.id,
          status: type,
          order_type: orderType,
        });
      });
    };
  };

  const onTabChange = (item) => {
    setType(item.name);
    setList([]);
  };

  const goTo = (url: string, search: any = {}) => {
    return () => {
      const { history } = props;
      history.push({
        pathname: url,
        search: queryToParamsStr(search)
      });
    };
  };

  useEffect(() => {
    getList({
      user_id: userInfo.id,
      status: type,
      order_type: orderType,
    });
  }, [userInfo.id, type, orderType]);

  const renderListContent = () => {
    const item = data.find((it) => it.name === type) as IData;
    const { component } = item;
    return (
      <div className="margin_15 padding_15">
        {component({
          data: list,
          goDetail: goTo,
          unbindRobot,
        })}
      </div>
    );
  };

  const renderSelect = () => {
    const data = constants.ORDER_TYPE.slice();
    data.unshift({
      value: '-1',
      label: '全部'
    })

    return (
      <div className='home-select'>
        <Select data={data} value={orderType} onChange={(value: any) => {
          setOrderType(value)
        }} />
      </div>
    )
  }

  const robitOnchange = (status: 'stop' | 'start') => {
    return () => {
      const map = {
        stop: {
          url: api.usersStop_bot,
          title: '停止机器人',
          mesgae: '您确定要停止机器人么？'
        },
        start: {
          url: api.usersStart_bot,
          title: '启动机器人',
          mesgae: '您确定要启动机器人么？'
        }
      }

      alert(map[status].title, map[status].mesgae, [
        { text: '取消', onPress: () => console.log('cancel') },
        {
          text: '确定', onPress: () => {


            fetch.post(map[status].url, {
              id: userInfo.id
            }).then((res) => {
              if (res.message) {
                Toast.success(res.message)
              }
            })
          }
        },
      ])
    }
  }

  const renderBtn = () => {
    return (
      <div className='btn-container'>
        <span className='btn' onClick={robitOnchange('stop')}>停止机器人</span>
        <span className='btn' onClick={robitOnchange('start')}>启动机器人</span>
      </div>
    )
  }

  return (
    <div className="mb-home">
      <div className="header">
        <div className="clearfix icon-container">
          <img className="fl logo-icon" src={logoIcon} onClick={goTo(pageUrlsMap.openNumberLimit)} />
          <img
            className="fr set-icon"
            src={SetICon}
            onClick={goTo(pageUrlsMap.strategyList)}
          />
          <img
            className="fr u-icon"
            src={UIcon}
            onClick={goTo(pageUrlsMap.pay)}
          />
        </div>
        <Tabs list={data} activeKey={type} onChange={onTabChange} />
      </div>
      {renderBtn()}

      {renderSelect()}
      {renderListContent()}
    </div>
  );
};
