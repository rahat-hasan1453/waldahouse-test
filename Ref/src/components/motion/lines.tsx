import { Children, Fragment, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { T } from "@/lib/i18n/provider";
import { TWords } from "./lines-client";

type State = { line: number; key: number };

type TProps = Parameters<typeof T>[0];

/** The heading's text for screen readers: strings as they are, translated nodes as <T>. */
function plain(node: ReactNode, out: ReactNode[] = []): ReactNode[] {
  if (node == null || typeof node === "boolean") return out;
  if (typeof node === "string" || typeof node === "number") {
    out.push(String(node).replace(/\s+/g, " "));
  } else if (Array.isArray(node)) {
    for (const n of node) plain(n, out);
  } else if (isValidElement(node)) {
    if (node.type === "br") out.push(" ");
    else if (node.type === T) out.push(<T key={`s${out.length}`} {...(node.props as TProps)} />);
    else plain((node as ReactElement<{ children?: ReactNode }>).props.children, out);
  }
  return out;
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
    // translated text is split into words in the browser, once the language is known
    if (node.type === T) {
      out.push(<TWords key={`t${s.key++}`} {...(node.props as TProps)} line={s.line} />);
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
      <span className="sr-only">{plain(children)}</span>
      <span aria-hidden className={`lines ${mode === "intro" ? "lines-intro" : ""}`}>
        {out}
      </span>
    </>
  );
}
