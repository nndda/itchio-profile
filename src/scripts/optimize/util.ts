import
  postcss,
  {
    type Rule,
    type AtRule,
    type ChildNode,
  }
from "postcss";

function node2Str(nodes: ChildNode[] = []): string {
  return nodes
    .map((child: ChildNode): string => {
        if (child.type === "decl") {
          return child.toString() + ";";
        }

        else if (child.type === "rule" || child.type === "atrule") {
          return getCSSRuleStr(child);
        }

        return "";
      })
    .join(" ");
}

function getCSSRuleStr(
  node: Rule | AtRule
): string {

  if (node.type === "rule") {
    return `${node.selector} { ${node2Str(node.nodes)} }`;
  }

  else if (node.type === "atrule") {
    return `@${node.name} ${node.params} { ${node2Str(node.nodes)} }`;
  }

  return "";
}

export async function getCSSRulesArr(
  rawCSS: string,
): Promise<string[]> {
  return postcss
    .parse(rawCSS, { from: undefined })
    .nodes
    .map(getCSSRuleStr as (node: ChildNode) => string)
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
