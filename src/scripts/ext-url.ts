import {
  readTxtFile,
  writeTxtFile,
} from "./util";

export default function(): void {

  writeTxtFile("./dist/urls.txt", [...new Set(
      [
        ...(
          readTxtFile("./dist/i.css") +
          readTxtFile("./dist/styles.css") +
          readTxtFile("./dist/content.html")
        )
        .matchAll(/src=['"](.*?)['"]|url\((['"]?)(.*?)\2\)/g)
      ]
      .flatMap(
          (match: RegExpExecArray) => [match[1], match[3]]
        )
    )]
    .sort()
    .join("\n")
  );

}