import { SubmitButton } from './interface.d';

export const customAppFormProps = [
  'submitButton',
  'children',
  'footerClassName',
  'afterFormDOM',
  'onReady',
  'formItems',
  'beforeSubmit',
  'colSpan',
  'numberToString',
  'shouldFormUpdate',
  'updateStore',
  'footerStyle'
];

export const defaultSubmitButton: SubmitButton = {
  type: 'default',
  text: '保存',
};
