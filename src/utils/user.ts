export interface Role {
  id: number;
  name: string
}

export const userRole = (role: number): Role => {
  switch (role) {
    case 1: {
      return { id: role, name: 'Администратор' };
    }
    case 2: {
      return { id: role, name: 'Специалист' };
    }
    case 3: {
      return { id: role, name: 'Клиент' };
    }
    default: {
      return { id: role, name: 'Клиент' };
    }
  }
};
