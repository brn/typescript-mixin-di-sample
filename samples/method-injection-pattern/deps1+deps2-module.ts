import {
  Deps1
} from './deps1';
import {
  Deps2
} from './deps2';

export interface Dependencies {
  deps1: Deps1;
  deps2: Deps2;
}

export interface Deps1Deps2Module {
  __setDependencies(deps: Dependencies): void;
}
