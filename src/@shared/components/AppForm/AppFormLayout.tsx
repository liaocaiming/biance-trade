import React, { memo } from 'react';
import { Row, Col } from 'antd';

import { AppFormLayoutProps } from './interface.d';
import { PureAppFormItem } from './AppFormItem';
import { createNamePathKey } from './utils';

export default function AppFormLayout(props: AppFormLayoutProps): React.ReactElement | null {
  const { colSpan = 1, form, labelCol: formLabelCol, showItems = [], numberToString, formUpdateTime } = props;

  if (!form) {
    return null;
  }

  return (
    <Row>
      {showItems.map((formItem, i) => {
        const { rowAlone, isTitle, title, labelCol, ...restItemProps } = formItem;
        const formColSpan = rowAlone ? 1 : colSpan;
        const itemColSpan = Math.floor(24 / formColSpan);
        let key = formItem.key || createNamePathKey(formItem.name);

        if (!key) {
          key = `title-${i}`;
        }

        // 标题单独渲染
        if (isTitle) {
          return (
            <Col className="form-legend" key={key} span={24}>
              {typeof title === 'function' ? title(form) : title}
            </Col>
          );
        }

        let newLabelCol = labelCol;

        // 独占行的，如果自己没有定义 formItemLayout, labelCol.span 要按列数比例缩小
        if (!labelCol && rowAlone) {
          if (formLabelCol && typeof formLabelCol.span === 'number') {
            newLabelCol = {
              span: Math.round(formLabelCol.span / colSpan),
            };
          }
        }

        // 避免传递非波尔类型，导致判断出错
        if (typeof numberToString === 'boolean' && typeof restItemProps.numberToString === 'undefined') {
          restItemProps.numberToString = numberToString;
        }

        return (
          <Col span={itemColSpan} key={key}>
            <PureAppFormItem {...restItemProps} updateTime={formUpdateTime} labelCol={newLabelCol} form={form} />
          </Col>
        );
      })}
    </Row>
  );
}

export const PureAppFormLayout = memo(AppFormLayout);
