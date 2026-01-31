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
