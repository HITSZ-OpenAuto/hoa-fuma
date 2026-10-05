import { z } from 'zod';
import Image from 'next/image';

const query =
  'org=HITSZ-OpenAuto&exclude=.github&repo=noname7321/HITSZ-OpenAuto';
const contributorsUrl = `https://contrib.hoa.moe/iframe?${query}`;
const contributorsSchema = z.array(
  z.object({
    login: z.string().regex(/^[a-z\d](?:[a-z\d-]*[a-z\d])?(?:\[bot\])?$/i),
    avatar_url: z.url({
      protocol: /^https$/,
      hostname: /^avatars\.githubusercontent\.com$/,
    }),
  })
);

async function getContributors() {
  try {
    const response = await fetch(`https://contrib.hoa.moe/api/json?${query}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Unable to load contributors');

    const contributors = contributorsSchema.parse(await response.json());
    return contributors;
  } catch {
    return [];
  }
}

export async function Contributors() {
  const contributors = await getContributors();

  if (contributors.length > 0) {
    return (
      <ul
        aria-label="HOA 贡献者"
        className="not-prose my-6 flex list-none flex-wrap gap-2 p-0"
      >
        {contributors.map(({ login, avatar_url }) => (
          <li key={login}>
            <a
              href={`https://github.com/${encodeURIComponent(login)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${login} 的 GitHub 主页（新标签页）`}
              title={login}
              className="focus-visible:outline-fd-primary block size-12 rounded-full outline-offset-4 focus-visible:outline-2 sm:size-16"
            >
              <Image
                src={avatar_url}
                alt=""
                width={64}
                height={64}
                sizes="(min-width: 640px) 64px, 48px"
                className="size-full rounded-full"
              />
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p>
      暂时无法加载贡献者头像。请
      <a href={contributorsUrl} target="_blank" rel="noopener noreferrer">
        查看完整贡献者列表（新标签页）
      </a>
      。
    </p>
  );
}
