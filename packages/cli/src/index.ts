#!/usr/bin/env node
import { init } from './commands/init';
import { Command } from 'commander';

async function main() {
	const program = new Command()
		.name('rn-ui')
		.description('add components and dependencies to your project')
		.version('0.0.1', '-v, --version', 'display the version number');

	program.addCommand(init);

	program.parse();
}

main();