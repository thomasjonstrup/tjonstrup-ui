import { z } from 'zod';
import path from 'path';
import { Command } from 'commander';

const initOptionsSchema = z.object({
	cwd: z.string(),
	yes: z.boolean(),
	defaults: z.boolean(),
});

export const init = new Command()
	.name('init')
	.description('Initialize a new project')
	.option('-y, --yes', 'skip confirmation prompt.', false)
	.option('-d, --defaults', 'use default configuration.', false) // Fixed typo
	.option(
		'-c, --cwd <cwd>',
		'the working directory. defaults to the current directory.',
		process.cwd()
	)
	.action(async (opts: any) => {
		try {
			console.log('Received options:', opts); // Log the raw options
			const options = initOptionsSchema.parse(opts);
			console.log('Parsed options:', options);
			const cwd = path.resolve(options.cwd);
			console.log('Resolved working directory:', cwd);
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error('Error parsing options:', error.message);
				console.error('Stack trace:', error.stack);
			}
			process.exit(1); // Exit with failure code
		}
	});
