import getRestProps from '../getRestProps';

describe('AppForm.utils.getRestProps', () => {
  const defObj = {
    a: '1',
    b: 1,
    c: null,
  };
  test('所有的操作，不影响原对象', () => {
    expect(getRestProps(defObj, ['a'])).toEqual({
      b: 1,
      c: null,
    });
    expect(defObj).toEqual({
      a: '1',
      b: 1,
      c: null,
    });
    expect(getRestProps(defObj, [])).toEqual(defObj);
    expect(defObj).toEqual({
      a: '1',
      b: 1,
      c: null,
    });
  });

  test('当传入单个 key 时，能正常获取剩余的属性', () => {
    expect(getRestProps(defObj, ['a'])).toEqual({
      b: 1,
      c: null,
    });
  });
  test('当传入多个key时，能正常获取剩余的属性', () => {
    expect(getRestProps(defObj, ['a', 'c'])).toEqual({
      b: 1,
    });
  });
  test('当不传入key时，直接返回当前对象不做任何处理', () => {
    expect(getRestProps(defObj, [])).toBe(defObj);
  });
});
