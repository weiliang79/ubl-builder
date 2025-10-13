'use strict';

import { UBLExtensions, UBLExtensionsParams } from './UBLExtensionsType';
import { UBLExtensionType, UBLExtensionTypeParams } from './UBLExtension';
import {
  DianExtensions,
  DianExtensionsParams,
  DianExtensionsContent,
  DianExtensionsContentParams,
  AuthorizationProvider,
  InvoiceControl,
  InvoiceControlParams,
  AuthorizedInvoices,
  AuthorizedInvoicesParams,
  InvoiceSource,
  SoftwareProvider,
  SoftwareProviderParams,
} from './customExtensionContents';

export {
  UBLExtensions,
  UBLExtensionsParams,
  UBLExtensionType,
  UBLExtensionTypeParams,

  // DIAN extensions
  // NOTICE: Dian Extensions are specific to Colombia and may not be applicable in other regions.
  DianExtensions,
  DianExtensionsParams,
  DianExtensionsContent,
  DianExtensionsContentParams,
  InvoiceControl,
  InvoiceControlParams,
  AuthorizedInvoices,
  AuthorizedInvoicesParams,
  InvoiceSource,
  AuthorizationProvider,
  SoftwareProvider,
  SoftwareProviderParams,
};
