'use strict';

import { UBLExtensionType, UBLExtensionTypeParams } from './UBLExtension';
import { UBLExtensions, UBLExtensionsParams } from './UBLExtensionsType';
import {
  AuthorizationProvider,
  AuthorizedInvoices,
  AuthorizedInvoicesParams,
  DianExtensions,
  DianExtensionsContent,
  DianExtensionsContentParams,
  DianExtensionsParams,
  InvoiceControl,
  InvoiceControlParams,
  InvoiceSource,
  SoftwareProvider,
  SoftwareProviderParams,
} from './customExtensionContents';

export {
  AuthorizationProvider,
  AuthorizedInvoices,
  AuthorizedInvoicesParams,
  // DIAN extensions
  // NOTICE: Dian Extensions are specific to Colombia and may not be applicable in other regions.
  DianExtensions,
  DianExtensionsContent,
  DianExtensionsContentParams,
  DianExtensionsParams,
  InvoiceControl,
  InvoiceControlParams,
  InvoiceSource,
  SoftwareProvider,
  SoftwareProviderParams,
  UBLExtensions,
  UBLExtensionsParams,
  UBLExtensionType,
  UBLExtensionTypeParams,
};
