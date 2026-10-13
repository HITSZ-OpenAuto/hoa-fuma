import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { HOA_LAST_PATH_COOKIE } from '@/lib/constants';
import { findRedirect } from '@/lib/redirect';

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await props.params;
  const lastPath = (await cookies()).get(HOA_LAST_PATH_COOKIE)?.value;
  const target = findRedirect(slug, lastPath);
  if (target) redirect(target);
  notFound();
}
