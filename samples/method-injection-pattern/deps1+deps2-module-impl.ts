import {
  Deps1Deps2Module
} from './deps1+deps2-module';
import {
  Deps1Impl
} from './deps1';
import {
  Deps2Impl
} from './deps2';

type Constructor<T> = new(...args: any[]) => T;

export function Deps1Deps2ModuleImpl<T extends Constructor<Deps1Deps2Module>>(Base: T) {
  return class extends Base {
    constructor(...a) {
      super(...a);
      this.__setDependencies({deps1: new Deps1Impl(), deps2: new Deps2Impl()});
    }
  };
}
