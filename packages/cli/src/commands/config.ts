import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const configPath = path.resolve(process.cwd(), "shadcn.config.json");

export const config = new Command()
	.name("config")
	.description("Manage CLI configurations")
	.option("-s, --set <key> <value>", "Set a configuration value")
	.option("-g, --get <key>", "Get a configuration value")
	.action(async (options) => {
		if (options.set) {
			const [key, value] = options.set;
			const config = (await fs.readJson(configPath).catch(() => ({}))) as Record<string, any>;
			config[key] = value;
			await fs.writeJson(configPath, config, { spaces: 2 });
			console.log(chalk.green(`Configuration updated: ${key} = ${value}`));
		} else if (options.get) {
			const config = (await fs.readJson(configPath).catch(() => ({}))) as Record<string, any>;
			console.log(chalk.green(`${options.get}: ${config[options.get] || "Not set"}`));
		} else {
			console.log(chalk.yellow("No options provided. Use --help for usage."));
		}
	});