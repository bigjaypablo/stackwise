const LIST = /^\s*([-*+]|\d+[.)])\s+/;
const HEADING = /^#{1,6}\s/;
const RULE = /^\s*(-{3,}|\*{3,}|_{3,})\s*$/;
const FENCE = /^\s*(```|~~~)/;

const isTable = (line: string) => line.trim().startsWith("|");
const isQuote = (line: string) => /^\s*>/.test(line);
const isIndented = (line: string) => /^(\s{2,}|\t)\S/.test(line);
const pipesIn = (line: string) => (line.match(/\|/g) ?? []).length;

/** Glue table rows that were broken across lines back together. */
function repairTables(lines: string[]): string[] {
  const out: string[] = [];
  let inFence = false;
  let expected = 0;

  for (let i = 0; i < lines.length; i += 1) {
    let line = lines[i];
    if (FENCE.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence || !isTable(line)) {
      if (!inFence) expected = 0;
      out.push(line);
      continue;
    }

    let guard = 0;
    while (i + 1 < lines.length && guard < 8) {
      const closed = line.trimEnd().endsWith("|");
      const enough = expected ? pipesIn(line) >= expected : closed;
      if (closed && enough) break;
      const next = lines[i + 1];
      if (next.trim() === "") break;
      line = `${line.trimEnd()} ${next.trim()}`;
      i += 1;
      guard += 1;
    }
    if ((line.match(/\*\*/g) ?? []).length % 2 === 1) line = line.replace("**", "");
    if (!expected) expected = pipesIn(line);
    out.push(line);
  }
  return out;
}

/** Makes pasted or older markdown render with proper paragraphs, lists and tables. */
export function cleanMarkdown(input: string): string {
  const text = input
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+$/gm, "");
  const lines = repairTables(text.split("\n").map((line) => line.replace(/^(\s*)[•·]\s+/, "$1- ")));

  const out: string[] = [];
  let inFence = false;

  for (const line of lines) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }
    if (line.trim() === "") {
      if (out.length && out[out.length - 1] !== "") out.push("");
      continue;
    }

    const prev = out.length ? out[out.length - 1] : "";
    if (prev !== "") {
      const curList = LIST.test(line);
      const prevList = LIST.test(prev);
      const curTable = isTable(line);
      const prevTable = isTable(prev);
      let split = false;

      if (HEADING.test(line) || HEADING.test(prev) || RULE.test(line) || RULE.test(prev)) split = true;
      else if (curTable !== prevTable) split = true;
      else if (isQuote(line) !== isQuote(prev)) split = true;
      else if (curList !== prevList && !isIndented(line)) split = true;
      else if (!curList && !curTable && !prevList && !prevTable && !isQuote(line) && !isIndented(line)) split = true;

      if (split) out.push("");
    }
    out.push(line);
  }

  while (out.length && out[out.length - 1] === "") out.pop();
  return out.join("\n");
}

export function looksLikeMarkdown(text: string): boolean {
  return (
    /(^|\n)#{1,6}\s\S/.test(text) ||
    /\*\*[^*\n]+\*\*/.test(text) ||
    /(^|\n)\s*([-*+]|\d+[.)])\s+\S/.test(text) ||
    /(^|\n)\s*\|.+\|/.test(text)
  );
}
