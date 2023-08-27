import React from "react";

import { IProps, IRow } from "./interface.d";

import { Toggle } from "@components/index";

import { helpers } from '@utils/index'

import "./index.less";

export default (props: IProps) => {
  const { detail, rowData, col = 1, nameAndLabelAllRow = false } = props;

  const renderContent = (rows: IRow[]) => {
    return (
      <div className={`${col === 1 ? '' : "mb-content"}`}>
        {rows.map((item) => {
          let { name, label, children = [], type, data = [], afterDOM, nameAndLabelRow, beforeDOM, placeholder } = item;
          if (typeof label === 'function') {
            label = label(detail);
          }
          let value = detail[name];

          if (type === 'select') {
            value = (data.find((item) => String(item.value) === String(value)) || {}).label
          }

          if (typeof afterDOM === 'function') {
            afterDOM = afterDOM(detail)
          }

          if (typeof beforeDOM === 'function') {
            beforeDOM = beforeDOM(detail)
          }

          if (typeof placeholder === 'function') {
            placeholder = placeholder(detail)
          }



          if (item.render && typeof item.render === "function") {
            value = item.render(detail, item.name);
          }

          let isTwoRow = nameAndLabelAllRow;
          if (nameAndLabelRow !== undefined) {
            isTwoRow = nameAndLabelRow
          }

          return (
            <div className={helpers.reactClassNameJoin(['detail-item', `detail-item-${name}`, col === 1 ? 'flex-1' : ''])} key={name}>
              <div className={helpers.reactClassNameJoin(['detail-item-content', isTwoRow ? 'detail-item-flex' : ''])}>
                <Toggle isShow={!!label}>
                  <span className={`detail-item-label detail-item-label-${name}`}>
                    {label}
                  </span>
                </Toggle>
                <span className={`detail-item-name detail-item-name-${name}`}>
                  <Toggle isShow={value !== undefined && value !== null} >
                    <span>{beforeDOM}</span>
                    <span>{value}</span>
                    <span className='detail-item-afterDom'>{afterDOM}</span>
                  </Toggle>

                  <Toggle isShow={value === undefined || value === null}>
                    <span>{placeholder}</span>
                  </Toggle>
                </span>
              </div>

              <Toggle isShow={Array.isArray(children) && children.length > 0}>
                <div className="detail-item-children">
                  {renderContent(children)}
                </div>
              </Toggle>

            </div>
          );
        })}
      </div>
    );
  };

  const rows = helpers.dyadicArray(rowData, col);

  return (
    <div className='mb-detail'>
      {
        rows.map((rowArr: IRow[], index: number) => {
          return <div key={String(index)} className={`row-item row-item-${index}`}>{renderContent(rowArr)}</div>
        })
      }
    </div>
  )
};
