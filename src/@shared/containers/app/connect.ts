import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as appActions from './actions';

function defaultMapStateToProps(state: {app: any}): { $$app: any } {
  return {
    $$app: state.app
  };
}

function defaultMapDispatchToProps(dispatch: any) {
  return { actions: bindActionCreators(appActions, dispatch) }
}

// Export List
export default function createContainer(mapStateToProps?: () => any, mapDispatchToProps?: () => any): any {
  const curMapStateToProps: any = mapStateToProps || defaultMapStateToProps
  const curMapDispatchToProps: any = mapDispatchToProps || defaultMapDispatchToProps

  return function connectApp(target: ComponentType) {
    return connect(curMapStateToProps, curMapDispatchToProps)(target);
  }
  
}