import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import ItemsCard from "../components/ItemsCard";
import Undo from "../components/Undo";

const Products = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [undoData, setUndoData] = useState({});
  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: `/api/admin`,
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `${token}` : "",
    },
  });

  const func = async (item) => {
    console.log(item);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(`/api/admin/addProduct`, item, {
        headers: {
          authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Product added successfully:", response.data);
      setShowModal(false);
      setUndoData({});
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const dialogFun = async (item) => {
    setUndoData(item);
    setShowModal(true);
    try {
      const response = await axiosInstance.delete(`/deleteProduct/${item.id}`);
    } catch (err) {}
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(`/api/admin/getAllProduct`, {
            headers: {
              authorization: `${token}`,
            },
            params: {
              searchQuery: searchInput,
              category: selectedCategory,
            },
          });
          const products = response.data;
          setItems(products);
          setFilteredItems(products);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      } else {
        localStorage.setItem("token", "");
      }
    };

    fetchProducts();
  }, [searchInput, selectedCategory, showModal, undoData]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value.trim());
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex p-2 sm:p-4 justify-evenly sm:justify-between">
          <div className="p-1 flex justify-between">
            <div className="p-2 bg-gray-100 w-full flex gap-1 items-center rounded-md">
              <SearchIcon />
              <input
                type="text"
                className="outline-none bg-gray-100 w-full"
                placeholder="Search..."
                value={searchInput}
                onChange={handleSearchInputChange}
              />
            </div>
          </div>
        </div>

        <div>
          {showModal && (
            <Undo
              setShowModal={setShowModal}
              func={func}
              showModel={showModal}
              data={undoData}
            />
          )}
        </div>

        <div className="pl-2 pr-2 pb-2 sm:pl-4 sm:pr-4 sm:pb-4 h-[calc(84vh - 9rem)]">
          <div className="pt-4 pb-4 pl-8 bg-gray-100">
            <select
              name=""
              id=""
              className="p-2 outline-none rounded-md"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Category</option>
              <option value="furniture">Furniture</option>
              <option value="mobiles">Mobiles</option>
              <option value="fashion">Fashion</option>
              <option value="electronics">Electronics</option>
              <option value="travels">Travels</option>
              <option value="toys">Toys</option>
            </select>
          </div>
          <div className="h-full overflow-y-auto">
            <div className="w-full bg-gray-100 flex flex-col">
              <div className="flex justify-center gap-2 p-2">
                <div className="flex flex-wrap w-full p-2 justify-center md:justify-start sm:justify-start gap-4">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, id) => (
                      <ItemsCard item={item} key={id} dialogFun={dialogFun} />
                    ))
                  ) : (
                    <div>No data....</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Products;
