import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';

const userId = process.env.AFDIAN_USER_ID;
const token = process.env.AFDIAN_API_TOKEN;
const output = new URL('../data/afdian-sponsors.json', import.meta.url);

if (!userId || !token) {
  process.stdout.write(
    'Skipping Afdian sync: credentials are not configured.\n'
  );
  process.exit(0);
}

async function query(endpoint, params) {
  const paramsJson = JSON.stringify(params);
  const ts = Math.floor(Date.now() / 1000);
  const sign = createHash('md5')
    .update(`${token}params${paramsJson}ts${ts}user_id${userId}`)
    .digest('hex');
  const response = await fetch(`https://afdian.com/api/open/${endpoint}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ user_id: userId, params: paramsJson, ts, sign }),
  });

  if (!response.ok) {
    throw new Error(`Afdian ${endpoint} returned HTTP ${response.status}`);
  }

  const result = await response.json();
  if (result.ec !== 200) {
    throw new Error(`Afdian ${endpoint} failed: ${result.em || result.ec}`);
  }

  return result.data;
}

async function queryAll(endpoint) {
  const firstPage = await query(endpoint, { page: 1 });
  const pages = [firstPage];

  for (let page = 2; page <= firstPage.total_page; page += 1) {
    pages.push(await query(endpoint, { page }));
  }

  return pages.flatMap((page) => page.list);
}

function orderDate(order) {
  const timestamp = Number(order.create_time ?? order.pay_time);
  if (Number.isFinite(timestamp) && timestamp > 0) {
    return new Date(timestamp * 1000).toLocaleDateString('sv-SE', {
      timeZone: 'Asia/Shanghai',
    });
  }

  const match = String(order.out_trade_no).match(
    /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/
  );
  if (!match) return null;

  const [, year, month, day] = match;
  const date = `${year}-${month}-${day}`;
  return Number.isNaN(Date.parse(`${date}T00:00:00+08:00`)) ? null : date;
}

function addMonths(date, offset) {
  const [year, month, day] = date.split('-').map(Number);
  const target = new Date(Date.UTC(year, month - 1 + offset, 1));
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)
  ).getUTCDate();
  const targetDay = Math.min(day, lastDay);

  return [
    target.getUTCFullYear(),
    String(target.getUTCMonth() + 1).padStart(2, '0'),
    String(targetDay).padStart(2, '0'),
  ].join('-');
}

const [orders, sponsors] = await Promise.all([
  queryAll('query-order'),
  queryAll('query-sponsor'),
]);
const nicknames = new Map(
  sponsors.map((sponsor) => [sponsor.user.user_id, sponsor.user.name])
);
const entries = orders
  .filter((order) => order.status === 2 && order.product_type === 0)
  .flatMap((order) => {
    const date = orderDate(order);
    if (!date || Number(order.total_amount) <= 0) return [];

    const months = Math.max(1, Number(order.month) || 1);
    const entry = {
      nickname: nicknames.get(order.user_id) || '匿名',
      message: String(order.remark || '').trim(),
    };

    return Array.from({ length: months }, (_, offset) => ({
      ...entry,
      date: addMonths(date, offset),
    }));
  })
  .sort((left, right) => right.date.localeCompare(left.date));

await writeFile(output, `${JSON.stringify(entries, null, 2)}\n`);
process.stdout.write(`Synced ${entries.length} Afdian orders.\n`);
