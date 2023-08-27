import transformItemsInitialValue from '../transformItemsInitialValue';

describe('AppForm.utils.transformItemsInitialValue', () => {
  test('当第二个参数initialValues属性值为undefined，不删除对应name的initialValue', () => {
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

    transformItemsInitialValue(myFormItems, { number: undefined })

    expect(myFormItems).toEqual([
      {
        name: 'bar',
        initialValue: 'bar',
      },
      {
        name: 'number',
        initialValue: 1,
      },
    ]);
  })

  test('当传入第 2 参数initialValues个时，会删除 item 中对应 name 的 initialValue', () => {
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
    const curInitValues = {
      bar: 1,
    }
    transformItemsInitialValue(myFormItems, curInitValues);

    expect(myFormItems).toEqual([
      {
        name: 'bar',
      },
      {
        name: 'number',
        initialValue: 1,
      },
    ]);
  })

  test('当传入第 3 参数为true, 只转换 initialValues 未定义的值', () => {
    const myFormItems = [
      {
        name: 'bar',
        initialValue: 22,
      },
      {
        name: 'number',
        initialValue: 1,
      },
    ];
    const curInitValues = {
      bar: 1,
    }
    transformItemsInitialValue(myFormItems, curInitValues, true);

    expect(myFormItems).toEqual([
      {
        name: 'bar',
      },
      {
        name: 'number',
        initialValue: '1',
      },
    ]);
  })
});
