import { ClipboardList, MessageCircle } from 'lucide-react';
import { PageActions } from '@/components/page-actions';
import { Button } from '@/components/ui/button';
import { getResourceFileUrl, type ResourceSnapshot } from '@/lib/resources';

export function ResourceActions({ snapshot }: { snapshot: ResourceSnapshot }) {
  const contact = snapshot.contact;
  const qqCode = contact?.images?.find((image) => image.label.includes('QQ'));
  const links = [
    contact?.qq && qqCode
      ? {
          label: 'QQ 群',
          title: `QQ 群 ${contact.qq}`,
          href: getResourceFileUrl(snapshot, qqCode.path),
          icon: MessageCircle,
        }
      : null,
    contact?.feedback
      ? {
          label: '反馈问卷',
          title: '用户反馈问卷',
          href: contact.feedback,
          icon: ClipboardList,
        }
      : null,
  ].filter((link) => link !== null);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <PageActions githubUrl={snapshot.repoUrl} />
      {links.map(({ label, title, href, icon: Icon }) => (
        <Button
          key={label}
          variant="secondary"
          size="sm"
          className="[&_svg]:text-fd-muted-foreground gap-2 no-underline [&_svg]:size-3.5"
          nativeButton={false}
          role="link"
          title={title}
          render={<a href={href} target="_blank" rel="noopener noreferrer" />}
        >
          <Icon aria-hidden="true" />
          {label}
        </Button>
      ))}
    </div>
  );
}
