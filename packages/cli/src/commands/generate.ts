import { Command } from "commander";
/* import inquirer from "inquirer"; */
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export const generate = new Command()
	.name("generate")
	.description("Generate a new component")
	.argument("<name>", "Name of the component")
	.action(async (name) => {
		const componentDir = path.resolve(process.cwd(), "src/components", name);
		const templatePath = path.resolve(__dirname, "../templates/component.tsx");

		if (fs.existsSync(componentDir)) {
			console.log(chalk.red(`Component ${name} already exists.`));
			process.exit(1);
		}

		await fs.ensureDir(componentDir);
		const template = await fs.readFile(templatePath, "utf-8");
		const content = template.replace(/__COMPONENT__/g, name);

		await fs.writeFile(path.join(componentDir, `${name}.tsx`), content);
		console.log(chalk.green(`Component ${name} created successfully!`));
	});