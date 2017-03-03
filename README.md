## What's this?

Sample implementaions fro Dependency Injection of typescript > 2.2.0


### Public Dependency Pattern

Inject dependency to public property.

#### Implementations

```typescript
// deps1.ts

export interface Deps1 {
  hello(): string;
}

export class Deps1Impl implements Deps1 {
  public hello() {return 'hello'}
}


// deps2.ts

export interface Deps2 {
  world(): string;
}

export class Deps2Impl implements Deps2 {
  public world() {return 'world'}
}


// deps1+deps2-module.ts

import {
  Deps1
} from './deps1';
import {
  Deps2
} from './deps2';

export interface Deps1Deps2Module {
  deps1: Deps1;
  deps2: Deps2;
}


// deps1+deps2-module-impl.ts

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
      this.deps1 = new Deps1Impl();
      this.deps2 = new Deps2Impl();
    }
  };
}


// inject-target.ts
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


// injected.ts

import {
  InjectTarget
} from './inject-target'
import {
  Deps1Deps2ModuleImpl
} from './deps1+deps2-module-impl';


export class Injected extends Deps1Deps2ModuleImpl(InjectTarget) {
}


// main.ts

import {
  Injected
} from './injected';


const injected = new Injected();
console.log(injected.greet());

```

**deps1.ts deps2.ts**

Normal dependency classes.

**deps1+deps2-module.ts**

Interface for injected class.  
Injected class must be implements this interface.

**deps1+deps2-module-impl.ts**

Function which inject dependencies.

**inject-target.ts**

Class that injected dependencies.  
This class is plain typescript class except implements `interface Deps1Deps2Module`.

**injected.ts**

Class which extends dependencies injected class.

**main.ts**

Entry point.

#### Cons

This pattern have to implements public property.
So this pattern breaking encapsulation.

### Method Injection Pattern

This pattern improve above pattern,  
instead of inject dependency to public method directly, use public setter method.

**Implementations**

```typescript
// deps1+deps2-module.ts

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


// deps1+deps2-module-impl.ts

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


// inject-target.ts

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
  private deps1: Deps1;
  private deps2: Deps2;

  public greet() {return `${this.deps1.hello()} ${this.deps2.world()}`}

  public __setDependencies({deps1, deps2}) {
    this.deps1 = deps1;
    this.deps2 = deps2;
  }
}

```

#### Changes

**deps1+deps2-module.ts**

encapsulate properties by implements `__setDependencies`.

**deps1+deps2-module-impl.ts**

Pass dependencies to `__setDependecies`.

**inject-target.ts**

Implements `__setDependencies`.

#### Cons

`__setDependencies` is public method too.


### Try

```shell
git clone https://github.com/brn/typescript-mixin-di-sample.git
cd typescript-mixin-di-sample
npm install
gulp
gulp serve
open 'https://localhost:8181/'
```
