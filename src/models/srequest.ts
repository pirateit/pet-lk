import { Association, DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/sequelize';
import User from './user';
import Service from './service';

interface SrequestAttributes {
  id: number;
  userId: number;
  serviceId: number;
  count: number;
  cost: number;
  total: number;
  scheduledTime: Date;
  comment: string;
  status: number;
  specialistId: number;
}

interface SrequestCreationAttributes extends Optional<SrequestAttributes, "id" | "count"> { }

class Srequest extends Model<SrequestAttributes, SrequestCreationAttributes>
  implements SrequestAttributes {
  public id!: number;
  public userId!: number;
  public serviceId!: number;
  public count!: number;
  public cost!: number;
  public total!: number;
  public scheduledTime!: Date;
  public comment!: string;
  public status!: number;
  public specialistId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly service?: Service;
  public readonly specialist?: User;
  public readonly user?: User;

  public static associations: {
    service: Association<Srequest, Service>;
    specialist: Association<Srequest, User>;
    user: Association<Srequest, User>;
  }
}

Srequest.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  cost: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  scheduledTime: {
    type: DataTypes.DATE,
  },
  comment: {
    type: new DataTypes.STRING,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  specialistId: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'requests',
  sequelize
});

export default Srequest;
