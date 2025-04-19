import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export const init = new Command()
	.name("init")
	.description("Initialize a new project with the component library")
	.action(async () => {
		const targetDir = process.cwd();
		console.log(chalk.green("Initializing project..."));

		// Copy Tailwind config and other setup files
		const templateDir = path.resolve(__dirname, "../templates");
		await fs.copy(templateDir, targetDir);

		console.log(chalk.green("Project initialized successfully!"));
	});