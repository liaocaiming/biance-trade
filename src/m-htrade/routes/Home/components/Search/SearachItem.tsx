import React, { memo, useState, useEffect, useCallback } from 'react';
import './searchItem.less';
import { Picker } from 'antd-mobile'

interface IList {
  value: string;
  label: React.ReactNode | string;
}

export interface SearchItemProps {
  name: string;
  value?: string[];
  options: IList[];
  onChange?: (values: any) => void;
}


export default memo((props: SearchItemProps) => {
  const { options = [], value = [], name, onChange } = props;
  const [val, setVal] = useState<string[]>([])
  const [label, setLabel] = useState<any>()
  useEffect(() => {
    let v:any = value || [];
    if (typeof v === 'string') {
      v = v.split(',') || [];
    }
    if (v.toString() !== val.toString()) {
      setVal(v);
      const selectedLabel = options.filter((item) => v.includes(item.value)).map((item) => item.label);
      setLabel(selectedLabel && selectedLabel.toString() || '')
    }

  }, [value, options])

  const onPickerChange = useCallback(
    (val: string[]) => {
      const selectedLabel = options.filter((item) => val.includes(item.value)).map((item) => item.label);
      setLabel(selectedLabel && selectedLabel.toString());
      setVal(val);
      onChange && onChange({
        [name]: val.toString()
      })
    },

    [val, label, onChange]
  )

  return (
    <Picker data={options} cols={1} value={val} onChange={onPickerChange}>
      <div className="search-item btn"><span className="text">{label || options[0].label}</span></div>
    </Picker>
  )
})