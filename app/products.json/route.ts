import { listProductSummaries } from '@/lib/db';

export const dynamic = 'force-static';

/** Whole catalogue as one file, so pages stay light. Rebuilt on every save in the admin panel. */
export async function GET() {
  return Response.json(await listProductSummaries());
}
