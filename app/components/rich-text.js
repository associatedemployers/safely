import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class RichTextComponent extends Component {
  options = {
    theme:   'snow',
    modules: {
      toolbar: [
        [{ header: [ 2, 3, 4, false ] }],
        [ 'bold', 'italic', 'underline', 'strike' ],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [ 'link' ],
        [ 'clean' ]
      ]
    }
  }

  @action
  updateText (editor) {
    this.args.onChange(editor.root.innerHTML);
  }
}
