import React, { useCallback, useState, useEffect, memo } from 'react';

import { Form, Button } from 'antd';
import memoize from 'memoize-one';

import { shouldUpdateFormItems, getRestProps, getChangeStore, shouldUpdateForm } from './utils';
import { customAppFormProps, defaultSubmitButton } from './constant';
import AppFormLayout from './AppFormLayout';

import { Store, AppFormProps } from './interface.d';

function usePerformanceEffect() {
  // eslint-disable-next-line compat/compat
  const time = performance.now();

  useEffect(() => {
    // eslint-disable-next-line compat/compat
    console.log('[AppForm] hooks render time = ', performance.now() - time);
  });
}

// TODO：待优化，现在多个 AppForm 渲染时，公用一份缓存
const curShouldUpdateFormItems = memoize(shouldUpdateFormItems);
let cacheUpdateStore: Store = {};

/**
 * AppForm 的 hooks 版性能要低于 class 版 16%
 * 代码量少 30% 左右
 * 尽量只做布局上的处理
 *
 * @param props
 */
function AppForm(props: AppFormProps): React.ReactElement {
  const {
    submitButton = defaultSubmitButton,
    children,
    name,
    footerClassName,
    afterFormDOM,
    formItems,
    colSpan,
    labelCol,
    numberToString = true,
    onValuesChange,
    beforeSubmit,
    onReady,
    updateStore,
  } = props;
  const { type = 'default', text } = submitButton || {};
  const restProps = getRestProps(props, customAppFormProps);

  // Hooks
  const [form] = Form.useForm();
  const [updateState, setFormUpdate] = useState({ formUpdateTime: -1, showItemsUpdateTime: -1 });
  const { showItems } = curShouldUpdateFormItems(formItems, form, name, updateState.showItemsUpdateTime);

  const onStoreChange = useCallback(
    (changeStore: Store, allStore: Store) => {
      if (typeof onValuesChange === 'function') {
        onValuesChange(changeStore, allStore);
      }

      shouldUpdateForm(props, changeStore, allStore).then(result => {
        const curUpdateId = Date.now();
        const newUpdateState: { formUpdateTime?: number; showItemsUpdateTime?: number } = {};
        const { shouldUpdate } = shouldUpdateFormItems(formItems, form, name, curUpdateId);

        if (result === true || shouldUpdate === true) {
          // 所有表单项都需要更新
          if (result) {
            newUpdateState.formUpdateTime = curUpdateId;
          }

          // TODO: 如果父组件页监听表单值改变也重新渲染 Form，可能导致多 render 一次，思考如何优化
          if (shouldUpdate) {
            newUpdateState.showItemsUpdateTime = curUpdateId;
          }

          setFormUpdate({
            ...updateState,
            ...newUpdateState,
          });
        }
      });
    },
    [onValuesChange, form, name]
  );

  // eslint-disable-next-line no-self-compare
  const handSubmit = useCallback(() => {
    if (typeof beforeSubmit === 'function') {
      beforeSubmit(form);
    }
    form.submit();
  }, [beforeSubmit, form]);

  // 类似 componentsDidMount
  useEffect(() => {
    onReady && onReady(form);
  }, []);

  useEffect(() => {
    let ret = false;

    if (form && updateStore) {
      const changeUpdateStore = getChangeStore({ prev: cacheUpdateStore, next: updateStore, numberToString });

      if (changeUpdateStore) {
        form.setFieldsValue(changeUpdateStore);

        cacheUpdateStore = updateStore;
        ret = true;
      }
    }

    if (ret) {
      setFormUpdate({
        ...updateState,
        formUpdateTime: Date.now(),
      });
    }
  }, [updateStore]);

  // 类似 componentWillUnmount
  useEffect(() => {
    return () => {
      console.log('componentWillUnmount');
    };
  }, []);

  usePerformanceEffect();

  const formContentProps = {
    form,
    showItems,
    labelCol,
    colSpan,
    formUpdateTime: updateState.formUpdateTime,
    numberToString,
  };

  return (
    <Form {...restProps} form={form} onValuesChange={onStoreChange}>
      <AppFormLayout {...formContentProps} />
      {typeof afterFormDOM === 'function'
        ? afterFormDOM({
          form,
        })
        : afterFormDOM}
      <div className={footerClassName}>
        {submitButton ? (
          <Button {...submitButton} type={type} onClick={handSubmit}>
            {text || '保存'}
          </Button>
        ) : null}
        {children}
      </div>
    </Form>
  );
}

export default memo(AppForm);
