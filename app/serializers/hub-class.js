import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  normalize (modelName, hash) {
    if (hash.price) {
      hash.memberPrice = hash.price.member;
      hash.nonMemberPrice = hash.price.nonMember;
      hash.memberAddParticipantsPrice = hash.price.memberAddParticipants;
      hash.nonMemberAddParticipantsPrice = hash.price.nonMemberAddParticipants;
      delete hash.price;
    }

    if (hash.location) {
      hash.locationName = hash.location.name;

      if (hash.location.address) {
        hash.locationAddressLine1 = hash.location.address.line1;
        hash.locationAddressLine2 = hash.location.address.line2;
        hash.locationAddressCity = hash.location.address.city;
        hash.locationAddressState = hash.location.address.state;
        hash.locationAddressZipcode = hash.location.address.zipcode;
        hash.locationAddressDirections = hash.location.address.directions;
      }

      if ((hash.location.geo || {}).coordinates) {
        hash.geoLat = hash.location.geo.coordinates[0];
        hash.geoLng = hash.location.geo.coordinates[1];
      }

      delete hash.location;
    }

    return this._super(...arguments);
  },

  serialize () {
    let json = this._super(...arguments);

    json.price = {
      member:                   json.memberPrice,
      nonMember:                json.nonMemberPrice,
      memberAddParticipants:    json.memberAddParticipantsPrice,
      nonMemberAddParticipants: json.nonMemberAddParticipantsPrice
    };

    delete json.memberPrice;
    delete json.nonMemberPrice;
    delete json.memberAddParticipantsPrice;
    delete json.nonMemberAddParticipantsPrice;

    json.location = {
      name:    json.locationName,
      address: {
        line1:      json.locationAddressLine1,
        line2:      json.locationAddressLine2,
        city:       json.locationAddressCity,
        state:      json.locationAddressState,
        zipcode:    json.locationAddressZipcode,
        directions: json.locationAddressDirections
      }
    };

    delete json.locationName;
    delete json.locationAddressLine1;
    delete json.locationAddressLine2;
    delete json.locationAddressCity;
    delete json.locationAddressState;
    delete json.locationAddressZipcode;
    delete json.locationAddressDirections;

    return json;
  }
});
