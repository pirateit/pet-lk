import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/sequelize';

interface ServiceAttributes {
  id: number;
  category: number;
  name: string;
  unit: string;
  cost: number;
}

interface ServiceCreationAttributes extends Optional<ServiceAttributes, "id"> { }

class Service extends Model<ServiceAttributes, ServiceCreationAttributes>
  implements ServiceAttributes {
  public id!: number;
  public category!: number;
  public name!: string;
  public unit!: string;
  public cost!: number;
}

Service.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  category: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
  },
  unit: {
    type: DataTypes.STRING(4),
    allowNull: false,
  },
  cost: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'services',
  timestamps: false,
  sequelize
});

export default Service;
