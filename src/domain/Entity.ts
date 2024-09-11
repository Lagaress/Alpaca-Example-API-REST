import Time from './primitives/Time';

const lookUpPropertyDescriptor = (object: unknown, key: string): PropertyDescriptor | undefined => {
  const propertyDescriptor = Object.getOwnPropertyDescriptor(object, key);
  if (propertyDescriptor) {
    return propertyDescriptor;
  }
  const prototype = Object.getPrototypeOf(object);
  if (!prototype) {
    return undefined;
  }
  if (prototype === Object.prototype) {
    return undefined;
  }
  return lookUpPropertyDescriptor(prototype, key);
};

export interface EntityParams<IdType = number> {
  id?: IdType;
  createdAt?: number | Time;
  updatedAt?: number | Time;
}

export default abstract class Entity<IdType = number> {
  public id?: IdType;
  public createdAt: Time;
  public updatedAt: Time;

  protected constructor(params: EntityParams<IdType>) {
    this.id = params.id;
    this.createdAt = params.createdAt instanceof Time ? params.createdAt : Time.timestamp(params.createdAt);
    this.updatedAt = params.updatedAt instanceof Time ? params.updatedAt : Time.timestamp(params.updatedAt);
  }

  public update(fragment: Partial<this>): void {
    this.updatedAt = Time.now();
    Object.keys(fragment).forEach(key => {
      if (fragment[key] !== undefined) {
        const propertyDescriptor = lookUpPropertyDescriptor(this, key);
        if (
          (propertyDescriptor?.enumerable && propertyDescriptor.writable) ||
          propertyDescriptor?.set
        ) {
          this[key] = fragment[key];
        }
      }
    });
  }
}
