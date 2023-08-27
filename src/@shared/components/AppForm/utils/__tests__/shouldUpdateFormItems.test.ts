import { getShowFormItems } from '../shouldUpdateFormItems';

import { AppFormItemOptions } from '../../interface.d';

describe('AppForm.utils.shouldUpdateFormItems', () => {
  const formData = {
    a: '1',
    bar: '232'
  };
  const formItems: AppFormItemOptions[] = [
    {
      name: 'foo',
      isShow: data => {
        return data.a !== '1';
      },

      formItems: [
        {
          name: 'foo.aa',
          isShow: data => {
            return data.bar !== '232'
          }
        },
      ],
    },
    {
      name: 'show',
    },
  ];

  test('formItems 列表中任何 isShow 计算后结果值的变化，都能体现在 shouldUpdate', () => {
    expect(getShowFormItems('updateForm', formData, formItems).shouldUpdate).toBeTruthy();
    expect(getShowFormItems('updateForm', formData, formItems).shouldUpdate).toBeFalsy();
    expect(getShowFormItems('updateForm', {
      ...formData,
      a: 1
    }, formItems).shouldUpdate).toBeTruthy();
  });

  test('能正常过滤掉一级不需要显示的项', () => {
    expect(getShowFormItems('show', formData, formItems).showItems).toEqual([
      {
        name: 'show',
      },
    ]);
  });

  test('formItem 下的二级 formItems 不需要过滤，AppFormItem 组件会自行处理', () => {
    const formData = {
      a: '13',
      bar: '232'
    };
    expect(getShowFormItems('show', formData, formItems).showItems).toEqual(formItems);
  });
});
