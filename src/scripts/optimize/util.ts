import
  postcss,
  {
    type Rule,
    type AtRule,
    type Declaration,
    type ChildNode,
  }
from "postcss";

function getCSSRuleStr(
  node: Rule | AtRule
): string {

  function factoryProperty(decl: Declaration): string {
    // return `${decl.prop}: ${decl.value};`;
    return decl.toString() + ";";
  }

  function isDeclaration(node: ChildNode): node is Declaration {
    return node.type === "decl";
  }

  function isRule(node: ChildNode): node is Rule {
    return node.type === "rule";
  }

  if (node.type === "rule") {
    return `${node.selector} { ${
      node.nodes
        .filter(isDeclaration)
        .map(factoryProperty)
        .join(" ")
    } }`;
  }

  if (node.type === "atrule") {

    if (node.name === "media") {
      return `@media ${node.params} { ${
        (node.nodes as ChildNode[])
          .map(getCSSRuleStr as (node: ChildNode) => string)
          .join(" ")
      } }`;
    }

    if (node.name === "keyframes") {
      return `@keyframes ${node.params} { ${
        (node.nodes as ChildNode[])
          .filter(isRule)
          .map((kf: Rule) => {
            return `${kf.selector} { ${
              kf.nodes
                .filter(isDeclaration)
                .map(factoryProperty)
                .join(" ")
            } }`;
          })
          .join(" ")
      } }`;
    }

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
