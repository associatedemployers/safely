import Mixin from '@ember/object/mixin';

export default Mixin.create({
  actions: {
    refresh () {
      this.refresh();
    }
  }
});
