@echo off
echo Setting up HaulSync Backend with SQLite...

echo Generating Prisma client...
npx prisma generate

echo Running database migration...
npx prisma migrate dev --name init

echo Seeding database...
npm run prisma:seed

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Run 'npm run dev' to start the development server
echo 2. API will be available at http://localhost:5000
echo.
echo Test accounts:
echo Admin: admin@haulsync.com / admin123
echo Operator: operator@haulsync.com / operator123
echo Driver: driver@haulsync.com / driver123