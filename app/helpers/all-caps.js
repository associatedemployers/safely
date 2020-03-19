import { helper as buildHelper } from '@ember/component/helper';

export function allCaps([text]/*, hash*/) {
  return text ? text.toUpperCase() : text;
}

export default buildHelper(allCaps);
