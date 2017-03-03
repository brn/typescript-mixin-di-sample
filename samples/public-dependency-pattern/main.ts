import {
  InjectTarget
} from './inject-target';
import {
  Deps1Deps2ModuleImpl
} from './deps1+deps2-module-impl';


const injectTarget = new (Deps1Deps2ModuleImpl(InjectTarget));
console.log(injectTarget.greet());
