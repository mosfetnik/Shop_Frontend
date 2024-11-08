import { useState } from "react";
import ProductCard from "../components/product-cart";
import {
  useCategoriesQuery,
  useSearchProductQuery,
} from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addtoCart } from "../redux/reducer/cartReducer";

const Search = () => {
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);



  const dispatch= useDispatch();
  const { isLoading: productLoading, data: searchedData, isError:productIsError, error:productError} =
    useSearchProductQuery({
      search,
      sort,
      category,
      page,
      price: maxPrice,
    });
  console.log(searchedData);
  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");

    dispatch(addtoCart(cartItem));
    toast.success("Added to cart");
  };


  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  if (isError) {
    toast.error((error as CustomError).data.message);
  }
  if (productIsError) {
    toast.error((productError as CustomError).data.message);
  }

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          {/* // * Sort Section  */}
          <h4> Sorts</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value=""> None</option>
            <option value="asc"> Price (low to high)</option>
            <option value="dsc"> Price (high to low)</option>
          </select>
        </div>

        {/* //* Range section */}
        <div>
          <h4>Max Price {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={1000000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        {/*  //* category Section */}
        <div>
          <h4> Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value=""> ALL</option>
            {!loadingCategories &&
              categoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>
                  {" "}
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>

      {/*//*    ||\\        //||      ****               ****        ===========        ==========         ============
//*       ||  \\    //  ||     **  **           **     **      ||                 ||                     ||
//*       ||    \\//    ||    **    **        **               ======             ||                     ||
//!       ||            ||   **      **     **                 ||                 =====                  ||
//!       ||            ||    **    **        **               ||                 ||                     ||
//^       ||            ||     **  **           ****           ||                 ||                     ||
//&       ||            ||      ****                **         ||                 ==========             ||
//&                                                     **                          
//&                                                   **    
//&                                                  ** 
//&                                         **     **                  
//&                                            ****                                                                                   */}
      <main>
        <h1> Product</h1>
        <input
          type="text"
          placeholder="Search by name... "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {productLoading ? (
          <Loader />
        ) : (
          <div className="search-product-list">
            {searchedData?.product.map((i) => (
              <ProductCard
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handlder={addToCartHandler}
                photo={i.photo}
              />
            ))}
          </div>
        )}

        {searchedData && searchedData.totalPage > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {" "}
              {page} of {searchedData.totalPage}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;