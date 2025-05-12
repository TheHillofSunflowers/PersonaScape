@echo off
echo Building with TypeScript and ESLint checks disabled...
set NEXT_SKIP_TYPECHECKING=1
set NEXT_SKIP_LINT=1
npx next build
echo Build completed! 