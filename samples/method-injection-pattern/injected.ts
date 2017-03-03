import {
  InjectTarget
} from './inject-target'
import {
  Deps1Deps2ModuleImpl
} from './deps1+deps2-module-impl';


export class Injected extends Deps1Deps2ModuleImpl(InjectTarget) {
}
