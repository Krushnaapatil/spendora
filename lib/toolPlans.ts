export const TOOL_PLANS = {
  chatgpt: [
    "plus",
    "team",
    "enterprise",
    "api",
  ],

  claude: [
    "free",
    "pro",
    "max",
    "team",
    "enterprise",
    "api",
  ],

  cursor: [
    "hobby",
    "pro",
    "business",
    "enterprise",
  ],

  "github-copilot": [
    "individual",
    "business",
    "enterprise",
  ],

  gemini: [
    "pro",
    "business",
    "enterprise",
  ],

  windsurf: [
    "free",
    "pro",
    "team",
  ],
} as const;

export type ToolName =
  keyof typeof TOOL_PLANS;

export const TOOL_OPTIONS =
  Object.keys(
    TOOL_PLANS
  ) as ToolName[];

export function formatToolName(
  tool: ToolName
) {
  switch (tool) {
    case "chatgpt":
      return "ChatGPT";

    case "claude":
      return "Claude";

    case "cursor":
      return "Cursor";

    case "github-copilot":
      return "GitHub Copilot";

    case "gemini":
      return "Gemini";

    case "windsurf":
      return "Windsurf";

    default:
      return tool;
  }
}
