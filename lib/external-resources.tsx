import type { Node } from 'fumadocs-core/page-tree';
import { Boxes, BookMarked } from 'lucide-react';

/**
 * 站外资料入口。
 *
 * 这两条不属于课程体系（课程目录由 hoa-backend 生成到 content/docs），
 * 所以在目录树里单独追加，并用一个分隔节点标出「外部资料」，
 * 避免和课程分类混在一起。
 */
export const externalResourceNodes: Node[] = [
  {
    type: 'separator',
    name: '外部资料',
    $id: 'resources',
  },
  {
    type: 'page',
    name: '深圳 E立方工作室',
    url: '/resources/e-cube',
    icon: <Boxes className="size-4" />,
    $id: 'resources/e-cube',
  },
  {
    type: 'page',
    name: '哈尔滨 问天讲师团',
    url: '/resources/wentian',
    icon: <BookMarked className="size-4" />,
    $id: 'resources/wentian',
  },
];
