import getChangeStore from '../getChangeStore';

describe('AppForm.utils.getChangeStore', () => {
  test('不传任何参数，直接返回 null', () => {
    expect(getChangeStore({})).toBe(null);
  });

  test('只传参数 prev，不传 next，直接返回 null', () => {
    expect(getChangeStore({ prev: {} })).toBe(null);
  });

  test('当传入 prev 与 next时，能取到 next 新增加的且值不是 undefined 的 key 的对象', () => {
    expect(getChangeStore({ prev: { b: 1 }, next: { a: 1, b: 1, c: undefined } })).toEqual({ a: 1 });
  });

  test('当传入 prev 与 next时，能取到 next 值改变且值不是 undefined 的 key', () => {
    expect(getChangeStore({ prev: { b: 1, c: 1 }, next: { b: 2, c: undefined } })).toEqual({ b: 2 });
  });

  test('当传入 prev 与 next 时，能取到 next 值改变且值不是 undefined 的 key', () => {
    expect(getChangeStore({ prev: { b: 1, c: 1 }, next: { b: 2, c: undefined } })).toEqual({ b: 2 });
  });
});
