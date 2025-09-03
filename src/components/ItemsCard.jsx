import React from "react";
import InventoryIcon from "@mui/icons-material/Inventory";
import DeleteIcon from "@mui/icons-material/Delete";

const ItemsCard = ({ item, dialogFun }) => {
  const itemName =
    item.name.length > 15 ? <>{`${item.name.slice(0, 15)}...`}</> : item.name;

  return (
    <div className="relative flex flex-col items-center p-4 bg-white shadow-md rounded-lg w-56 h-70 overflow-hidden">
      <button
        className="absolute top-2 right-2 text-red-500"
        onClick={() => {
          dialogFun(item);
        }}
      >
        <DeleteIcon />
      </button>

      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg w-56 h-70 overflow-hidden">
        <img
          src={item.images[0].images[0].url}
          alt={item.name}
          className="w-full h-40 object-contain mb-4"
        />
        <div className="flex flex-col w-full items-center gap-4">
          <div className="text-md font-semibold">{itemName}</div>
          <div className="flex flex-col w-full items-center gap-4">
            <div className="flex w-full justify-between items-start">
              <div className="text-gray-600 text-base mb-2">
                Rs.{item.price}
              </div>
              <div className="text-gray-600 flex items-center justify-center mb-2 gap-1">
                <InventoryIcon sx={{ fontSize: "1rem" }} />
                <div>{item.stock}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemsCard;
