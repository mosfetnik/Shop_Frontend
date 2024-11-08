import { ChangeEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CartReducerInitialState } from "../types/rediucer-types";



declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}


const Shipping = () => {
  const { cartItem } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );

  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (cartItem.length <= 0) return navigate("/cart");
  }, [cartItem]);

  const amount = 4000;
  const currency = "INR";
  const receiptId = "order_recptid_11";

  const paymentHandler = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/payment/create`, {
        method: "POST",
        body: JSON.stringify({
          amount,
          currency,
          receipt:receiptId
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const order = await response.json();
      console.log(order);
  
      const options = {
        key: "rzp_test_lmIi136l4yIzKW", // Replace with your live/test key
        amount,
        currency,
        name: "Acme Corp.",
        description: "Monthly Test Plan",
        order_id:order.id,// Pass the order ID obtained from the backend
        handler: function (response:RazorpayResponse) {
          alert("Payment ID: " + response.razorpay_payment_id);
          alert("Order ID: " + response.razorpay_order_id);
          alert("Razorpay Signature: " + response.razorpay_signature);
        },
        prefill: {
          name: "aditya rai",
          email: "adityarai@example.com",
          contact: "+919307647378",
        },
        notes: {
          note_key_1: "Tea. Earl Grey. Hot",
          note_key_2: "Make it so.",
        },
        theme: {
          color: "#F37254",
        },
      };
  
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error in paymentHandler:", error);
    }
  };
  

  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>

      <form>
        <h1>Shipong Address</h1>
        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="city"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="state"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />

        <select
          required
          name="country"
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value=" ">Choose Country</option>
          <option value="in">India</option>
          <option value="in">U.S.A</option>
        </select>

        <input
          required
          type="number"
          placeholder="pin code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />
        <button type="button" onClick={paymentHandler} id='rzp-button1'>
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default Shipping;
