export interface Deps1 {
  hello(): string;
}

export class Deps1Impl implements Deps1 {
  public hello() {return 'hello'}
}
