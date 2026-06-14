import { SetMetadata } from '@nestjs/common';

/**
 * Metadata-nøgle som bruges til at gemme
 * rollekrav på controllers og endpoints.
 */
export const ROLES_KEY = 'roles';

/**
 * Custom decorator til rollebaseret authorization.
 *
 * Eksempel:
 * @Roles('admin')
 */
export const Roles = (...roles: string[]) =>
  SetMetadata(ROLES_KEY, roles);