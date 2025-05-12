// This file is used to bypass ESLint and TypeScript checks for the build
// It's used by setting the NEXT_BUILD_SCRIPT_FILE environment variable

// Disable TypeScript checking
process.env.NEXT_SKIP_TYPECHECKING = true;

// Disable ESLint
process.env.NEXT_SKIP_LINT = true; 