export interface CourseAuditRecord {
  courseCode: string;
  courseName: string;
  department: string;
  issueId: number;
  status: 'PASSED' | 'PENDING' | 'NEEDS_WORK';
  assignee: string;
  auditDate: string;
  score: number;
  checklist: {
    syllabus: boolean; // 教学大纲完整度
    lectureNotes: boolean; // 课件/笔记覆盖度
    labGuides: boolean; // 实验/实践指导规范
    examMaterials: boolean; // 历年试题/复习资料
    licenseCompliance: boolean; // 开源协议与版权合规
    codeLintPassed: boolean; // 代码与文档格式校验
  };
  summary: string;
}

export const COURSE_AUDIT_DATABASE: Record<string, CourseAuditRecord> = {
  AUTO2001: {
    courseCode: 'AUTO2001',
    courseName: '控制工程基础',
    department: 'AUTO 自动化系',
    issueId: 6,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-22',
    score: 98,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '控制工程基础课程资料审查通过。包含完整的拉氏变换、传递函数建模、频率响应法讲义及 MATLAB/Simulink 实验教程，版权合规且已补全 GitHub 开源协议。',
  },
  AUTO2003A: {
    courseCode: 'AUTO2003A',
    courseName: '自动控制原理 A',
    department: 'AUTO 自动化系',
    issueId: 19,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-22',
    score: 96,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '自动控制原理 A 课程资料审查通过。涵盖根轨迹法、频域域校正设计、状态空间分析法讲义与经典期末复习真题，文档与 Markdown 格式符合社区规范。',
  },
  AUTO2003B: {
    courseCode: 'AUTO2003B',
    courseName: '自动控制原理 B',
    department: 'AUTO 自动化系',
    issueId: 26,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-25',
    score: 95,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '自动控制原理 B 课程资料审查通过。包含时域分析法、根轨迹法及离散控制系统讲义，已整理经典例题解析与仿真代码，完成代码与 Markdown 规范审查。',
  },
  AUTO2006: {
    courseCode: 'AUTO2006',
    courseName: '运动控制系统',
    department: 'AUTO 自动化系',
    issueId: 27,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-25',
    score: 97,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '运动控制系统课程资料审查通过。涵盖直流调速系统、交流变频调速及矢量控制讲义、Simulink 建模实践指导与期末复习题库，开源协议与版权合规。',
  },
  AUTO1001: {
    courseCode: 'AUTO1001',
    courseName: '自动化专业导论',
    department: 'AUTO 自动化系',
    issueId: 36,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-25',
    score: 98,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '自动化专业导论课程资料审查通过。补齐学科发展前沿讲义、培养方案解读、前沿学术报告 PPT 及推荐书单，全量代码与文档格式校验通过。',
  },
  COMP3005: {
    courseCode: 'COMP3005',
    courseName: '计算机体系结构',
    department: 'COMP 计算机系',
    issueId: 14,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-25',
    score: 96,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '计算机体系结构课程资料审查通过。覆盖指令集架构(RISC-V/MIPS)、流水线冲突与冒险、Cache/TLB 存储层次结构及 Gem5 模拟实验讲义，文档规格符合标准。',
  },
  COMP3042: {
    courseCode: 'COMP3042',
    courseName: '数据库系统',
    department: 'COMP 计算机系',
    issueId: 14,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-25',
    score: 97,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '数据库系统课程资料审查通过。包含关系代数、SQL 语言实战、并发控制与 B+ 树索引讲义、PostgreSQL/MySQL 实验指导与往年真题解答，通过全量格式与开源合规核验。',
  },
  COMP3039: {
    courseCode: 'COMP3039',
    courseName: '计算机系统基础',
    department: 'COMP 计算机系',
    issueId: 10,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-27',
    score: 97,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '计算机系统基础课程资料审查通过。包含 IA-32/x86-64 机器级表示、CPU 执行过程、存储器层次结构及链接/加载实验讲义，代码与文档规范校验全量通过。',
  },
  COMP3021: {
    courseCode: 'COMP3021',
    courseName: '计算机网络',
    department: 'COMP 计算机系',
    issueId: 12,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-27',
    score: 96,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '计算机网络课程资料审查通过。涵盖应用层(HTTP/DNS)、传输层(TCP/UDP)、网络层(IP路由算法)讲义及 Wireshark 抓包实验指南与真题，开源协议与格式校验合格。',
  },
  COMP3054: {
    courseCode: 'COMP3054',
    courseName: '编译原理',
    department: 'COMP 计算机系',
    issueId: 13,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-27',
    score: 98,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '编译原理课程资料审查通过。包含词法分析(Flex)、语法分析(Bison)、中间代码生成及 LLVM IR 编译器实验指导与往年真题解答，符合社区开源规范。',
  },
  COMP3029: {
    courseCode: 'COMP3029',
    courseName: '算法设计与分析',
    department: 'COMP 计算机系',
    issueId: 11,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-27',
    score: 97,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '算法设计与分析课程资料审查通过。覆盖分治策略、动态规划、贪心算法、图论算法及 NP 完全性分析讲义与练习题，全量合规通过。',
  },
  COMP3019: {
    courseCode: 'COMP3019',
    courseName: '软件工程',
    department: 'COMP 计算机系',
    issueId: 10,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-27',
    score: 95,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '软件工程课程资料审查通过。包含敏捷开发 Scrum 流程、UML 建模分析、软件测试与 CI/CD 持续集成讲义大作业指南，格式校验通过。',
  },
  MECH2020: {
    courseCode: 'MECH2020',
    courseName: '理论力学',
    department: 'MECH 机械工程系',
    issueId: 4,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-25',
    score: 96,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '理论力学课程资料审查通过。包含静力学（受力分析与平衡方程）、运动学与动力学（达朗贝尔原理、动量与动量矩定理）讲义，已整理经典例题与期末复习题库，开源协议与格式校验全量通过。',
  },
  MECH3041: {
    courseCode: 'MECH3041',
    courseName: '材料力学',
    department: 'MECH 机械工程系',
    issueId: 5,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-25',
    score: 97,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '材料力学课程资料审查通过。覆盖轴向拉压、剪切与扭转、平面弯曲应力分析、交变应力与强度理论讲义，实验指导书与历年真题完整，符合开源社区规范。',
  },
  MECH3005: {
    courseCode: 'MECH3005',
    courseName: '机械原理',
    department: 'MECH 机械工程系',
    issueId: 5,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-25',
    score: 98,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '机械原理课程资料审查通过。涵盖平面连杆机构、齿轮机构运动学、凸轮机构设计与机械平衡讲义，已提供机构运动仿真代码与 Markdown 规范审查。',
  },
  MECH3060: {
    courseCode: 'MECH3060',
    courseName: '机械设计',
    department: 'MECH 机械工程系',
    issueId: 5,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-25',
    score: 95,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '机械设计课程资料审查通过。包含螺纹连接、齿轮/蜗杆传动设计、轴承选择与轴系结构设计大作业讲义，开源许可与文件校验合格。',
  },
  MECH2010: {
    courseCode: 'MECH2010',
    courseName: '流体力学',
    department: 'MECH 机械工程系',
    issueId: 22,
    status: 'PASSED',
    assignee: 'Linboss9',
    auditDate: '2026-07-25',
    score: 97,
    checklist: {
      syllabus: true,
      lectureNotes: true,
      labGuides: true,
      examMaterials: true,
      licenseCompliance: true,
      codeLintPassed: true,
    },
    summary:
      '流体力学课程资料审查通过。涵盖流体静力学、纳维-斯托克斯(N-S)方程、边界层理论及管道水力计算讲义与实验指南，代码与 Markdown 格式全量合规。',
  },
};
