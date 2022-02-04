export interface ServiceCategory {
  id: number;
  name: string
}

export const getCategories = () => {
  return [
    { id: 0, name: 'Другие' },
    { id: 1, name: 'Компьютеры' },
    { id: 2, name: 'Программы' },
    { id: 3, name: 'Сети' },
    { id: 4, name: 'Видеонаблюдение' }
  ];
};

export const getUnits = () => {
  return [
    'усл',
    'м',
    'шт'
  ];
}

export const serviceCategory = (category: number): ServiceCategory => {
  switch (category) {
    case 0: {
      return { id: category, name: 'Другие' };
    }
    case 1: {
      return { id: category, name: 'Компьютеры' };
    }
    case 2: {
      return { id: category, name: 'Программы' };
    }
    case 3: {
      return { id: category, name: 'Сети' };
    }
    case 4: {
      return { id: category, name: 'Видеонаблюдение' };
    }
    default: {
      return { id: category, name: 'Другие' };
    }
  }
};
