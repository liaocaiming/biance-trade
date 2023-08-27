import * as appActions from '@shared/containers/app/actions'
import * as appScreenActions from '@shared/containers/appScreen/actions'
import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as bossActions from './actions';

function defaultMapStateToProps(state: { app: any, screen: any, Htrade: any }) {
  return {
    $$app: state.app,
    $$screen: state.screen,
    $$Htrade: state.Htrade
  };
}

function defaultMapDispatchToProps(dispatch: any) {
  return { actions: bindActionCreators(Object.assign(appActions, appScreenActions, bossActions), dispatch) }
}

// Export List
export default function createContainer(mapStateToProps?: () => any, mapDispatchToProps?: () => any): any {
  const curMapStateToProps: any = mapStateToProps || defaultMapStateToProps
  const curMapDispatchToProps: any = mapDispatchToProps || defaultMapDispatchToProps

  return function connectAppScreen(target: ComponentType) {
    return connect(curMapStateToProps, curMapDispatchToProps)(target);
  }
}
