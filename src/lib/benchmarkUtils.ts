import { Benchmark, benchmarkData } from './benchmarks';

export function getRandomBenchmarkItem(benchmark: Benchmark) {
  const items = benchmarkData[benchmark].questions;
  return items[Math.floor(Math.random() * items.length)];
}

export function getBenchmarkInstructions(benchmark: Benchmark) {
  return benchmarkData[benchmark].instructions;
}