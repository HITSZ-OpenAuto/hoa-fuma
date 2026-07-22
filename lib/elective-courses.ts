export interface ElectiveCategory {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  minCreditsRequired: number;
  subDomains: Array<{
    code: string;
    title: string;
    description: string;
  }>;
}

export const ELECTIVE_CATEGORIES: ElectiveCategory[] = [
  {
    id: 'general-knowledge',
    name: '文理通识课程体系',
    nameEn: 'General Knowledge & Liberal Arts',
    description: '涵盖人文哲学、社会科学、艺术审美、自然科学与前沿科技，培养博雅通识素养。',
    icon: 'BookOpen',
    color: 'from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/30',
    minCreditsRequired: 10,
    subDomains: [
      { code: 'GK-HUM', title: '人文历史与哲学思维', description: '文学、历史学、哲学与文化遗产' },
      { code: 'GK-SOC', title: '社会科学与经济管理', description: '经济学、法学、管理学与公共政策' },
      { code: 'GK-ART', title: '艺术鉴赏与审美表达', description: '音乐、美术、设计与戏剧美育' },
      { code: 'GK-SCI', title: '自然科学与前沿科技', description: '交叉科学、人工智能与生态环境' },
    ],
  },
  {
    id: 'cross-specialty',
    name: '跨专业课程体系',
    nameEn: 'Cross-Disciplinary Electives',
    description: '面向跨院系、跨专业交叉培养，打通自动化、计算机、电子信息与经管交叉选修通道。',
    icon: 'GitBranch',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/30',
    minCreditsRequired: 6,
    subDomains: [
      { code: 'CS-AI', title: '智能系统与AI交叉', description: '机器学习、机器人学、数据挖掘' },
      { code: 'CS-ECON', title: '经管与工程交叉 (Cross-Econ)', description: '工程经济学、量化金融、供应链' },
      { code: 'CS-HARD', title: '软硬件协同与嵌入式', description: 'FPGA设计、物联网、智能感知' },
    ],
  },
  {
    id: 'innovative-courses',
    name: '创新创业与学科竞赛体系',
    nameEn: 'Innovation & Entrepreneurship',
    description: '包括创新实验、科研训练、学科竞赛（如智能车、ACM、电子设计大赛）与创业实践课程。',
    icon: 'Lightbulb',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/30',
    minCreditsRequired: 4,
    subDomains: [
      { code: 'IE-EXP', title: '创新实验与科研训练', description: '大学生创新创业训练计划 (SRTP)' },
      { code: 'IE-COMP', title: '学科竞赛与项目实训', description: '智能车、电子设计、机器人大赛指导' },
      { code: 'IE-BIZ', title: '创业孵化与项目管理', description: '商业计划书写作、知识产权与专利' },
    ],
  },
  {
    id: 'social-practice',
    name: '社会实践与劳动教育体系',
    nameEn: 'Social Practice & Labor Education',
    description: '包含国情调研、乡村振兴、志愿服务、科普教育与新时代劳动教育等实践学分课程。',
    icon: 'Users',
    color: 'from-purple-500/20 to-pink-500/20 text-purple-500 border-purple-500/30',
    minCreditsRequired: 2,
    subDomains: [
      { code: 'SP-FIELD', title: '国情调研与社会实践', description: '假期社会实践、基层调研报告' },
      { code: 'SP-VOL', title: '公益志愿与科普服务', description: '大型赛事志愿服务、科普宣讲' },
      { code: 'SP-LABOR', title: '劳动教育与生产实训', description: '金工实习、电子工艺实习与劳动实践' },
    ],
  },
];
