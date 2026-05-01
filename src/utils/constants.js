export const STORAGE_KEY = '@agenda_tasks';

export const PRIORITIES = {
  Alta: {
    label: 'Alta',
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    icon: '!',
  },
  Media: {
    label: 'Media',
    color: '#92400e',
    backgroundColor: '#fef3c7',
    icon: '=',
  },
  Baja: {
    label: 'Baja',
    color: '#166534',
    backgroundColor: '#dcfce7',
    icon: '-',
  },
};

export const PRIORITY_OPTIONS = Object.keys(PRIORITIES);

export const STATUS_OPTIONS = ['No iniciada', 'En proceso', 'Finalizada'];

export const FILTER_OPTIONS = ['Todas', ...STATUS_OPTIONS];
