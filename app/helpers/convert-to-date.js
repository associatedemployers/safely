import { helper as buildHelper } from '@ember/component/helper';

export function convertToDate ([ dateStr ]) {
  return moment(dateStr).format('YYYY-MM-DDTHH:mm');
}

export default buildHelper(convertToDate);
