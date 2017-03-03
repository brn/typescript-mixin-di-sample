export interface Deps2 {
  world(): string;
}

export class Deps2Impl implements Deps2 {
  public world() {return 'world'}
}
