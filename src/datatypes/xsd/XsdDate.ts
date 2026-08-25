import XsdAnySimpleType from './XsdAnySimpleType';

/**
 *
 * xsd:date
 * The type xsd:date represents a Gregorian calendar date in the format CCYY-MM-DD where CC represents the century, YY the year,
 * MM the month and DD the day. No left truncation is allowed for any part of the date. To represent years later than 9999,
 * additional digits can be added to the left of the year value, but extra leading zeros are not permitted. To represent years
 * before 0001, a preceding minus sign ("-") is allowed. The year 0000 is not a valid year in the Gregorian calendar.
 *
 * An optional time zone expression may be added at the end. The letter Z is used to indicate Coordinated Universal Time (UTC).
 * All other time zones are represented by their difference from Coordinated Universal Time in the format +hh:mm, or -hh:mm.
 * These values may range from -14:00 to 14:00. For example, US Eastern Standard Time, which is five hours behind UTC, is represented as -05:00.
 * If no time zone value is present, it is considered unknown; it is not assumed to be UTC.
 * More info http://www.datypic.com/sc/xsd/t-xsd_date.html
 */
/** CCYY-MM-DD with an optional timezone; a leading minus for years before 0001. */
const DATE = /^-?\d{4,}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)?$/;

export default class XsdDate extends XsdAnySimpleType {
  constructor(content: string, attributtes?: any) {
    super(content, attributtes);
    this.validateContent();
  }

  validateContent(): void {
    if (this.content === '') return; // unset; cardinality is not this class's job
    if (typeof this.content !== 'string' || !DATE.test(this.content)) {
      throw new Error(`invalid xsd:date '${String(this.content)}'; expected CCYY-MM-DD with optional timezone`);
    }
  }
}
