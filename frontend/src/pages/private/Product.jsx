import { useForm } from "react-hook-form";
import "../../css/product.css";

const Product = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const productSave = (data) => {
    console.log(data);
  };

  return (
    <div className="page">
      <form className="product-form" onSubmit={handleSubmit(productSave)}>
        <div className="form-header">
          <h2>Add Product</h2>
          <p>Enter product details below</p>
        </div>

        <div className="form-body">
          {/* Product Name */}
          <div className="field full">
            <label>Product Name</label>
            <input
              {...register("productName", {
                required: "Product name is required",
              })}
              type="text"
              placeholder="Wireless Headphones"
            />
            {errors.productName && (
              <span className="error">{errors.productName.message}</span>
            )}
          </div>

          {/* Price */}
          <div className="field">
            <label>Price</label>
            <input
              {...register("price", { required: "Price is required" })}
              type="number"
              placeholder="1999"
            />
            {errors.price && (
              <span className="error">{errors.price.message}</span>
            )}
          </div>

          {/* Stock */}
          <div className="field">
            <label>Stock Quantity</label>
            <input
              {...register("stockQuantity", {
                required: "Stock quantity is required",
              })}
              type="number"
              placeholder="50"
            />
            {errors.stockQuantity && (
              <span className="error">{errors.stockQuantity.message}</span>
            )}
          </div>

          {/* Description */}
          <div className="field full">
            <label>Description</label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              placeholder="Write a short product description..."
            />
            {errors.description && (
              <span className="error">{errors.description.message}</span>
            )}
          </div>

          {/* Image URL */}
          <div className="field full">
            <label>Image URL</label>
            <input
              {...register("imageUrl", {
                required: "Image URL is required",
              })}
              type="text"
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && (
              <span className="error">{errors.imageUrl.message}</span>
            )}
          </div>

          {/* Category */}
          <div className="field full">
            <label>Category</label>
            <select
              {...register("category", {
                required: "Category is required",
              })}
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home</option>
            </select>
            {errors.category && (
              <span className="error">{errors.category.message}</span>
            )}
          </div>
        </div>

        <div className="form-footer">
          <button type="submit">Save Product</button>
        </div>
      </form>
    </div>
  );
};

export default Product;
