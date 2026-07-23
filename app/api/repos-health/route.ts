import { NextResponse } from 'next/server';

export interface RepoHealthStats {
  organization: string;
  totalRepos: number;
  openIssuesTotal: number;
  resolvedIssuesTotal: number;
  overallHealthScore: number;
  licenseComplianceRate: string;
  disciplineBreakdown: {
    name: string;
    total: number;
    resolved: number;
    healthScore: number;
  }[];
  lastUpdated: string;
}

export async function GET() {
  const healthData: RepoHealthStats = {
    organization: 'HITSZ-OpenAuto',
    totalRepos: 106,
    openIssuesTotal: 106,
    resolvedIssuesTotal: 12,
    overallHealthScore: 98.5,
    licenseComplianceRate: '100%',
    disciplineBreakdown: [
      { name: 'Core Infrastructure (.github, hoa-fuma, fastdl)', total: 7, resolved: 7, healthScore: 100 },
      { name: 'AUTO - 自动化类课程', total: 22, resolved: 2, healthScore: 97.5 },
      { name: 'COMP - 计算机类课程', total: 28, resolved: 0, healthScore: 96.0 },
      { name: 'EE - 电气/电子类课程', total: 8, resolved: 0, healthScore: 95.0 },
      { name: 'MATH - 数学类课程', total: 5, resolved: 0, healthScore: 98.0 },
      { name: 'GEIP - 通识/思政类课程', total: 4, resolved: 0, healthScore: 94.0 },
      { name: 'MECH - 机械类课程', total: 5, resolved: 0, healthScore: 95.0 },
      { name: '其他合班与公共课程 (ECON, EMEC, MOOC 等)', total: 27, resolved: 3, healthScore: 99.0 },
    ],
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(healthData, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
