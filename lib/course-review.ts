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
};
