interface Status {
  id: number;
  name: string;
  class: string;
}

export function getStatuses(): Object[] {
  var statuses = [{
      id: 1,
      name: 'В обработке',
    }, {
      id: 2,
      name: 'Выполняется',
    }, {
      id: 3,
      name: 'Завершено',
    }, {
      id: 9,
      name: 'Отменено',
    }];

  return statuses;
}

export const statusColor = (status: number): Status => {
  switch (status) {
    case 1: {
      return {
        id: 1,
        name: 'В обработке',
        class: 'status__waiting',
      };
    }
    case 2: {
      return {
        id: 2,
        name: 'Выполняется',
        class: 'status__active',
      };
    }
    case 3: {
      return {
        id: 3,
        name: 'Завершено',
        class: 'status__closed',
      };
    }
    case 9: {
      return {
        id: 9,
        name: 'Отменено',
        class: 'status__cancelled',
      };
    }
    default: {
      return {
        id: 9,
        name: 'Отменено',
        class: 'status__cancelled',
      };
    }
  }
};
