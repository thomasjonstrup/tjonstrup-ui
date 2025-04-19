#!/usr/bin/env node

import { Command } from "commander";

import { init } from './commands/init';
import { getPackageInfo } from "./utils/get-package-info";
import { add } from "./commands/add";

async function main() {
	const packageInfo = await getPackageInfo();

	try {
		const program = new Command()
			.name('tjonstrup-ui')
			.description('add components and dependencies to your project')
			.version(packageInfo.version || '1.0.0', '-v, --version', 'display the version number');

		program.addCommand(init);
		program.addCommand(add);

		program.parse();/*  */
	} catch (error) {
	}
}

main();


/* const program = new Command();

program
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .option("-l, --ls  [value]", "List directory contents")
  .option("-m, --mkdir <value>", "Create a directory")
  .option("-t, --touch <value>", "Create a file")
  .parse(process.argv);

const options = program.opts(); */