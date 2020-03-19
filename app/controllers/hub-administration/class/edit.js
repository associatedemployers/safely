import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { organizations, states } from 'safely/config/statics';
import moment from 'moment';

export default class HubAdministrationClassEditController extends Controller {
  @service data
  orgs = organizations
  states = states

  quillOptions = {
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
  changeClassInformationSet (e) {
    const value = e.target.value;

    if (!value) {
      this.model.classInformation = this.pendingClassInfoRecord || this.store.createRecord('hub-class-information');
      return;
    }

    this.pendingClassInfoRecord = this.model.classInformation.get('isNew') ? this.model.get('classInformation').content : this.pendingClassInfoRecord;
    this.model.classInformation = this.classes.findBy('id', value);
  }

  @action
  changeInstructor (e) {
    const value = e.target.value;

    if (!value) {
      this.model.instructor = this.pendingInstructorRecord || this.store.createRecord('hub-instructor');
      return;
    }

    this.pendingInstructorRecord = this.model.instructor.get('isNew') ? this.model.get('instructor').content : this.pendingInstructorRecord;
    this.model.instructor = this.instructors.findBy('id', value);
  }

  @action
  fillLocation (e) {
    const value = e.target.value;

    if (!value) {
      return;
    }

    this.selectedFillLocation = value;

    const location = this.recentLocations.findBy('id', value);

    if (!location) {
      return;
    }

    const { id, ...setLoc } = location; // eslint-disable-line
    this.model.setProperties(setLoc);
    this.selectedFillLocation = null;
  }

  @action
  addTimeBlock () {
    this.model.times.addObject({});
  }

  @action
  removeTimeBlock (o) {
    this.model.times.removeObject(o);
  }

  @action
  async save () {
    const { success, error } = this.data.createStatus('saveClass', true),
          model = this.model,
          newClassInfo = model.classInformation.get('isNew'),
          newInstructor = model.instructor.get('isNew');

    const modelsToSave = [];

    if (newClassInfo || model.classInformation.get('hasDirtyAttributes')) {
      let cl = model.classInformation,
          invalid = this.data._validateModel(cl, [
            'name',
            'description'
          ]);

      if (invalid) {
        return error(`You must specify these fields for a new class information set: ${invalid.join(', ')}`);
      }

      modelsToSave.push(cl);
    }

    if (newInstructor) {
      let ins = model.instructor,
          invalid = this.data._validateModel(ins, [
            'displayName',
            'organization'
          ]);

      if (invalid) {
        return error(`You must specify these fields for a new instructor: ${invalid.join(', ')}`);
      }

      modelsToSave.push(ins);
    }

    const modelInvalid = this.data._validateModel(model, [
      'organization'
    ]);

    if (modelInvalid) {
      return error(`You must specify these fields: ${modelInvalid.join(', ')}`);
    }

    const invalidTimeBlocks = model.times.filter((t) => {
      return !t.start || !t.end || moment(t.start).isAfter(t.end);
    });

    if (invalidTimeBlocks.length) {
      return error('Your class record contains invalid time blocks. Please review and try again.');
    }

    modelsToSave.push(model);

    for (let i = 0; i < modelsToSave.length; i++) {
      const record = modelsToSave[i];

      try {
        await (record.content || record).save();
      } catch (err) {
        error(err);
        return;
      }
    }

    success('Successfully edited class.');
    this.transitionToRoute('hub-administration.index');
  }
}
