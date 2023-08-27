import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
import { Tabs, Search, NoPermission, List, Drawer } from './components'
import { tabs } from './constants';
import header from './images/icon-header.png';
import { fetch, User } from '@utils/index';
import './index.less';
import { api } from '@src/m-htrade/config';
import { PullToRefresh, Toast } from 'antd-mobile';
import { Toggle } from '@components/index';
import noData from './images/no-data.png';
import notice from './components/Drawer/images/icon-notice.png';
import history from '@utils/lib/history';


type Tab = '1' | '2' | '3' | '4';

const height = document.body.clientHeight;

export default memo(() => {
  const [tab, setTab] = useState<Tab>('1');
  const [list, setList] = useState<any[]>([]);
  const ref = useRef(null);
  const [showDrawer, setShowDrawer] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false);
  let [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [searchparams, setSearchparams] = useState({})
  const [tabParams, setTabParams] = useState({});
  const userInfo = User.getUserInfo() || {};
  const { user_type } = userInfo;

  const tabOnchange = useCallback(
    (item) => {
      setTab(item.name)
      setTabParams(item.query);
      setPage(1);
      getList({
        ...item.query,
        page: 1
      })
    },
    [tab],
  )

  const getList = useCallback((params: any, showLoading: boolean = true) => {
    if (![2, 3].includes(user_type)) {
      return;
    }

    fetch.get(api.push_records, { pageSize: 10, page, ...searchparams, ...tabParams, ...params }, { showLoading }).then((res) => {
      if (count !== res.count && res.count) {
        setCount(res.count)
      }
      let data: any[] = res.data || []
      if (page > 1) {
        data = [...list, ...data];
      }
      setList(data);
      setRefreshing(false);
    })
  }, [page, refreshing, searchparams, tabParams, list])

  const onSearch = useCallback((values: any) => {
    setSearchparams(values);
    setPage(1);
    getList({
      ...values,
      page: 1
    })
  }, [page, refreshing, searchparams])

  const onStarChange = useCallback((item) => {
    const { index } = item;
    const arr = list.slice();
    arr[index].is_subscribe = !arr[index].is_subscribe;
    setList(arr);

  }, [list])

  useEffect(() => {
    getList({
      page: 1
    })
  }, [])

  const toggle = useCallback(() => {
    setShowDrawer(showDrawer ? false : true)
  }, [showDrawer])

  const goTo = () => {
    history.push({
      pathname: '/m-htrade/notice'
    })
  }

  return (
    <section className='m-home'>
      <section className='header-fixed'>

        <section className='head'>
          <img src={header} className='icon' onClick={toggle} />
          <img src={notice} className='icon' onClick={goTo} />
        </section>

        <section className='tabs'>
          <Tabs
            list={tabs}
            activeKey={tab}
            onChange={tabOnchange}
          />
        </section>

        <section className="search">
          <Search
            onChange={onSearch}
          />
        </section>

      </section>


      <Toggle isShow={[2, 3].includes(user_type)}>

        <Toggle isShow={list.length > 0}>
          <section className='home-list-container' >
            <PullToRefresh
              ref={ref}
              direction='up'
              refreshing={refreshing}
              indicator={{ deactivate: '下拉加载更多' }}
              distanceToRefresh={80}
              getScrollContainer={() => {
                return document.body
              }}
              style={{
                overflow: 'auto',
                height: height
              }}
              onRefresh={() => {
                if (list.length >= count) {
                  Toast.success('暂无更多数据！')
                  return;
                }
                let pageNo = page + 1
                setPage(pageNo);
                setRefreshing(true);
                getList({
                  page: pageNo
                }, false)
              }}
              damping={100}
            >
              <List list={list} onSuccess={onStarChange}></List>
            </PullToRefresh>
          </section>
        </Toggle>

        <Toggle isShow={list.length <= 0}>
          <section className="no-data">
            <div className="img-container">
              <img src={noData} className="img" />
            </div>
            <p className='text'>信号丢失</p>
          </section>
        </Toggle>

      </Toggle>

      <Toggle isShow={[1, 2, 5].includes(user_type)}>
        <section className='no-permisssion'>
          <NoPermission userType={user_type} />
        </section>
      </Toggle>


      <section>
        <Drawer drawerWebProps={{ open: showDrawer, onOpenChange: toggle }}></Drawer>
      </section>
    </section>
  )
})