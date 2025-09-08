import { CartTable } from "./cartTable";
import CartCheckoutSection from "./checkoutSection";

export default function CartPage() {
  
  return (
    <main className="main">
      <section className="breadcrumb">
        <ul className="breadcrumb__list flex container">
          <li><a href="/" className="breadcrumb__link">Home</a></li>
          <li><span className="breadcrumb__link">{" > "}</span></li>
          <li><span className="breadcrumb__link">Cart</span></li>
        </ul>
      </section>

      <section className="cart section__lg container">
        <CartTable />
      </section>
      <div className="divider"></div>
      <section className="cart section__lg container"><CartCheckoutSection /></section>
      
    </main>
  );
}

  