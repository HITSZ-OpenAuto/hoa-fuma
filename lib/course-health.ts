import type { CourseInfoData } from '@/lib/types';
import type { CourseAuditRecord } from '@/lib/course-review';

export interface CourseHealthMetric {
  id: string;
  name: string;
  category: 'metadata' | 'content' | 'compliance' | 'quality';
  passed: boolean;
  weight: number;
  description: string;
}

export interface CourseHealthReport {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  status: 'excellent' | 'good' | 'fair' | 'needs_work';
  statusLabel: string;
  metrics: CourseHealthMetric[];
  passedCount: number;
  totalCount: number;
  suggestions: string[];
}

export function calculateCourseHealth(
  courseData?: CourseInfoData,
  auditRecord?: CourseAuditRecord
): CourseHealthReport {
  const metrics: CourseHealthMetric[] = [];
  const suggestions: string[] = [];

  // 1. Metadata Checks (Weight: ~35%)
  const hasCredit = Boolean(courseData && courseData.credit > 0);
  metrics.push({
    id: 'credit',
    name: '课程学分定义',
    category: 'metadata',
    passed: hasCredit,
    weight: 7,
    description: hasCredit
      ? `学分已明确（${courseData?.credit} 学分）`
      : '缺少课程学分数值',
  });
  if (!hasCredit) suggestions.push('在 frontmatter 中声明正确的学分 (credit)');

  const hasAssessment = Boolean(
    courseData &&
    courseData.assessmentMethod &&
    courseData.assessmentMethod.trim().length > 0
  );
  metrics.push({
    id: 'assessmentMethod',
    name: '考核方式标注',
    category: 'metadata',
    passed: hasAssessment,
    weight: 7,
    description: hasAssessment
      ? `考核方式：${courseData?.assessmentMethod}`
      : '未指定考核方式（考试/查考/大作业）',
  });
  if (!hasAssessment) suggestions.push('补充考核方式 (assessmentMethod) 信息');

  const hasNature = Boolean(
    courseData &&
    courseData.courseNature &&
    courseData.courseNature.trim().length > 0
  );
  metrics.push({
    id: 'courseNature',
    name: '课程性质分类',
    category: 'metadata',
    passed: hasNature,
    weight: 6,
    description: hasNature
      ? `课程性质：${courseData?.courseNature}`
      : '未声明课程性质（必修/选修/限选）',
  });
  if (!hasNature) suggestions.push('补充课程性质 (courseNature) 字段');

  const hourTotal = courseData
    ? Object.values(courseData.hourDistribution || {}).reduce(
        (acc, v) => acc + (v || 0),
        0
      )
    : 0;
  const hasHourDistribution = hourTotal > 0;
  metrics.push({
    id: 'hourDistribution',
    name: '学时分配完整度',
    category: 'metadata',
    passed: hasHourDistribution,
    weight: 7,
    description: hasHourDistribution
      ? `已分配 ${hourTotal} 学时`
      : '未配置学时分布（理论/实验/上机等）',
  });
  if (!hasHourDistribution)
    suggestions.push('设置具体的学时分布 (hourDistribution)');

  const gradingTotal = courseData?.gradingScheme
    ? courseData.gradingScheme.reduce(
        (acc, item) => acc + (item.percent || 0),
        0
      )
    : 0;
  const hasGrading = Boolean(
    courseData &&
    courseData.gradingScheme &&
    courseData.gradingScheme.length > 0 &&
    gradingTotal === 100
  );
  metrics.push({
    id: 'gradingScheme',
    name: '成绩占比方案',
    category: 'metadata',
    passed: hasGrading,
    weight: 8,
    description: hasGrading
      ? `包含 ${courseData?.gradingScheme.length} 项考核占比（合计 100%）`
      : gradingTotal > 0
        ? `成绩占比合计 (${gradingTotal}%) 不等于 100%`
        : '缺少成绩构成占比方案',
  });
  if (!hasGrading)
    suggestions.push('配置完整的成绩构成 (gradingScheme) 且总比例等于 100%');

  // 2. Audit & Content Checklist (Weight: ~65%)
  const checklist = auditRecord?.checklist;

  const hasSyllabus = Boolean(checklist?.syllabus ?? true);
  metrics.push({
    id: 'syllabus',
    name: '教学大纲覆盖',
    category: 'content',
    passed: hasSyllabus,
    weight: 12,
    description: hasSyllabus
      ? '包含完整的课程教学大纲与教学目标'
      : '缺少教学大纲与章节目录说明',
  });
  if (!hasSyllabus) suggestions.push('补全课程教学大纲 (syllabus)');

  const hasNotes = Boolean(checklist?.lectureNotes ?? true);
  metrics.push({
    id: 'lectureNotes',
    name: '课件/讲义覆盖度',
    category: 'content',
    passed: hasNotes,
    weight: 15,
    description: hasNotes
      ? '讲义与课件资料覆盖核心知识点'
      : '课件/讲义内容不完整',
  });
  if (!hasNotes)
    suggestions.push('补充缺失章节的课件与笔记资料 (lectureNotes)');

  const hasLab = Boolean(checklist?.labGuides ?? true);
  metrics.push({
    id: 'labGuides',
    name: '实验与实践指南',
    category: 'content',
    passed: hasLab,
    weight: 12,
    description: hasLab
      ? '提供实验大作业与代码实践指南'
      : '缺少实验或大作业指导资料',
  });
  if (!hasLab) suggestions.push('完善实验环境配置与实验指导书 (labGuides)');

  const hasExam = Boolean(checklist?.examMaterials ?? true);
  metrics.push({
    id: 'examMaterials',
    name: '历年真题与复习题库',
    category: 'content',
    passed: hasExam,
    weight: 12,
    description: hasExam
      ? '包含历年复习资料或真题解答'
      : '缺少期末复习与历年真题汇总',
  });
  if (!hasExam) suggestions.push('整理期末复习要点或历年真题 (examMaterials)');

  const hasLicense = Boolean(checklist?.licenseCompliance ?? true);
  metrics.push({
    id: 'licenseCompliance',
    name: '开源协议与版权合规',
    category: 'compliance',
    passed: hasLicense,
    weight: 7,
    description: hasLicense
      ? '代码与资料符合 CC / MIT 等开源协议'
      : '存在未说明来源或潜在版权争议资料',
  });
  if (!hasLicense)
    suggestions.push('声明版权归属并附带开源许可证 (licenseCompliance)');

  const hasLint = Boolean(checklist?.codeLintPassed ?? true);
  metrics.push({
    id: 'codeLintPassed',
    name: '文档与 Markdown 格式规范',
    category: 'quality',
    passed: hasLint,
    weight: 7,
    description: hasLint
      ? '通过 Markdown / TS 全量 Code Lint 检查'
      : '格式排版存在 Lint 校验错误',
  });
  if (!hasLint) suggestions.push('修复文档排版与代码格式问题 (codeLintPassed)');

  // Score computation
  const totalWeight = metrics.reduce((acc, m) => acc + m.weight, 0);
  const earnedWeight = metrics.reduce(
    (acc, m) => acc + (m.passed ? m.weight : 0),
    0
  );

  let rawScore = Math.round((earnedWeight / totalWeight) * 100);

  // If explicit audit record exists and has audit score, blend with audit score
  if (auditRecord && typeof auditRecord.score === 'number') {
    rawScore = Math.round((rawScore + auditRecord.score) / 2);
  }

  const score = Math.min(100, Math.max(0, rawScore));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let status: 'excellent' | 'good' | 'fair' | 'needs_work' = 'needs_work';
  let statusLabel = '亟待完善';

  if (score >= 95) {
    grade = 'A+';
    status = 'excellent';
    statusLabel = '模范仓库';
  } else if (score >= 90) {
    grade = 'A';
    status = 'excellent';
    statusLabel = '优秀课程';
  } else if (score >= 80) {
    grade = 'B';
    status = 'good';
    statusLabel = '良好级别';
  } else if (score >= 70) {
    grade = 'C';
    status = 'fair';
    statusLabel = '基本合格';
  } else if (score >= 60) {
    grade = 'D';
    status = 'needs_work';
    statusLabel = '待改进';
  } else {
    grade = 'F';
    status = 'needs_work';
    statusLabel = '信息缺漏严重';
  }

  const passedCount = metrics.filter((m) => m.passed).length;

  return {
    score,
    grade,
    status,
    statusLabel,
    metrics,
    passedCount,
    totalCount: metrics.length,
    suggestions,
  };
}

export function getHealthGradeColor(grade: string) {
  switch (grade) {
    case 'A+':
      return {
        badge:
          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        bar: 'bg-emerald-500',
        text: 'text-emerald-600 dark:text-emerald-400',
      };
    case 'A':
      return {
        badge:
          'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
        bar: 'bg-green-500',
        text: 'text-green-600 dark:text-green-400',
      };
    case 'B':
      return {
        badge:
          'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
        bar: 'bg-blue-500',
        text: 'text-blue-600 dark:text-blue-400',
      };
    case 'C':
      return {
        badge:
          'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
        bar: 'bg-amber-500',
        text: 'text-amber-600 dark:text-amber-400',
      };
    default:
      return {
        badge:
          'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
        bar: 'bg-rose-500',
        text: 'text-rose-600 dark:text-rose-400',
      };
  }
}
