import { path, green, red, bold } from "./deps.ts";

if (Deno.args.length != 3) {
  if (Deno.args.length > 3) {
    throw new Error("grep: to much args.");
  } else {
    throw new Error("grep: missing args.");
  }
}

const [, text, filePath] = Deno.args;

try {
  const content = await Deno.readFile(path.resolve(Deno.cwd(), filePath));

  let lineNumber = 1;
  for (const line of new TextDecoder().decode(content).split("\n")) {
    if (line.includes(text)) {
      console.log(
        `${green(`(${lineNumber})`)} ${line.replace(text, red(bold(text)))}`
      );
    }
    lineNumber++;
  }
} catch (error) {
  console.error(`grep: error during process.\n${error}`);
}
