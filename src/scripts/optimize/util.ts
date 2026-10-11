import
  postcss,
  {
    type Rule,
    type AtRule,
    type ChildNode,
  }
from "postcss";

type CSSRuleTransformFn = (rule: Rule) => Rule;

function node2Str(
  nodes: ChildNode[] = [],
  transform: CSSRuleTransformFn,
): string {
  return nodes
    .map((child: ChildNode): string => {
        if (child.type === "decl") {
          return child.toString() + ";";
        }

        else if (child.type === "rule" || child.type === "atrule") {
          return getCSSRuleStr(child, transform);
        }

        return "";
      })
    .join(" ");
}

function getCSSRuleStr(
  node: Rule | AtRule | ChildNode,
  transform: CSSRuleTransformFn,
): string {

  if (node.type === "rule") {
    if (transform) node = transform(node);
    return `${node.selector} { ${node2Str(node.nodes, transform)} }`;
  }

  else if (node.type === "atrule") {
    return `@${node.name} ${node.params} { ${node2Str(node.nodes, transform)} }`;
  }

  return "";
}

export async function getCSSRulesArr(
  rawCSS: string,
  transform: CSSRuleTransformFn,
): Promise<string[]> {
  return postcss
    .parse(rawCSS, { from: undefined })
    .nodes
    .map((node: ChildNode) => {
      return getCSSRuleStr(node!, transform);
    })
    .filter((str: string) => str.trim().length > 0)
  ;
}

export function num2alph(
  num: number,
): string {

  num++;

  let output = "";

  while (num > 0) {
    output = String.fromCharCode(97 + (--num % 26)) + output;
    num = Math.floor(num / 26);
  }

  return output;

};
