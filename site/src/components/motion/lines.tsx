import { Children, Fragment, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react";

type State = { line: number; key: number };

function plain(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plain).join("");
  if (isValidElement(node)) {
    if (node.type === "br") return " ";
    return plain((node as ReactElement<{ children?: ReactNode }>).props.children);
  }
  return "";
}

function mask(content: ReactNode, s: State) {
  return (
    <span key={`m${s.key++}`} className="line-mask">
      <span className="line-inner" style={{ "--line": s.line } as CSSProperties}>
        {content}
      </span>
    </span>
  );
}

function split(node: ReactNode, s: State, out: ReactNode[]) {
  if (node == null || typeof node === "boolean") return;
  if (typeof node === "string" || typeof node === "number") {
    for (const part of String(node).split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) out.push(" ");
      else out.push(mask(part, s));
    }
    return;
  }
  if (Array.isArray(node)) {
    for (const n of node) split(n, s, out);
    return;
  }
  if (isValidElement(node)) {
    if (node.type === "br") {
      out.push(<br key={`b${s.key++}`} />);
      s.line++;
      return;
    }
    if (node.type === Fragment) {
      Children.forEach((node as ReactElement<{ children?: ReactNode }>).props.children, (c) => split(c, s, out));
      return;
    }
    // any element (a foil span, an em…) is masked whole, never split, so a gradient never restarts per word
    out.push(mask(node, s));
  }
}

/**
 * Line-mask headings: each word rises out of its own mask, line by line (<br/> starts a new
 * line). Put it inside a heading; it does not change size, tracking or line-height.
 * mode="reveal" runs when an ancestor <Reveal> becomes visible; mode="intro" runs on load (heroes).
 */
export function Lines({ children, mode = "reveal" }: { children: ReactNode; mode?: "reveal" | "intro" }) {
  const out: ReactNode[] = [];
  split(children, { line: 0, key: 0 }, out);
  return (
    <>
      <span className="sr-only">{plain(children).replace(/\s+/g, " ").trim()}</span>
      <span aria-hidden className={`lines ${mode === "intro" ? "lines-intro" : ""}`}>
        {out}
      </span>
    </>
  );
}
