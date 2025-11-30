
          // Step 3: Data Return
          logs.push(`[MCP] Waiting for tool result...`);
          setActiveTask(prev => ({ ...prev, logs: [...logs] }));
          
          const toolResult: any = await mcpToolExecution(toolName, toolArgs);
          
          logs.push(`[MCP] Tool Result:\n${JSON.stringify(toolResult.result || toolResult, null, 2)}`);
          setActiveTask(prev => ({ ...prev, logs: [...logs] }));
          await new Promise(r => setTimeout(r, 800));
          
          // Step 4: Continued Generation
          logs.push(`[Agent] Generating final response based on tool data...`);
      } else {
