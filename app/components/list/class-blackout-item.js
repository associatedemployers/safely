import Component from '@ember/component';

let ClassBlackoutItemComponent =  Component.extend({
  tagName: 'tr',

  actions: {
    delete () {
      this.get('onDelete')(this.get('model'));
    }
  }
});

ClassBlackoutItemComponent.reopenClass({
  positionalParams: [ 'model' ]
});

export default ClassBlackoutItemComponent;
