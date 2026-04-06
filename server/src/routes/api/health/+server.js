import { json } from '@sveltejs/kit';
import { VERSIONING } from '$lib/schemas.js';

export function GET() {
  return json({
    status: 'ok',
    version: VERSIONING.packageVersion,
    specVersion: VERSIONING.currentSpecVersion,
    supportedSpecVersions: VERSIONING.supportedSpecVersions
  });
}
