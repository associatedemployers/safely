import Ember from 'ember';

const { Helper: { helper } } = Ember;

export function relativeGreetingTime() {
  const hour = new Date().getHours();
  return hour >= 0 && hour < 12 ? 'morning' : hour >= 12 && hour < 17 ? 'afternoon' : 'evening';
}

export default helper(relativeGreetingTime);
