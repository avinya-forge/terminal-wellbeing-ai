import { ParsedCommand } from "../../utils/commandParser";
import { searchResources, Resource } from "../../data/resources";

/**
 * Handle the resources command to list or search mental health resources
 * @param parsed Parsed command object
 * @returns Formatted list of resources
 */
export async function handleResourcesCommand(parsed: ParsedCommand): Promise<string> {
  const query = parsed.args.join(' ').trim();

  const results = searchResources(query);

  if (results.length === 0) {
    return `No resources found for "${query}".

Try simpler keywords like "anxiety", "youth", "crisis", or just type /resources to see all available help.`;
  }

  const title = query
    ? `Mental Health Resources matching "${query}":`
    : `Mental Health Resources:`;

  return formatResourceList(results, title);
}

function formatResourceList(resources: Resource[], title: string): string {
  let response = `${title}\n\n`;

  resources.forEach(resource => {
    response += `• ${resource.name} [${resource.category}]\n`;
    response += `  ${resource.contact}\n`;
    response += `  ${resource.description}\n\n`;
  });

  if (resources.length > 5 && !title.includes("matching")) {
    response += `Tip: You can search resources by typing /resources <topic> (e.g., /resources youth)`;
  } else {
    response += `Remember, seeking help is a sign of strength.`;
  }

  return response;
}
