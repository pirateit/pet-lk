import User from "./user";
import Srequest from "./srequest";
import Service from "./service";

function applyModelsAssociations() {
	User.hasMany(Srequest, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "requests",
  });

  Srequest.belongsTo(Service, { foreignKey: "serviceId", as: 'service'});
  Srequest.belongsTo(User, { foreignKey: "specialistId", as: 'specialist' });
  Srequest.belongsTo(User, { foreignKey: "userId", as: 'user' });
}

applyModelsAssociations();
