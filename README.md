A **Next.js** e-commerce project with **PostgreSQL (Prisma)** backend, authentication, cart, and order management. This project demonstrates a full-stack setup with basic e-commerce features.
Features
•	**Authentication**
- Email/password and OAuth (Google) and Session management with `next-auth`
- Admin and User dashboard
•	**Product Management**
- Add, edit, and view products
- Product images upload
•	**Shopping Cart**
- Add products to cart
- View and update cart items
•	**Orders**
- Place orders
- Order history for logged-in users
•	**User Profile**
- Update username and shipping address
> Note: Payment integration, Email SMTP and advanced filters/search are not implemented yet.
-Technologies Used
1.	Next.js (App Router)
2.	React 
3.	TypeScript
4.	Prisma ORM
5.	PostgreSQL
6.	next-auth
7.	React Hook Form + Zod
8.	Sonner for notifications
Setup
10.	Clone the repository:
```
git clone https://github.com/njmeN/next-ecommerce.git
cd next-ecommerce
```
11.	Install dependencies:
npm install
```
12.	Set up environment variables:
Create a `.env` file and add:
DATABASE_URL=<your_postgresql_connection_url>
NEXTAUTH_SECRET=<your_secret>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
```
13.	Apply Prisma migrations:
npx prisma migrate dev
```
14.	Run the development server:
npm run dev
```
15.	Open [http://localhost:3000](http://localhost:3000) in your browser.
Project Structure
/app
  </br>/account      # User profile, orders, address
    </br>/cart         # Shopping cart pages
  </br>/shop         # Product listing and details
  </br>/lib
   </br>/actions      # Server-side actions for CRUD
   </br>/validation   # Zod schemas
   </br>/contexts     # React contexts (cart, session)
  </br>/components    # Reusable UI components
  </br>/prisma        # Prisma schema
Notes
</br>
•	OAuth login requires correct callback URLs for development and production.</br>
•	All data is stored in PostgreSQL via Prisma.</br>
•	Error handling is implemented for database operations.</br>
•	Some features like payment, search filters, and admin order management are planned but not yet implemented.</br>
