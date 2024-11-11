export const GET_ERROR_MESSAGE_ON_EXCEPTION = (error) => {
    // Access and log exception details from the stack trace
    console.error(error);
    const stackLines = error.stack.split("\n");
    if (stackLines.length >= 2) {
      const stackInfo = stackLines[1].trim(); // Get the second line of the stack trace
      // Extract the file name, line number, and column number
      const match = /at (.*):(\d+):(\d+)/.exec(stackInfo);
      if (match) {
        const fileName = match[1]; // File name
        const lineNumber = match[2]; // Line number
        const columnNumber = match[3]; // Column number
        return {
          error: true,
          msg: {
            "File name": fileName,
            "Line number": lineNumber,
            "Column number": columnNumber,
            "Error message": `Some error occured :-  ${error.message}`,
          },
          data: null,
        };
      }
    }
  };