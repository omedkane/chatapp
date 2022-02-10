export enum DateUnit {
  TWO_DAY = 10368000000,
  ONE_DAY = 5184000000,
  ONE_HOUR = 3600000,
  ONE_MINUTE = 60000,
}
export abstract class DateTime {
  /**
   * Returns a message saying how long since `date`
   */
  static since = (date: Date): string | boolean => {
    const timestamp = date.getTime();
    const now = Date.now();
    const period = now - timestamp;

    const plural = (x: number) => (x > 1 ? "s" : "");

    if (period < DateUnit.ONE_MINUTE) return "Just now";
    // - Less than an hour ago
    else if (period < DateUnit.ONE_HOUR) {
      const minutes = ~~(period / DateUnit.ONE_MINUTE);

      const s = plural(minutes);
      const message = `${minutes} min${s} ago`;
      return message;
      // - Less than a day ago
    } else if (period < DateUnit.ONE_DAY) {
      const hours = ~~(period / DateUnit.ONE_HOUR);

      const s = plural(hours);
      const message = `${hours} hour${s} ago`;
      return message;
      // - Just return the date if it is more than a day
    } else if (period < DateUnit.TWO_DAY) return "Yesterday";
    // - Too old
    else return false;
  };

  static getTimestamp = (date: Date | number): number => {
    return date instanceof Date ? date.getTime() : date;
  };
  static getDate = (date: Date | number): Date => {
    type PO = { 123: 87 };
    DateTime.groupByDate<PO>([{ 123: 87 }], "string");
    return date instanceof Date ? date : new Date(date);
  };

  static isLessThan = (unit: DateUnit, date: Date | number): boolean =>
    DateTime.getTimestamp(date) > unit;

  static groupByDate = <T extends { [key: string]: any }>(
    collection: T[],
    property: string,
    dateFormatter?: (date: string) => string
  ) => {
    type GroupedbyDateMap = {
      [key: string]: T[];
    };
    const groupMap: GroupedbyDateMap = {};

    collection.forEach((item) => {
      if (item.hasOwnProperty(property)) {
        let date = DateTime.getDate(item[property]).toDateString();
		
        if (dateFormatter !== undefined && dateFormatter !== null) {
          date = dateFormatter(date);
        }
        groupMap[date] ??= [];
        groupMap[date].push(item);
      }
    });

    return groupMap;
  };
}
