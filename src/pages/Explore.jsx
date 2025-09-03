import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Search from "../components/Search";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { useParams } from "react-router-dom";
import NothingToSell from "../components/NothingToSell";
import Loader from "../components/Loader";

const Explore = () => {
  const { Category } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState(Category);
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setClicked(false);
      try {
        const response = await axios.get(
          `/api/products/exploreProducts?category=${category}&searchQuery=${searchQuery}&type=${type}&page=${page}`
        );

        const { products, totalPages } = response.data;
        setProducts(products);
        setTotalPages(totalPages);
        if (products.length === 0) {
          setIsEmpty(true);
        } else {
          setIsEmpty(false);
        }
      } catch (error) {
        setIsEmpty(true);
        console.error("Error fetching products:", error);
      } finally {
        setTimeout(() => setLoading(false), 2000);
      }
    };

    fetchProducts();
  }, [category, type, page, clicked]);

  useEffect(() => {
    const scroll = () => {
      window.scrollTo(0, 0);
    };
    setLoading(true);
    scroll();
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-fit flex flex-col">
          <div className="flex-grow pl-2 pr-2">
            <div className="min-w-screen p-3 flex justify-center">
              <Search
                searchQuery={searchQuery}
                setSearchQuery={handleSearchChange}
                setClicked={setClicked}
              />
            </div>
            <div className="flex justify-end gap-3 items-center relative mx-auto max-w-screen-lg pl-8 pr-8 sm:pl-0 sm:pr-0 md:pl-8 lg:pl-0 lg:pr-0 md:pr-8">
              <div>
                <select
                  id="categorySelect"
                  className="outline-none p-2 border rounded-md"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="all">Category</option>
                  <option value="furniture">Furniture</option>
                  <option value="mobiles">Mobiles</option>
                  <option value="fashion">Fashion</option>
                  <option value="electronics">Electronics</option>
                  <option value="travels">Travels</option>
                  <option value="toys">Toys</option>
                </select>
              </div>
              <div>
                <select
                  id="typeSelect"
                  className="outline-none p-2 border rounded-md"
                  value={type}
                  onChange={handleTypeChange}
                >
                  <option value="all">Type</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
            </div>
          </div>

          {isEmpty ? (
            <NothingToSell />
          ) : (
            <div className="min-h-screen flex pr-2 pl-2 justify-center items-start mt-2 sm:mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <ProductCard product={product} key={index} />
                ))}
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-center gap-2 mx-auto max-w-screen-lg pl-8 pr-8 sm:pl-0 sm:pr-0 md:pl-8 lg:pl-0 lg:pr-0 md:pr-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Explore;
