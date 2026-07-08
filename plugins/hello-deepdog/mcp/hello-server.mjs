import readline from "node:readline";

const serverInfo = {
  name: "hello-deepdog",
  version: "1.0.0",
};

const helloTool = {
  name: "hello",
  description: "Return a short greeting from the hello-deepdog MCP demo.",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Optional name to include in the greeting.",
      },
    },
    additionalProperties: false,
  },
};

// 这个 demo 故意只实现最小 MCP 方法，方便 DeepDog 客户端联调加载、列工具和调用工具三步。
function buildResult(request, result) {
  return {
    jsonrpc: "2.0",
    id: request.id,
    result,
  };
}

function buildError(request, code, message) {
  return {
    jsonrpc: "2.0",
    id: request?.id ?? null,
    error: { code, message },
  };
}

function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

// 这里按方法名显式分发，避免 demo 引入 SDK 依赖后干扰最小插件结构。
function handleRequest(request) {
  if (request.method === "initialize") {
    return buildResult(request, {
      protocolVersion: request.params?.protocolVersion ?? "2024-11-05",
      capabilities: {
        tools: {},
      },
      serverInfo,
    });
  }

  if (request.method === "tools/list") {
    return buildResult(request, {
      tools: [helloTool],
    });
  }

  if (request.method === "tools/call") {
    const toolName = request.params?.name;
    if (toolName !== "hello") {
      return buildError(request, -32602, `Unknown tool: ${toolName}`);
    }

    // 工具参数允许为空，便于先验证 MCP 链路，再逐步测试参数传递。
    const name = request.params?.arguments?.name || "DeepDog";
    return buildResult(request, {
      content: [
        {
          type: "text",
          text: `你好，${name}！这条消息来自 hello-deepdog MCP demo。`,
        },
      ],
    });
  }

  if (request.id === undefined) {
    return null;
  }

  return buildError(request, -32601, `Method not found: ${request.method}`);
}

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

rl.on("line", (line) => {
  const text = line.trim();
  if (!text) {
    return;
  }

  try {
    const request = JSON.parse(text);
    const response = handleRequest(request);
    if (response) {
      writeMessage(response);
    }
  } catch (error) {
    // 解析错误必须显式返回，方便 DeepDog 客户端在联调时看到失败原因。
    writeMessage(buildError(null, -32700, `Parse error: ${error.message}`));
  }
});
