import Component from '@ember/component';

let ClassItemComponent =  Component.extend({
  tagName: 'tr',

  actions: {
    delete () {
      this.get('onDelete')(this.get('class'));
    }
  }
});

ClassItemComponent.reopenClass({
  positionalParams: [ 'class' ]
});

export default ClassItemComponent;
