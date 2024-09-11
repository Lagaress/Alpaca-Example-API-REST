import moment, { DurationInputArg1, DurationInputArg2 } from 'moment';

export default class Time {
  private static readonly MILLISECONDS_TO_SECONDS = 1000;

  private readonly milliseconds: number;

  private constructor(milliseconds: number) {
    this.milliseconds = milliseconds;
  }

  public valueOf(): number {
    return this.milliseconds;
  }

  public valueOfSeconds() {
    return Math.round(this.milliseconds / Time.MILLISECONDS_TO_SECONDS);
  }

  public toUnix(): number {
    return moment.utc(this.valueOf()).unix();
  }

  public toDate(): Date {
    return moment.utc(this.valueOf()).toDate();
  }

  public format(format?: string): string {
    return moment.utc(this.valueOf()).format(format);
  }

  public toString(): string {
    return this.format();
  }

  public isAfter(time: Time): boolean {
    return moment.utc(this.valueOf()).isAfter(time.valueOf());
  }

  public isBefore(time: Time): boolean {
    return moment.utc(this.valueOf()).isBefore(time.valueOf());
  }

  public get isFuture(): boolean {
    return moment.utc().isBefore(this.valueOf());
  }

  public get isPast(): boolean {
    return !this.isFuture;
  }

  public get isToday(): boolean {
    return moment.utc().isSame(moment.utc(this.valueOf()), 'day');
  }

  public add(amount: DurationInputArg1, unit: DurationInputArg2): Time {
    return Time.from(moment.utc(this.valueOf()).add(amount, unit).valueOf());
  }

  public subtract(amount: DurationInputArg1, unit: DurationInputArg2): Time {
    return Time.from(moment.utc(this.valueOf()).subtract(amount, unit).valueOf());
  }

  public static from(milliseconds: number): Time {
    return new Time(milliseconds);
  }

  public static fromString(timestamp: string): Time {
    return Time.from(moment.utc(timestamp).valueOf());
  }

  public static timestamp(milliseconds?: number): Time {
    return milliseconds ? Time.from(milliseconds) : Time.now();
  }

  public static optional(milliseconds?: number): Time | null {
    return milliseconds ? Time.from(milliseconds) : null;
  }

  public static optionalFromString(timestamp?: string): Time | null {
    return timestamp ? Time.fromString(timestamp) : null;
  }

  public static fromSeconds(seconds: number): Time {
    return Time.from(seconds * Time.MILLISECONDS_TO_SECONDS);
  }

  public static now(): Time {
    return Time.from(moment.utc().valueOf());
  }
}
