import path from 'path';
import fs from "fs-extra";
import chalk from "chalk"

const addComponent = async (name: string) => {
	//const componentDir = path.resolve(process.cwd(), "src/components", name);
	const componentDir = path.resolve(__dirname, "../../../apps/web/components", name);
	const templatePath = path.resolve(__dirname, "../src/templates/component.tsx");

	if (fs.existsSync(componentDir)) {
		console.log(chalk.red(`Component ${name} already exists.`));
		process.exit(1);
	}

	await fs.ensureDir(componentDir);
	const template = await fs.readFile(templatePath, "utf-8");
	const content = template.replace(/__COMPONENT__/g, name);

	await fs.writeFile(path.join(componentDir, `${name}.tsx`), content);
	console.log(chalk.green(`Component ${name} created successfully!`));
}

export const addComponents = async (components: string[]): Promise<void> => {
	/*   const { cwd } = options; */
	/*   const resolvedCwd = path.resolve(cwd);
	  console.log('Resolved working directory:', resolvedCwd);
	 */
	for (const component of components) {
		/* 	const componentPath = path.resolve(resolvedCwd, component); */
		/* 	console.log('Resolved component path:', componentPath);
		 */
		try {
			await addComponent(component);
			/* console.log('componentPath', componentPath) */
			/*  await addComponent(componentPath); */
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error('Error adding component:', error.message);
				console.error('Stack trace:', error.stack);
			}
		}
	}
}