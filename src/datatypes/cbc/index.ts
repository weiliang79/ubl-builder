/**
 * Common Basic Components that are more than a bare unqualified datatype.
 *
 * Most cbc elements need no class of their own: a params map names the element
 * (`cbc:ID`) and points its `classRef` at the udt class that carries the value
 * (`UdtIdentifier`). A handful of cbc types are declared in the schema in their
 * own right, and those live here.
 */
import { UBLVersionID, UBLVersionIDAttributes } from './UBLVersionID';

export { UBLVersionID, UBLVersionIDAttributes };
