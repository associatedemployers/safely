import Ember from 'ember';

const inflector = new Ember.Inflector(Ember.Inflector.defaultRules);

export function inflectText([text, length]) {
  return length && length === 1 ? inflector.singularize(text) : inflector.pluralize(text);
}

export default Ember.Helper.helper(inflectText);
/*
  Usage
  ---
  You have {{employees.length}} {{inflect-text 'Employee' employees.length}}!
    -> Given employees.length is 0 or >1
    "You have 0 Employees!"
    -> Given employees.length is 1
    "You have 1 Employee!"

  Note: Preserves case
 */
