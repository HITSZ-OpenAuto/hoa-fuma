export interface MergedCourseInfo {
  targetRepo: string;
  targetPath: string;
  reason: string;
}

export const MERGED_COURSE_MAP: Record<string, MergedCourseInfo> = {
  ECON3001: {
    targetRepo: 'Cross-Econ',
    targetPath: '/docs/cross-specialty/ECON3001',
    reason:
      '本门课程为跨专业与经管学院合班教学，资料统一汇总归档至 Cross-Econ 跨专业仓库 (ECON3001 #1)',
  },
};
