import { Link } from "react-router-dom";
import ProductCard from "../components/product-cart";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import { useDispatch } from "react-redux";
import { CartItem } from "../types/types";
import { addtoCart } from "../redux/reducer/cartReducer";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");

    dispatch(addtoCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) {
    toast.error("Cannot Fetch the error");
  }
  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Product
        <Link to="/search" className="findmore">
          More{" "}
        </Link>
      </h1>

      <main className="product-count">
        {isLoading ? (
          <Skeleton width="80vw" />
        ) : (
          data?.product.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handlder={addToCartHandler}
              photo={i.photo}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
