import { computeYearMajorMap, MajorEntry } from '../lib/docs-utils';

function generateMockPages(count: number): { slugs: string[] }[] {
  const years = ['2023', '2024', '2025'];
  const majors = [
    'cs',
    'automotive',
    'economics',
    'math',
    'physics',
    'chemistry',
    'biology',
    'history',
    'literature',
    'art',
  ];
  const pages: { slugs: string[] }[] = [];

  for (let i = 0; i < count; i++) {
    const year = years[Math.floor(Math.random() * years.length)];
    const major = majors[Math.floor(Math.random() * majors.length)];
    // Random sub-paths
    const subpath = `course-${Math.floor(Math.random() * 100)}`;
    pages.push({ slugs: [year, major, subpath] });
  }

  // Add some malformed slugs to test robustness
  pages.push({ slugs: ['invalid'] });
  pages.push({ slugs: [] });

  return pages;
}

function generateMockMapping(): Record<string, Record<string, MajorEntry>> {
  return {
    '2023': {
      cs: { name: 'Computer Science' },
      automotive: { name: 'Automotive Engineering' },
    },
    '2024': {
      cs: { name: 'Computer Science' },
      economics: { name: 'Economics' },
    },
    '2025': {
      cs: { name: 'Computer Science' },
      math: { name: 'Mathematics' },
    },
  };
}

async function runBenchmark() {
  const pages = generateMockPages(10000);
  const mapping = generateMockMapping();

  console.log(`Running benchmark with ${pages.length} pages...`);

  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    computeYearMajorMap(pages, mapping);
  }
  const end = performance.now();

  const totalTime = end - start;
  const avgTime = totalTime / 1000;

  console.log(`Total time for 1000 iterations: ${totalTime.toFixed(2)}ms`);
  console.log(`Average time per call: ${avgTime.toFixed(4)}ms`);
}

runBenchmark();
