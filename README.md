# Backend PDV (Point of Sale System)

This is a backend API for a Point of Sale (POS) system built using [NestJS](https://nestjs.com/). The project is designed to manage users, clients, products, orders, and order items. It uses Prisma as the ORM and SQLite as the database.

## Features

- **User Management**: Create and manage users.
- **Client Management**: Manage client information.
- **Product Management**: Add, update, and delete products.
- **Order Management**: Handle orders and their associated items.
- **Validation**: Input validation using `class-validator` and `class-transformer`.
- **Database**: SQLite database with Prisma ORM.
- **Testing**: Includes unit and end-to-end (e2e) tests using Jest and Supertest.
- **Code Quality**: Enforced with ESLint and Prettier.

## Technologies Used

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: SQLite
- **ORM**: [Prisma](https://www.prisma.io/)
- **Validation**: `class-validator`, `class-transformer`
- **Authentication**: `@nestjs/jwt` (if applicable)
- **Testing**: Jest, Supertest
- **Code Quality**: ESLint, Prettier
- **Dependency Management**: pnpm

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd backend-pdv
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up the environment variables:

   Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL="file:./dev.db"
   ```

4. Generate the Prisma client:

   ```bash
   pnpm prisma generate
   ```

5. Apply database migrations:

   ```bash
   pnpm prisma migrate dev
   ```

## Running the Application

### Development

To start the application in development mode:

```bash
pnpm start:dev
```

The API will be available at `http://localhost:3000`.

### Production

To build and run the application in production mode:

```bash
pnpm build
pnpm start:prod
```

### Testing

Run unit tests:

```bash
pnpm test
```

Run end-to-end (e2e) tests:

```bash
pnpm test:e2e
```

Run tests with coverage:

```bash
pnpm test:cov
```

## Project Structure

```plaintext
backend-pdv/
├── src/
│   ├── app.module.ts         # Root module
│   ├── main.ts               # Application entry point
│   ├── users/                # User module
│   ├── clients/              # Client module
│   ├── products/             # Product module
│   ├── orders/               # Order module
│   └── order-items/          # Order items module
├── prisma/
│   ├── schema.prisma         # Prisma schema
├── test/
│   ├── app.e2e-spec.ts       # End-to-end tests
├── .eslintrc.js              # ESLint configuration
├── nest-cli.json             # Nest CLI configuration
├── package.json              # Project metadata and scripts
├── pnpm-lock.yaml            # Dependency lock file
└── README.md                 # Project documentation
```

## Prisma Schema

The database schema is defined in `prisma/schema.prisma`. It includes models for:

- **Users**
- **Clients**
- **Products**
- **Orders**
- **OrderItems**

## Scripts

- `pnpm start`: Start the application.
- `pnpm start:dev`: Start the application in watch mode.
- `pnpm start:prod`: Start the application in production mode.
- `pnpm build`: Build the application.
- `pnpm test`: Run all tests.
- `pnpm test:e2e`: Run end-to-end tests.
- `pnpm test:cov`: Run tests with coverage.
- `pnpm lint`: Run ESLint.
- `pnpm format`: Format code with Prettier.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

### Developed by **Julyemerson Leonizio**.
