export function formatCredit(credit: number) {
  return Number.isInteger(credit) ? credit.toFixed(1) : credit.toString();
}
