import type { Node } from 'fumadocs-core/page-tree';
import { Boxes, BookMarked } from 'lucide-react';

export const externalResourceNodes: Node[] = [
  {
    type: 'separator',
    name: '外部资料',
    $id: 'resources',
  },
  {
    type: 'page',
    name: '深圳 E立方工作室',
    url: '/external/e-cube',
    icon: <Boxes className="size-4" />,
    $id: 'resources/e-cube',
  },
  {
    type: 'page',
    name: '哈尔滨 问天讲师团',
    url: '/external/wentian',
    icon: <BookMarked className="size-4" />,
    $id: 'resources/wentian',
  },
];
