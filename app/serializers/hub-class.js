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
      hash.locationAddressLine1 = hash.location.address.line1;
      hash.locationAddressLine2 = hash.location.address.line2;
      hash.locationAddressCity = hash.location.address.city;
      hash.locationAddressState = hash.location.address.state;
      hash.locationAddressZipcode = hash.location.address.zipcode;
      hash.locationAddressDirections = hash.location.address.directions;
      hash.geoLat = hash.location.geo.coordinates[0];
      hash.geoLng = hash.location.geo.coordinates[1];
      delete hash.location;
    }

    return this._super(...arguments);
  }
});
