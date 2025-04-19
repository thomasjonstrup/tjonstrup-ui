import { z } from 'zod';
import path from 'path';
import { Command } from 'commander';
import { addComponents } from '../utils/add-components';

export const addOptionsSchema = z.object({
	components: z.array(z.string()).optional(),
	/* cwd: z.string(), */
});

export const add = new Command()
	.name('add')
	.description('Add components and dependencies to your project')
	.option(
		'-c, --components <components...>',
		'list of components to add',
		[]
	)
	.option(
		'-d, --cwd <cwd>',
		'the working directory. defaults to the current directory.',
		process.cwd()
	)
	.action(async ({ components }, opts) => {
		try {
			const options = addOptionsSchema.parse(opts);
			//const cwd = path.resolve(options.cwd);
			await addComponents(components);
			/* if (options.components) {
				console.log('Components to add:', options.components);
				addComponents(options.components);
			} */
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error('Error parsing options:', error.message);
				console.error('Stack trace:', error.stack);
			}
			process.exit(1); // Exit with failure code
		}
	});