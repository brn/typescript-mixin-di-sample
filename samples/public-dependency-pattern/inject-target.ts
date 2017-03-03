import {
  Deps1
} from './deps1';
import {
  Deps2
} from './deps2';
import {
  Deps1Deps2Module
} from './deps1+deps2-module';


export class InjectTarget implements Deps1Deps2Module {
  public deps1: Deps1;
  public deps2: Deps2;

  public greet() {return `${this.deps1.hello()} ${this.deps2.world()}`}
}
