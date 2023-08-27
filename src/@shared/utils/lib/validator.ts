/* 
parmas: 需要校验的数据
arr： 校验规则
*/

export interface IRule {
  required?: boolean;
  message: string;
  pattern?: RegExp;
  max?: number;
  min?: number;
}

export interface IValue {
  rules?: IRule[];
  name: string;
  [key: string]: any;
}

export default (parmas: object, arr: IValue[]): Promise<IRule> => {
  return new Promise((resolve) => {
    const map = {};
    arr.forEach((item) => {
      const { name, rules } = item;
      map[name] = rules;
    })

    let ruleItem: any = null;
    Object.keys(map).some((key) => {
      const rules: IRule[] = map[key] || [];
      const value = parmas[key];
      return rules.some((rule) => {
        let isError = false;
        const { required, pattern, max, min } = rule;
        const isEmpty = value === '' || value === undefined || value === null || (Array.isArray(value) && value.length === 0)
        if (required && isEmpty) {
          isError = true;
        }

        if (!isEmpty && pattern && !pattern.test(value)) {
          isError = true;
        }

        if (max !== undefined && value && value.length > max) {
          isError = true;
        }

        if (min !== undefined && value && value.length < min) {
          isError = true;
        }

        if (isError) {
          ruleItem = rule;
        }
        return isError;
      })
    })

    resolve(ruleItem)
  })
}