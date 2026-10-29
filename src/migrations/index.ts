import * as migration_20261028_174825_initial from './20261028_174825_initial';

export const migrations = [
  {
    up: migration_20261028_174825_initial.up,
    down: migration_20261028_174825_initial.down,
    name: '20261028_174825_initial'
  },
];
