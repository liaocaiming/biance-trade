import React from 'react';
import { Form, Button } from 'antd';
import memoizeOne from 'memoize-one';
import { FormInstance } from 'antd/lib/form';

import AppFormLayout from './AppFormLayout';
import { customAppFormProps, defaultSubmitButton } from './constant';
import {
  getRestProps,
  shouldUpdateFormItems,
  normalizeFormInitialValues,
  getChangeStore,
  transformItemsInitialValue,
  shouldUpdateForm,
} from './utils';

import { Store, AppFormProps } from './interface.d';

interface AppFormState {
  // 只影响隐藏与显示的表单刷新
  showItemsUpdateTime?: number;

  // 整个表单刷新时间，某些情况下需要刷新整个表单
  formUpdateTime?: number;

  formName?: string;
}

/**
 * AppForm Class 版性能会优于 hooks 版大概 16%
 * 代码行数多于 hooks 版
 */
export default class AppForm extends React.PureComponent<AppFormProps, AppFormState> {
  private initValues: Store = {};

  private updateStore: Store = {};

  private performTime = window.performance.now();

  private formRef = React.createRef<FormInstance>();

  // 使用 memoizeOne 缓存最近一次的，计算结果，优化性能
  private shouldUpdateFormItems = memoizeOne(shouldUpdateFormItems);

  // 使用 memoizeOne 缓存最近一次的，计算结果，优化性能
  // private getFormRestProps = memoizeOne(getRestProps);

  // 使用 memoizeOne 缓存最近一次的，计算结果，优化性能
  private transformItemsInitialValue = memoizeOne(transformItemsInitialValue);

  // eslint-disable-next-line react/sort-comp
  private updateFormStore(form: FormInstance | null): boolean {
    const { updateStore, numberToString = true } = this.props;
    let ret = false;

    if (form && updateStore) {
      const changeUpdateStore = getChangeStore({ prev: this.updateStore, next: updateStore, numberToString });

      if (changeUpdateStore) {
        form.setFieldsValue(changeUpdateStore);

        this.updateStore = updateStore;
        ret = true;
      }
    }

    return ret;
  }

  constructor(props: AppFormProps) {
    super(props);
    const { name = 'appForm', formItems, initialValues, numberToString = true } = props;

    // 初始值应该只初始化一次
    this.initValues = normalizeFormInitialValues(formItems, initialValues, numberToString);

    this.state = {
      showItemsUpdateTime: -1,
      formName: name,
      formUpdateTime: -1,
    };
  }

  componentDidMount(): void {
    const { onReady } = this.props;

    // 必须 form 第一次渲染完成后才有 this.formRef.current
    if (this.formRef.current) {
      onReady && onReady(this.formRef.current);

      this.updateFormStore(this.formRef.current);

      // 依据 form 表单属性重新 render 一次
      this.setState({
        showItemsUpdateTime: Date.now(),
      });
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate() {
    if (process.env.BUILD_MODE === 'development') {
      this.performTime = window.performance.now();
    }
  }

  componentDidUpdate(): void {
    if (process.env.BUILD_MODE === 'development') {
      window.console.log(`[AppForm] ${this.state.formName} update time =`, window.performance.now() - this.performTime);
    }

    const needChangeStore = this.updateFormStore(this.formRef.current);

    // 如果有 updateStore 则更新一下 showItems
    if (needChangeStore) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        showItemsUpdateTime: Date.now(),
      });
    }
  }

  // 处理提交
  private handSubmit = (): void => {
    const { beforeSubmit } = this.props;
    const form = this.formRef.current;

    //
    if (!form) {
      return;
    }

    if (typeof beforeSubmit === 'function') {
      beforeSubmit(form);
    }

    form.submit();
  };

  private onStoreChange = async (changeStore: Store, allStore: Store) => {
    const { onValuesChange, formItems } = this.props;
    const { formName } = this.state;
    const curForm = this.formRef.current;

    // 调用 Props 的 onValuesChange
    if (typeof onValuesChange === 'function') {
      onValuesChange(changeStore, allStore);
    }

    const shouldUpdateFormResult = await shouldUpdateForm(this.props, changeStore, allStore);
    const curUpdateId = Date.now();
    const updateState: { formUpdateTime?: number; showItemsUpdateTime?: number } = {};
    const { shouldUpdate } = this.shouldUpdateFormItems(formItems, curForm, formName, curUpdateId);

    if (shouldUpdateFormResult === true || shouldUpdate === true) {
      // 所有表单项都需要更新
      if (shouldUpdateFormResult) {
        updateState.formUpdateTime = curUpdateId;
      }

      // TODO: 如果父组件页监听表单值改变就重新渲染整个 Form，可能导致多 render 一次，思考如何优化
      if (shouldUpdate) {
        updateState.showItemsUpdateTime = curUpdateId;
      }

      this.setState(updateState);
    }
  };

  render(): React.ReactElement {
    const {
      children,
      footerClassName,
      footerStyle,
      submitButton = defaultSubmitButton,
      afterFormDOM,
      formItems,
      colSpan,
      labelCol,
      numberToString = true,
    } = this.props;
    const { type = 'default', text = '保存' } = submitButton || {};
    const restProps = getRestProps(this.props, customAppFormProps);

    // 因为 formItems 有可能在初始化后新增项，还需要处理 this.initValues 中未定义的 formItems 中的初始值
    this.transformItemsInitialValue(formItems, this.initValues, numberToString);

    const curForm = this.formRef.current;
    const { onStoreChange, handSubmit } = this;
    const { showItemsUpdateTime, formName, formUpdateTime } = this.state;
    const { showItems } = this.shouldUpdateFormItems(formItems, curForm, formName, showItemsUpdateTime);

    let newAfterFormDOM:any = null;

    const formItemProps = {
      form: curForm,
      showItems,
      labelCol,
      colSpan,
      formUpdateTime,
      numberToString,
    };

    // afterFormDOM 需要用到 form 完成初始化
    if (curForm) {
      if (typeof afterFormDOM === 'function') {
        newAfterFormDOM = afterFormDOM({
          form: curForm,
        });
      } else {
        newAfterFormDOM = afterFormDOM;
      }
    }

    return (
      <Form
        {...restProps}
        name={formName}
        initialValues={this.initValues}
        onValuesChange={onStoreChange}
        ref={this.formRef}
      >
        <AppFormLayout {...formItemProps} />
        {newAfterFormDOM}
        <div className={footerClassName} style={footerStyle}>
          {submitButton ? (
            <Button {...submitButton} type={type} onClick={handSubmit}>
              {text}
            </Button>
          ) : null}
          {children}
        </div>
      </Form>
    );
  }
}
