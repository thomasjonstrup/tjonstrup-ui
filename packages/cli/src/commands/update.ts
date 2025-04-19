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
	.option("-u, --update <key> <value>", "Update a configuration value")
	.action(async (options) => {
		try {
			// Ensure the config file exists or create an empty one
			const config = (await fs.readJson(configPath).catch(() => ({}))) as Record<string, any>;

			if (options.set) {
				// Set a new configuration value
				const [key, value] = options.set;
				config[key] = value;
				await fs.writeJson(configPath, config, { spaces: 2 });
				console.log(chalk.green(`Configuration set: ${key} = ${value}`));
			} else if (options.get) {
				// Get a specific configuration value
				console.log(chalk.green(`${options.get}: ${config[options.get] || "Not set"}`));
			} else if (options.update) {
				// Update an existing configuration value
				const [key, value] = options.update;
				if (config[key] === undefined) {
					console.log(chalk.red(`Configuration key "${key}" does not exist. Use --set to create it.`));
				} else {
					config[key] = value;
					await fs.writeJson(configPath, config, { spaces: 2 });
					console.log(chalk.green(`Configuration updated: ${key} = ${value}`));
				}
			} else {
				console.log(chalk.yellow("No options provided. Use --help for usage."));
			}
		} catch (error) {
			console.error(chalk.red("An error occurred while managing the configuration:"), error);
		}
	});