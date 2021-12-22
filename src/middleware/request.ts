interface Status {
  name: string;
  className: string;
}

export const statusColor = (status: number): Status => {
  switch (status) {
    case 1: {
      return {
        name: 'В обработке',
        className: 'request__status_waiting'
      };
    }
    case 2: {
      return {
        name: 'Выполняется',
        className: 'request__status_active'
      };
    }
    case 3: {
      return {
        name: 'Завершено',
        className: 'request__status_success'
      };
    }
    case 9: {
      return {
        name: 'Отменено',
        className: 'request__status_cancelled'
      };
    }
    default: {
      return {
        name: 'Отменено',
        className: 'request__status_cancelled'
      };
    }
  }
};
