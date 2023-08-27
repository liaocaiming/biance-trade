import normalizeFormInitialValues from '../normalizeFormInitialValues';

import { AppFormItemOptions } from '../../interface.d';

describe('AppForm 初始值处理的工具函数 #normalizeFormInitialValues ', () => {
  const initialValues = {
    foo: 'foo',
  };
  const formItems: AppFormItemOptions[] = [
    {
      name: 'foo',
    },
    {
      name: 'bar',
      initialValue: 'bar',
    },
    {
      name: 'number',
      initialValue: 1,
    },
  ];
  test('把所有的初始值，合并到一个对象，默认不改变初始值类型', () => {
    expect(normalizeFormInitialValues(formItems, initialValues)).toEqual({
      foo: 'foo',
      bar: 'bar',
      number: 1,
    });
  });

  test('通过 numberToString 配置，可以把所有 number 类型初始值变为 string', () => {
    expect(
      normalizeFormInitialValues(
        [
          {
            name: 'bar',
            initialValue: 'bar',
          },
          {
            name: 'number',
            initialValue: 1,
          },
        ],
        {
          foo: 'foo',
          toString: 12,
        },
        true
      )
    ).toEqual({
      foo: 'foo',
      bar: 'bar',
      number: '1',
      toString: '12',
    });
  });

  test('当 formItems 与 initialValues 都定义了同一个 name 的 initialValue，以 formItems 中值为主', () => {
    expect(
      normalizeFormInitialValues(
        [
          {
            name: 'foo',
            initialValue: 'useMe',
          },
          {
            name: 'bar',
            initialValue: 'bar',
          },
          {
            name: 'number',
            initialValue: 1,
          },
        ],
        {
          foo: 'foo',
        }
      )
    ).toEqual({
      foo: 'useMe',
      bar: 'bar',
      number: 1,
    });
  });

  test('删除 formItems 每一项的 initialValue 属性，把值提升到新的初始值对象中', () => {
    const myFormItems = [
      {
        name: 'bar',
        initialValue: 'bar',
      },
      {
        name: 'number',
        initialValue: 1,
      },
    ];

    expect(
      normalizeFormInitialValues(myFormItems, {
        toString: 12,
      })
    ).toEqual({
      bar: 'bar',
      number: 1,
      toString: 12,
    });

    expect(myFormItems).toEqual([
      {
        name: 'bar',
      },
      {
        name: 'number',
      },
    ]);
  });
});
