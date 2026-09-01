import { SetMetadata } from '@nestjs/common';

// Marks a route as not requiring JWT auth. Used sparingly — most public
// (consumer-facing) routes simply live on controllers that never apply
// JwtAuthGuard in the first place; this decorator exists for the rare case
// of a mixed controller with both public and protected routes.
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
