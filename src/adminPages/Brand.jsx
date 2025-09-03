import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Brand = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: "", url: "" });
  const [deleteBrand, setDeleteBrand] = useState({ name: "", id: "" });
  const [brands, setBrands] = useState([]);
  const [visibleBrandId, setVisibleBrandId] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            authorization: `${token}`,
          },
        };

        const response = await axios.get(`/api/admin/getAllBrands`, config);
        setBrands(response.data.brandData);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, [openDelete, openAdd]);

  const toggleBrandIdVisibility = (brandId) => {
    setVisibleBrandId(visibleBrandId === brandId ? null : brandId);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewBrand({ ...newBrand, [name]: value });
  };

  const handleDeleteChange = (e) => {
    const { name, value } = e.target;
    setDeleteBrand({ ...deleteBrand, [name]: value });
  };

  const handleAddBrand = async () => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          authorization: `${token}`,
        },
      };

      const response = await axios.post(
        `/api/admin/addBrand`,
        newBrand,
        config
      );
      console.log("Brand added:", response.data);
      setNewBrand({ name: "", url: "" });
      setOpenAdd(false);
    } catch (error) {
      console.error("Error adding brand:", error);
    }
  };

  const handleDeleteBrand = async () => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          authorization: `${token}`,
        },
      };

      const { id } = deleteBrand;

      const response = await axios.post(
        `/api/admin/removeBrand`,
        { brandId: parseInt(id), brandName: deleteBrand.name },
        config
      );
      console.log("Brand deleted:", response.data);
      setDeleteBrand({ name: "", id: "" });
      setOpenDelete(false);
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex p-2 sm:p-4 justify-evenly sm:justify-between">
          <div className="p-1 flex justify-between gap-4">
            <div className="p-4 bg-gray-100 w-fit flex gap-1 items-center rounded-md">
              <AddIcon />
              <button
                onClick={() => setOpenAdd(true)}
                className="text-xs sm:text-base"
              >
                Add New Brand
              </button>
            </div>
            <div className="p-4 bg-gray-100 w-fit flex gap-1 items-center rounded-md">
              <DeleteIcon />
              <button
                onClick={() => setOpenDelete(true)}
                className="text-xs sm:text-base"
              >
                Delete Existing Brand
              </button>
            </div>
          </div>
        </div>

        <div className="pl-2 pr-2 pb-2 sm:pl-4 sm:pr-4 sm:pb-4 h-[calc(84vh - 9rem)]">
          <div className="h-full overflow-y-auto">
            <div className="w-full flex flex-col">
              <div className="flex justify-center gap-2 p-2">
                <div className="flex flex-wrap w-full p-2 justify-center md:justify-start sm:justify-start gap-4">
                  {brands &&
                    brands.map((brand) => (
                      <Card key={brand.brandId} sx={{ maxWidth: 230 }}>
                        <CardHeader
                          title={brand.name}
                          sx={{
                            "& .MuiCardHeader-title": {
                              fontSize: "1rem",
                            },
                          }}
                        />
                        <CardMedia
                          component="img"
                          height="200"
                          image={brand.url}
                          alt={brand.name}
                          sx={{ objectFit: "contain" }}
                          onClick={() => toggleBrandIdVisibility(brand.brandId)}
                          style={{
                            cursor: "pointer",
                            width: "225px",
                            height: "80px",
                          }}
                        />

                        <CardContent>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            className=" flex justify-between items-center p-1"
                          >
                            <span>Products</span>
                            <span className=" pr-4">{brand.products}</span>
                          </Typography>
                          <div className="flex justify-between p-1 items-center">
                            {visibleBrandId === brand.brandId ? (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {brand.brandId}
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                ***********
                              </Typography>
                            )}
                            <IconButton
                              onClick={() =>
                                toggleBrandIdVisibility(brand.brandId)
                              }
                            >
                              {visibleBrandId === brand.brandId ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Brand Popup */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add New Brand</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Brand Name"
            type="text"
            fullWidth
            value={newBrand.name}
            onChange={handleAddChange}
          />
          <TextField
            margin="dense"
            name="url"
            label="Brand Image URL"
            type="text"
            fullWidth
            value={newBrand.url}
            onChange={handleAddChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button onClick={handleAddBrand}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Brand Popup */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Brand</DialogTitle>
        <Typography sx={{ fontSize: "12px", paddingLeft: "24px" }}>
          This Process cannot be taken back (all related products will be
          removed)
        </Typography>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Brand Name"
            type="text"
            fullWidth
            value={deleteBrand.name}
            onChange={handleDeleteChange}
          />
          <TextField
            margin="dense"
            name="id"
            label="Brand ID"
            type="number"
            fullWidth
            value={deleteBrand.id}
            onChange={handleDeleteChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteBrand}
            className=" p-4 bg-red-500 text-white"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Brand;
