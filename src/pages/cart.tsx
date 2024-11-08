import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../pages/cart-item";
import {
  addtoCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from "../redux/reducer/cartReducer";
import { CartReducerInitialState } from "../types/rediucer-types";
import { CartItem } from "../types/types";
import axios from "axios";
import { server } from "../redux/store";

const Cart = () => {
  const { cartItem, subtotal, tax, total, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );

  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;
    dispatch(addtoCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;
    dispatch(addtoCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {

    const {token,cancel} = axios.CancelToken.source();
    const timeOutId = setTimeout(() => { 
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`,{
          cancelToken: token
        })
        .then((res) => {
         dispatch(discountApplied(res.data.discount ))
          setIsValidCouponCode(true);
          dispatch(calculatePrice());
        })
        .catch((e) => {
          console.log(e.response.data.message);
          dispatch(discountApplied(0));
          setIsValidCouponCode(false);
          dispatch(calculatePrice());
        });
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
      cancel();
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItem, dispatch]);

  return (
    <div className="cart">
      {/* main section */}
      <main>
        {cartItem.length > 0 ? (
          cartItem.map((i, idx) => (
            <CartItemCard
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
              key={idx}
              cartItem={i}
            />
          ))
        ) : (
          <h1> No Item Added</h1>
        )}
      </main>
      {/* ------------------------- */}
      <aside>
        <p>Subtotal: {subtotal}</p>
        <p>Shipping Charges: {shippingCharges}</p>
        <p>Tax : {tax}</p>
        <p>
          Discount-<em className="red"> {discount}</em>{" "}
        </p>
        <p>
          <strong>Total : {total}</strong>
        </p>

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              {" "}
              Rs {discount} off using the <code> {couponCode}</code>{" "}
            </span>
          ) : (
            <span className="red">
              {" "}
              Invalid Coupon <VscError />
            </span>
          ))}

        {cartItem.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
