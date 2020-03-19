import { helper } from '@ember/component/helper';

export default helper(function displayCurrency ([ price ]/*, hash*/) {
  return isNaN(price) ? price : `$${price}`.replace(/(\d*)(\d{2})/, '$1.$2');
});
