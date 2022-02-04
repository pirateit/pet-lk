import { Association, DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/sequelize';
import Srequest from './srequest';

interface UserAttributes {
  id: number;
  firstName: string | null;
  role: number;
  phoneNumber: number;
  discount: number;
  password: string;
  isActive: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "firstName" | "role" | "discount" | "isActive"> { }

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id: number;
  public firstName: string | null;
  public role!: number;
  public phoneNumber!: number;
  public discount!: number;
  public password!: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;

  declare readonly requests?: Srequest[];

  declare static associations: {
    requests: Association<User, Srequest>;
  };

  public async isValidPassword(password: string): Promise<boolean> {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: new DataTypes.STRING(32),
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "users",
    updatedAt: false,
    sequelize,
  }
);

User.beforeSave(async (user) => {
  if (user.password) {
    const hash = await bcrypt.hash(user.password, 10);

    user.password = hash;
  }
});

export default User;
