````markdown
# TaskFlow

TaskFlow is a project management tool inspired by Trello. It allows users to collaborate, manage projects, and reach new productivity peaks.

## Project Structure

The project is structured as follows:

- **app/**: Contains the main application components and pages.
- **components/**: Reusable UI components.
- **hooks/**: Custom React hooks.
- **lib/**: Utility functions and libraries.
- **prisma/**: Prisma schema and database configuration.
- **public/**: Static assets.
- **styles/**: Global styles and CSS files.

## Dependencies

The project uses the following dependencies:

- `@clerk/nextjs`: Clerk authentication for Next.js.
- `@radix-ui/react`: Fully accessible UI components.
- `@prisma/client`: Prisma Client is an auto-generated query builder that enables type-safe database access.
- `axios`: Promise based HTTP client for the browser and node.js.
- `clsx`: A utility for constructing `className` strings conditionally.
- `dnd-kit`: Drag and drop toolkit for React.
- `date-fns`: Date functions library.
- `lodash`: JS utility functions.
- `react-query`: Hooks for fetching, caching, and updating asynchronous data in React. For Global Remote state management.
- `usehooks-ts`: React hook library, ready to use, written in Typescript.
- `zod`: TypeScript-first schema declaration and validation library.
- `lucide-react`: Icon library
- `sonner`: Toast notifications
- `stripe`: Payment service
- `unsplash-js`: Photo service
- `zustand`: Global local state management

## Dev Dependencies

The project uses the following dev dependencies:

- `@types/node`: TypeScript definitions for Node.js.
- `@types/react`: TypeScript definitions for React.
- `@typescript-eslint/eslint-plugin`: ESLint plugin for TypeScript.
- `@typescript-eslint/parser`: TypeScript parser for ESLint.
- `eslint`: A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
- `eslint-config-next`: ESLint configuration for Next.js.
- `eslint-config-prettier`: Turns off all rules that are unnecessary or might conflict with Prettier.
- `eslint-plugin-prettier`: Runs Prettier as an ESLint rule.
- `prettier`: An opinionated code formatter.
- `typescript`: JavaScript with syntax for types.

## Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

```env
DATABASE_URL="your-database-url"
NEXT_PUBLIC_API_URL="your-api-url"
```

## Middleware

This project uses middleware to protect routes and handle authentication. Public routes include:

- `/`
- `/api/webhook`
- `/sign-in(.*)`
- `/sign-up(.*)`

## Custom Hooks

The project includes custom hooks such as `useAction` for handling actions with state management.

## Prisma

Prisma is used for database management. The schema is defined in `prisma/schema.prisma`.

## License

This project is licensed under the MIT License.

```

```
````
