import ApplicationSerializer from './application';

export default class HubRegistrationSerializer extends ApplicationSerializer {
  normalize (modelName, hash) {
    if (hash.address) {
      hash.addressLine1 = hash.address.line1;
      hash.addressLine2 = hash.address.line2;
      hash.addressCity = hash.address.city;
      hash.addressState = hash.address.state;
      hash.addressZipcode = hash.address.zipcode;
      delete hash.address;
    }

    return super.normalize(...arguments);
  }

  serialize () {
    let json = super.serialize(...arguments);

    json.address = {
      line1:   json.addressLine1,
      line2:   json.addressLine2,
      city:    json.addressCity,
      state:   json.addressState,
      zipcode: json.addressZipcode
    };

    delete json.addressLine1;
    delete json.addressLine2;
    delete json.addressCity;
    delete json.addressState;
    delete json.addressZipcode;

    return json;
  }
}
