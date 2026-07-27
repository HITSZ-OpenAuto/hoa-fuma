export interface ClientSearchEntry {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  url: string;
  type?: 'page' | 'course' | 'doc';
  year?: string;
}

export interface ClientSearchResult extends ClientSearchEntry {
  score: number;
}

// Built-in offline client search index with core courses, docs, and pages
export const CLIENT_SEARCH_INDEX: ClientSearchEntry[] = [
  {
    id: 'home',
    title: 'HITSZ 课程攻略共享计划 (hoa.moe)',
    description: '哈尔滨工业大学（深圳）课程资料、选修指南与开源经验分享',
    keywords: ['首页', 'HITSZ', '哈深', 'hoa', '课程攻略', '开源'],
    url: '/',
    type: 'page',
  },
  {
    id: 'docs-home',
    title: '课程文档总览',
    description: '按培养方案与学年分类查看全校各专业课程资料与攻略',
    keywords: ['文档', '课程', '培养方案', '学年', '大一', '大二', '大三', '大四'],
    url: '/docs',
    type: 'doc',
  },
  {
    id: 'doc-2024',
    title: '2024级 培养方案与课程攻略',
    description: '2024级各专业必修课、选修课、实验报告与期末复习资料',
    keywords: ['2024', '2024级', '大一', '课程攻略'],
    url: '/docs/2024',
    type: 'doc',
    year: '2024',
  },
  {
    id: 'doc-2023',
    title: '2023级 培养方案与课程攻略',
    description: '2023级计算机、电子、机械等专业核心课程指南',
    keywords: ['2023', '2023级', '大二', '专业课'],
    url: '/docs/2023',
    type: 'doc',
    year: '2023',
  },
  {
    id: 'doc-2022',
    title: '2022级 培养方案与课程攻略',
    description: '2022级专业进阶课程、项目实训与选修课评价',
    keywords: ['2022', '2022级', '大三', '实训'],
    url: '/docs/2022',
    type: 'doc',
    year: '2022',
  },
  {
    id: 'cs-algo',
    title: '数据结构与算法分析 (CS)',
    description: '算法复杂度、链表、树、图论算法与力扣刷题经验指南',
    keywords: ['数据结构', '算法', 'algorithm', 'data structures', 'CS', '计算机'],
    url: '/docs/2023/cs-algorithm',
    type: 'course',
  },
  {
    id: 'cs-os',
    title: '操作系统概念与实验 (OS)',
    description: '进程管理、内存分配、文件系统与 Pintos 实验攻略',
    keywords: ['操作系统', 'OS', 'Pintos', '进程', '内存', '计算机'],
    url: '/docs/2023/operating-systems',
    type: 'course',
  },
  {
    id: 'cs-network',
    title: '计算机网络 (CN)',
    description: 'TCP/IP 协议栈、Socket 编程与网络 Wireshark 抓包实验',
    keywords: ['计算机网络', '计网', 'network', 'TCP/IP', 'Wireshark'],
    url: '/docs/2023/computer-networks',
    type: 'course',
  },
  {
    id: 'math-linear-algebra',
    title: '高等代数与线性代数',
    description: '矩阵论、特征值分解、向量空间与期末历年真题汇总',
    keywords: ['线代', '线性代数', '高代', '矩阵', 'Math', '数学'],
    url: '/docs/2024/linear-algebra',
    type: 'course',
  },
  {
    id: 'math-calculus',
    title: '微积分与工科数学分析',
    description: '极限、导数、多重积分与级数敛散性判别全解',
    keywords: ['微积分', '数分', '数学分析', 'calculus', '高数'],
    url: '/docs/2024/calculus',
    type: 'course',
  },
  {
    id: 'ee-circuits',
    title: '电路理论与电子技术基础',
    description: '基尔霍夫定律、相量法、放大电路与 Multisim 仿真指导',
    keywords: ['电路', '电路理论', '电子', 'EE', '仿真'],
    url: '/docs/2024/circuits',
    type: 'course',
  },
];

/**
 * Client-side fuzzy search function that ranks entries based on relevance.
 */
export function searchClientIndex(query: string, limit = 20): ClientSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  const results: ClientSearchResult[] = [];

  for (const entry of CLIENT_SEARCH_INDEX) {
    let score = 0;
    const titleLower = entry.title.toLowerCase();
    const descLower = entry.description.toLowerCase();
    const keywordsStr = entry.keywords.join(' ').toLowerCase();

    // Exact title match bonus
    if (titleLower === q) score += 200;
    else if (titleLower.startsWith(q)) score += 100;
    else if (titleLower.includes(q)) score += 60;

    // Subterm matching
    for (const term of terms) {
      if (titleLower.includes(term)) score += 40;
      if (descLower.includes(term)) score += 20;
      if (keywordsStr.includes(term)) score += 30;
      if (entry.url.toLowerCase().includes(term)) score += 15;
    }

    if (score > 0) {
      results.push({ ...entry, score });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
