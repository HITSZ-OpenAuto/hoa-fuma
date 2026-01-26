import {
  BookOpen,
  Beaker,
  UserCheck,
  PencilLine,
  Monitor,
  Users,
} from 'lucide-react';

export const HOUR_DISTRIBUTION_CONFIG = [
  { key: 'theory', label: '理论', icon: BookOpen },
  { key: 'lab', label: '实验', icon: Beaker },
  { key: 'practice', label: '实践', icon: UserCheck },
  { key: 'exercise', label: '习题', icon: PencilLine },
  { key: 'computer', label: '上机', icon: Monitor },
  { key: 'tutoring', label: '辅导', icon: Users },
] as const;

export const GRADING_SCHEME_CONFIG = [
  {
    key: 'classParticipation',
    label: '平时表现',
    bgClass: 'bg-emerald-200',
    textClass: 'text-emerald-700',
  },
  {
    key: 'homeworkAssignments',
    label: '平时作业',
    bgClass: 'bg-blue-200',
    textClass: 'text-blue-700',
  },
  {
    key: 'laboratoryWork',
    label: '实验成绩',
    bgClass: 'bg-purple-200',
    textClass: 'text-purple-700',
  },
  {
    key: 'finalExamination',
    label: '期末考试',
    bgClass: 'bg-amber-200',
    textClass: 'text-amber-700',
  },
] as const;
