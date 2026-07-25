import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
const BASKETS = [
  "ARSBKPP01",
  "ARSBKPP02",
  "ARSBKPP03",
  "ARSBKPP04",
];
import { db } from "./firebase";
import { Html5Qrcode } from "html5-qrcode";
import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";

import {
  collection,
  getDocs,
  setDoc,
  doc,
   addDoc,
    deleteDoc,
} from "firebase/firestore";
const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "inkartzo_upload");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/hap7h53p/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || "Image upload failed"
    );
  }

  return data.secure_url;
};
const LOCATIONS = [
  "ARS-003-JOD-POB",
  "ARS-003-JOD-HRO",
  "ARS-003-JOD-DDO",
  "ARS-003-JOD-TRO",
  "ARS-003-JOD-INJ",
  "ARS-003-JOD-POO",
];

const PRODUCT_TYPES = [
  "Tablets",
  "Capsules",
  "Syrup",
  "Injection",
  "Infusion Set",
  "Powder",
  "Cream",
  "Ointment",
  "Drops",
  "Other",
];

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const [activePage, setActivePage] =
    useState("Dashboard");

const [products, setProducts] = useState([]);
const baskets = [
  {
    id: "ARSBKPP01",
    name: "Putaway Basket 01",
  },
  {
    id: "ARSBKPP02",
    name: "Putaway Basket 02",
  },
  {
    id: "ARSBKPP03",
    name: "Putaway Basket 03",
  },
  {
    id: "ARSBKPP04",
    name: "Putaway Basket 04",
  },
];
useEffect(() => {
  const loadProducts = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "products")
      );

      const onlineProducts =
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

      setProducts(onlineProducts);
    } catch (error) {
      console.error(
        "Products load error:",
        error
      );
    }
  };

  loadProducts();
}, []);

      
 const [orders, setOrders] = useState([]);
 useEffect(() => {
  const loadOrders = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "orders")
      );

      const onlineOrders =
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

      setOrders(onlineOrders);
    } catch (error) {
      console.error(
        "Orders load error:",
        error
      );
    }
  };

  loadOrders();
}, []);

  const [showProductForm, setShowProductForm] =
    useState(false);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    type: "",
    rate: "",
    qty: "",
    expiry: "",
    batchNo: "",
    basketId: "",
  });
  const BASKETS = [
  "ARSBKPP01",
  "ARSBKPP02",
  "ARSBKPP03",
  "ARSBKPP04",
];

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      username === "admin" &&
      password === "1234"
    ) {
      setIsLoggedIn(true);
      setRole("admin");
      setActivePage("Dashboard");
      setError("");
      return;
    }

    if (
      username === "putaway" &&
      password === "1234"
    ) {
      setIsLoggedIn(true);
      setRole("putaway");
      setActivePage("Putaway Dashboard");
      setError("");
      return;
    }

    if (
      username === "picker" &&
      password === "1234"
    ) {
      setIsLoggedIn(true);
      setRole("picker");
      setActivePage("Picker Dashboard");
      setError("");
      return;
    }

    if (
      username === "packer" &&
      password === "1234"
    ) {
      setIsLoggedIn(true);
      setRole("packer");
      setActivePage("Packer Dashboard");
      setError("");
      return;
    }

    if (
      username === "shipper" &&
      password === "1234"
    ) {
      setIsLoggedIn(true);
      setRole("shipper");
      setActivePage("Shipper Dashboard");
      setError("");
      return;
    }

    if (
      username === "customer" &&
      password === "1234"
    ) {
      setIsLoggedIn(true);
      setRole("customer");
      setActivePage("Customer Dashboard");
      setError("");
      return;
    }

    setError("Wrong username or password");
  };

const saveProducts = async (updatedProducts) => {
  try {
    setProducts(updatedProducts);

    // Firebase me currently saved products ki list lao
    const snapshot = await getDocs(
      collection(db, "products")
    );

    // Jo products delete ho chuke hain, unke Firebase documents delete karo
    for (const firebaseDoc of snapshot.docs) {
      const exists = updatedProducts.some(
        (product) =>
          String(product.id) === firebaseDoc.id
      );

      if (!exists) {
        await deleteDoc(firebaseDoc.ref);
      }
    }

    // New aur updated products save karo
    for (const product of updatedProducts) {
      const cleanProduct = Object.fromEntries(
        Object.entries(product).filter(
          ([key, value]) =>
            value !== undefined
        )
      );

      await setDoc(
        doc(
          db,
          "products",
          String(product.id)
        ),
        cleanProduct
      );
    }

    alert(
      "Products saved online successfully!"
    );
  } catch (error) {
    console.error(
      "Save products error:",
      error
    );

    alert(
      "Products save nahi ho paye: " +
        error.message
    );
  }
};


 const saveOrders = async (updatedOrders) => {
  try {
    setOrders(updatedOrders);

    const latestOrder =
      updatedOrders[updatedOrders.length - 1];

    if (latestOrder) {
      await setDoc(
        doc(
          db,
          "orders",
          String(latestOrder.id)
        ),
        latestOrder
      );
    }

    alert("Order online save ho gaya!");
  } catch (error) {
    console.error("Save order error:", error);

    alert(
      "Order online save nahi ho paya."
    );
  }
};

  const handleProductChange = (e) => {
    const { name, value } = e.target;

    setProductForm({
      ...productForm,
      [name]: value,
    });
  };

  const generateBarcode = () => {
    const savedNumber =
      localStorage.getItem(
        "inkartzo_barcode_number"
      );

    const nextNumber = savedNumber
      ? Number(savedNumber) + 1
      : 100001;

    localStorage.setItem(
      "inkartzo_barcode_number",
      nextNumber
    );

    return "ARSPV" + nextNumber;
  };
const editProduct = async (product) => {
  const newName = prompt(
    "Product Name:",
    product.name
  );

  if (newName === null) return;

  const newQty = prompt(
    "Quantity:",
    product.qty
  );

  if (newQty === null) return;

  const newExpiry = prompt(
    "Expiry MM/YYYY:",
    product.expiry
  );

  if (newExpiry === null) return;

  const newBatchNo = prompt(
    "Batch Number:",
    product.batchNo
  );

  if (newBatchNo === null) return;

  const updatedProducts = products.map(
    (item) => {
      if (item.id === product.id) {
        return {
          ...item,
          name: newName,
          qty: Number(newQty),
          expiry: newExpiry,
          batchNo: newBatchNo,
        };
      }

      return item;
    }
  );

  await saveProducts(updatedProducts);

  alert("Product updated successfully!");
};
const addProduct = async (e) => {
    e.preventDefault();

    if (
      !productForm.name ||
      !productForm.type ||
      !productForm.rate ||
      !productForm.qty ||
      !productForm.expiry ||
      !productForm.batchNo ||
      !productForm.basketId 
    ) {
      alert(
        "Please fill all required product details."
      );

      return;
    }

    const duplicateProduct = products.find(
      (product) =>
        product.name.toLowerCase() ===
          productForm.name.toLowerCase() &&
        product.batchNo.toLowerCase() ===
          productForm.batchNo.toLowerCase()
    );

    if (duplicateProduct) {
      alert(
        "This product with the same batch number already exists."
      );

      return;
    }

    const newProduct = {
      id: Date.now(),

      name: productForm.name,

      description: productForm.description,

      type: productForm.type,

      rate: Number(productForm.rate),

      qty: Number(productForm.qty),

      expiry: productForm.expiry,

      batchNo: productForm.batchNo,

      basketId: productForm.basketId,

      location: "Pending Putaway",

      barcode: generateBarcode(),

      status: "Putaway Pending",

      image: "",

      qcStatus: "Pending",

      verifiedQty: "",

      createdAt:
        new Date().toLocaleDateString(),
    };

    const updatedProducts = [
      ...products,
      newProduct,
    ];
await saveProducts(updatedProducts);

setProductForm({
  name: "",
  description: "",
  type: "",
  rate: "",
  qty: "",
  expiry: "",
  batchNo: "",
  basketId: "",
});

    setShowProductForm(false);

    alert("Product added successfully!");
  };

  const deleteProduct = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to permanently delete this product?"
  );

  if (!confirmDelete) return;

  try {
    const updatedProducts = products.filter(
      (product) => product.id !== id
    );

    await saveProducts(updatedProducts);

    alert(
      "Product permanently deleted successfully!"
    );
  } catch (error) {
    console.error(
      "Permanent delete error:",
      error
    );

    alert(
      "Product delete nahi ho paya: " +
        error.message
    );
  }
};

  const updateProduct = async (updatedProduct) => {
  const updatedProducts = products.map(
    (product) =>
      product.id === updatedProduct.id
        ? updatedProduct
        : product
  );

  await saveProducts(updatedProducts);
};

  const logout = () => {
    setIsLoggedIn(false);
    setRole("");
    setUsername("");
    setPassword("");
  };

  if (!isLoggedIn) {
    return (
      <div style={loginPageStyle}>
        <div style={loginBoxStyle}>
          <div style={loginLogoStyle}>
            <h1>InkArtzo</h1>

            <p>
              Warehouse & Logistics Management
            </p>
          </div>

          <h2>Sign in</h2>

          <form onSubmit={handleLogin}>
            <label style={labelStyle}>
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Enter username"
              style={inputStyle}
            />

            <label style={labelStyle}>
              Password
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                style={{
                  ...inputStyle,
                  paddingRight: "70px",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                style={
                  showPasswordButtonStyle
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

            {error && (
              <p style={errorStyle}>
                {error}
              </p>
            )}

            <button
              type="submit"
              style={loginButtonStyle}
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (role === "putaway") {
    return (
      <PutawayDashboard
        products={products}
        updateProduct={updateProduct}
        logout={logout}
      />
    );
  }

 if (role === "picker") {
  return (
   <PickerDashboard
  products={products}
  saveProducts={saveProducts}
  orders={orders}
  saveOrders={saveOrders}
  logout={logout}
/>
  );
}

 if (role === "packer") {
  return (
    <PackerDashboard
      products={products}
      orders={orders}
      saveOrders={saveOrders}
      saveProducts={saveProducts}
      logout={logout}
    />
  );
}

  if (role === "shipper") {
    return (
    <ShipperDashboard
  orders={orders}
  saveOrders={saveOrders}
  logout={logout}
/>
    );
  }

  if (role === "customer") {
    return (
      <CustomerDashboard
        products={products}
        orders={orders}
        saveOrders={saveOrders}
      />
    );
  }

  return (
    <div style={appStyle}>
      <aside style={sidebarStyle}>
        <div style={logoStyle}>
          InkArtzo
        </div>

        <p style={adminPortalStyle}>
          Admin Portal
        </p>

        {[
          "Dashboard",
          "Products",
          "Inventory",
          "Orders",
          "Invoice",
          "Shipments",
          "Barcode",
          "Putaway",
          "Users / Staff",
          "Reports",
          "Settings",
        ].map((item) => (
          <button
            key={item}
            onClick={() =>
              setActivePage(item)
            }
            style={{
              ...menuButtonStyle,

              background:
                activePage === item
                  ? "#2563eb"
                  : "transparent",
            }}
          >
            {item}
          </button>
        ))}

        <button
          onClick={logout}
          style={{
            ...menuButtonStyle,
            background: "#dc2626",
            marginTop: "30px",
            textAlign: "center",
          }}
        >
          Logout
        </button>
      </aside>

      <main style={mainStyle}>
        <div style={topBarStyle}>
          <div>
            <h1 style={{ margin: 0 }}>
              {activePage}
            </h1>

            <p
              style={{
                color: "#6b7280",
              }}
            >
              Welcome back, Admin 👋
            </p>
          </div>

          <div>
            🟢 Admin Online
          </div>
        </div>

        {activePage === "Dashboard" && (
          <Dashboard
  products={products}
  orders={orders}
/>
        )}
        {activePage === "Orders" && (
  <div>
    <h1>Orders</h1>

    {orders.length === 0 ? (
      <p>No orders found.</p>
    ) : (
      orders.map((order) => (
        <div
          key={order.id}
          style={{
            background: "white",
            padding: "20px",
            marginBottom: "15px",
            borderRadius: "12px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h2>
            Order ID: {order.orderId}
          </h2>

          <p>
            <b>Customer:</b>{" "}
            {order.customerName}
          </p>

          <p>
            <b>Mobile:</b>{" "}
            {order.customerMobile}
          </p>

          <p>
            <b>Address:</b>{" "}
            {order.customerAddress}
          </p>

          <p>
            <b>Status:</b>{" "}
            {order.status}
          </p>

          <p>
            <b>Order Date:</b>{" "}
            {order.createdAt}
          </p>

          <h3>Items</h3>

          {order.items?.map(
            (item, index) => (
              <p key={index}>
                {item.name} × {item.qty}
              </p>
            )
          )}
        </div>
      ))
    )}
  </div>
)}

        {activePage === "Products" && (
          <ProductsPage
            products={products}
            baskets={baskets}
            showProductForm={
              showProductForm
            }
            setShowProductForm={
              setShowProductForm
            }
            productForm={productForm}
            handleProductChange={
              handleProductChange
            }
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            editProduct={editProduct}
          />
        )}

        {activePage === "Invoice" && (
          <InvoicePage
            products={products}
          />
        )}

        {activePage === "Inventory" && (
          <InventoryPage
            products={products}
          />
        )}

        {activePage === "Putaway" && (
          <PutawayDashboardContent
            products={products}
            updateProduct={updateProduct}
          />
        )}
      </main>
    </div>
  );
}
function PutawayDashboard({
  products,
  updateProduct,
  logout,
}) {
  return (
    <div style={putawayAppStyle}>
      <aside style={sidebarStyle}>
        <div style={logoStyle}>
          InkArtzo
        </div>

        <p style={adminPortalStyle}>
          Putaway Portal
        </p>

        <button
          style={{
            ...menuButtonStyle,
            background: "#2563eb",
          }}
        >
          📍 Pending Putaway
        </button>

        <button
          onClick={logout}
          style={{
            ...menuButtonStyle,
            background: "#dc2626",
            marginTop: "30px",
            textAlign: "center",
          }}
        >
          Logout
        </button>
      </aside>

      <main style={mainStyle}>
        <div style={topBarStyle}>
          <div>
            <h1>Putaway Dashboard</h1>

            <p style={{ color: "#6b7280" }}>
              Welcome, Putaway Staff 👋
            </p>
          </div>

          <div>🟢 Putaway Online</div>
        </div>

        <PutawayDashboardContent
          products={products}
          updateProduct={updateProduct}
        />
      </main>
    </div>
  );
}

function PutawayDashboardContent({
  products,
  updateProduct,
}) {
  const [basketId, setBasketId] =
    useState("");

    const [productBarcode, setProductBarcode] =
  useState("");
const [showScanner, setShowScanner] =
  useState(false);
  const [showBasketScanner, setShowBasketScanner] =
  useState(false);
  const pendingProducts = products.filter(
    (product) =>
      product.status === "Putaway Pending"
  );

  const basketProducts =
    basketId.trim() === ""
      ? []
      : pendingProducts.filter(
          (product) =>
            product.basketId &&
            product.basketId.toUpperCase() ===
              basketId.trim().toUpperCase()
        );

  const scanBasket = (e) => {
    e.preventDefault();

    if (!basketId.trim()) {
      alert("Please enter Basket ID");
      return;
    }

    const foundProducts =
      pendingProducts.filter(
        (product) =>
          product.basketId &&
          product.basketId.toUpperCase() ===
            basketId.trim().toUpperCase()
      );

    if (foundProducts.length === 0) {
      alert(
        "No pending products found in this basket."
      );
    }
  };
const scannedProduct =
  products.find(
    (product) =>
      product.barcode &&
      product.barcode.toUpperCase() ===
        productBarcode.trim().toUpperCase()
  );

const scanProduct = (e) => {
  e.preventDefault();

  if (!productBarcode.trim()) {
    alert("Please enter Product Barcode");
    return;
  }

  if (!scannedProduct) {
    alert("Product not found.");
  }
};
useEffect(() => {
  if (!showScanner) return;

  const scanner = new Html5QrcodeScanner(
    "product-barcode-reader",
    {
      fps: 10,
      qrbox: {
        width: 250,
        height: 150,
      },
    },
    false
  );

  scanner.render(
    (decodedText) => {
      setProductBarcode(decodedText);
      setShowScanner(false);
      scanner.clear();
    },
    (errorMessage) => {
      // Camera scan ke time normal scanning errors ignore
    }
  );

  return () => {
    scanner.clear().catch(() => {});
  };
}, [showScanner]);
  return (
    <>
      <div style={cardGridStyle}>
        <StatCard
          title="Pending Putaway"
          value={pendingProducts.length}
          icon="📍"
          description="Products waiting for putaway"
        />

        <StatCard
          title="QC Pending"
          value={
            pendingProducts.filter(
              (product) =>
                product.qcStatus ===
                "Pending"
            ).length
          }
          icon="🔍"
          description="Products waiting for QC"
        />

        <StatCard
          title="Total Quantity"
          value={pendingProducts.reduce(
            (total, product) =>
              total + Number(product.qty),
            0
          )}
          icon="📦"
          description="Units waiting"
        />
      </div>
      <div style={sectionStyle}>
        <h2>🔍 Scan Product Barcode</h2>

        <form
          onSubmit={scanProduct}
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            value={productBarcode}
            onChange={(e) =>
              setProductBarcode(e.target.value)
            }
            placeholder="Enter or Scan Product Barcode"
            style={{
              ...inputStyle,
              flex: 1,
              minWidth: "250px",
            }}
          />

          <button
            type="submit"
            style={primaryButtonStyle}
          >
            🔍 Find Product
            <button
  type="button"
  onClick={() =>
    setShowScanner(!showScanner)
  }
  style={{
    ...primaryButtonStyle,
    background: "#16a34a",
  }}
>
  📷 Scan Barcode
</button>
          </button>
        </form>
{showScanner && (
  <div
    style={{
      marginTop: "20px",
      marginBottom: "20px",
      maxWidth: "500px",
    }}
  >
    <div id="product-barcode-reader"></div>
  </div>
)}
        {productBarcode &&
          scannedProduct && (
            <div
              style={{
                padding: "20px",
                background: "#f0fdf4",
                borderRadius: "10px",
                border: "1px solid #bbf7d0",
              }}
            >
              <h3>✅ Product Found</h3>

              <p>
                <b>Product:</b>{" "}
                {scannedProduct.name}
              </p>

              <p>
                <b>Barcode:</b>{" "}
                {scannedProduct.barcode}
              </p>

              <p>
                <b>Quantity:</b>{" "}
                {scannedProduct.qty}
              </p>

              <p>
                <b>Location:</b>{" "}
                {scannedProduct.location}
              </p>

              <p>
                <b>Batch:</b>{" "}
                {scannedProduct.batchNo}
              </p>

              <p>
                <b>Expiry:</b>{" "}
                {scannedProduct.expiry}
              </p>

              <p>
                <b>Status:</b>{" "}
                {scannedProduct.status}
              </p>
            </div>
          )}
      </div>
      <div style={sectionStyle}>
        <h2>📦 Scan Putaway Basket</h2>

        <form
          onSubmit={scanBasket}
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            value={basketId}
            onChange={(e) =>
              setBasketId(e.target.value)
            }
            placeholder="Enter or Scan Basket ID"
            style={{
              ...inputStyle,
              flex: 1,
              minWidth: "250px",
            }}
          />

          <button
            type="submit"
            style={primaryButtonStyle}
          >
            🔍 Search Basket
          </button>
          <button
  type="button"
  onClick={() =>
    setShowBasketScanner(
      !showBasketScanner
    )
  }
  style={{
    ...primaryButtonStyle,
    background: "#16a34a",
  }}
>
  📷 Scan Basket
</button>
       </form>
{showBasketScanner && (
  <div
    style={{
      marginTop: "20px",
      marginBottom: "20px",
      maxWidth: "500px",
    }}
  >
    <div id="basket-barcode-reader"></div>
  </div>
)} 
        {basketId &&
          basketProducts.length === 0 && (
            <p style={{ color: "#dc2626" }}>
              ❌ No pending products found in
              this basket.
            </p>
          )}

        {basketProducts.length > 0 && (
          <>
            <h2>
              Products in {basketId}
            </h2>

            {basketProducts.map(
              (product) => (
                <PutawayCard
                  key={product.id}
                  product={product}
                  updateProduct={
                    updateProduct
                  }
                />
              )
            )}
          </>
        )}

        {!basketId && (
          <p style={{ color: "#6b7280" }}>
            Scan or enter a basket ID to see
            pending products.
          </p>
        )}
      </div>
    </>
  );
}
function PutawayCard({
  product,
  updateProduct,
}) {
  const [location, setLocation] = useState("");

  const [verifiedQty, setVerifiedQty] =
    useState(product.qty);

  const [image, setImage] = useState(
    product.image || ""
  );

  const [qcStatus, setQcStatus] = useState(
    product.qcStatus || "Pending"
  );

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploadingImage(true);

      const imageUrl =
        await uploadImageToCloudinary(file);

      setImage(imageUrl);

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      alert(
        "Image upload failed: " +
          error.message
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const completePutaway = () => {
    if (!location) {
      alert(
        "Please select a warehouse location."
      );
      return;
    }

    if (!verifiedQty) {
      alert("Please verify quantity.");
      return;
    }

    if (qcStatus === "Pending") {
      alert("Please complete QC check.");
      return;
    }

    if (qcStatus === "Rejected") {
      alert(
        "This product is rejected. Putaway cannot be completed."
      );
      return;
    }

    const updatedProduct = {
      ...product,
      location: location,
      verifiedQty: Number(verifiedQty),
      image: image,
      qcStatus: qcStatus,
      status: "Putaway Completed",
    };

    updateProduct(updatedProduct);

    alert(
      "Putaway completed successfully!"
    );
  };

  return (
    <div style={putawayCardStyle}>
      <div style={putawayProductHeaderStyle}>
        <div>
          <h3 style={{ marginTop: 0 }}>
            {product.name}
          </h3>

          <p>
            <b>Type:</b> {product.type}
          </p>

          <p>
            <b>Barcode:</b> {product.barcode}
          </p>

          <p>
            <b>Batch:</b> {product.batchNo}
          </p>

          <p>
            <b>Expiry:</b> {product.expiry}
          </p>

          <p>
            <b>System Quantity:</b> {product.qty}
          </p>
        </div>

        <div>
          {image ? (
            <img
              src={image}
              alt="Product"
              style={productImageStyle}
            />
          ) : (
            <div style={imagePlaceholderStyle}>
              📷
              <br />
              No Image
            </div>
          )}
        </div>
      </div>

      <hr />

      <h3>Quantity Verification</h3>

      <input
        type="number"
        value={verifiedQty}
        onChange={(e) =>
          setVerifiedQty(e.target.value)
        }
        style={inputStyle}
        placeholder="Enter verified quantity"
      />

      <h3>QC Check</h3>

      <div style={qcButtonContainerStyle}>
        <button
          onClick={() =>
            setQcStatus("Passed")
          }
          style={{
            ...qcButtonStyle,
            background:
              qcStatus === "Passed"
                ? "#16a34a"
                : "#dcfce7",
            color:
              qcStatus === "Passed"
                ? "white"
                : "#166534",
          }}
        >
          ✅ QC Pass
        </button>

        <button
          onClick={() =>
            setQcStatus("Rejected")
          }
          style={{
            ...qcButtonStyle,
            background:
              qcStatus === "Rejected"
                ? "#dc2626"
                : "#fee2e2",
            color:
              qcStatus === "Rejected"
                ? "white"
                : "#991b1b",
          }}
        >
          ❌ QC Reject
        </button>
      </div>

      <h3>Assign Warehouse Location</h3>

      <select
        value={location}
        onChange={(e) =>
          setLocation(e.target.value)
        }
        style={inputStyle}
      >
        <option value="">
          Select Location
        </option>

        {LOCATIONS.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>

      <h3>Upload Product Image</h3>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {/* Gallery */}
        <label
          style={{
            ...primaryButtonStyle,
            display: "inline-block",
            cursor: "pointer",
          }}
        >
          🖼️ Choose from Gallery

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </label>

        {/* Camera */}
        <label
          style={{
            ...primaryButtonStyle,
            display: "inline-block",
            cursor: "pointer",
          }}
        >
          📷 Take Photo

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {uploadingImage && (
        <p style={{ color: "#2563eb" }}>
          ⏳ Uploading image...
        </p>
      )}

      <button
        onClick={completePutaway}
        style={primaryButtonStyle}
        disabled={uploadingImage}
      >
        {uploadingImage
          ? "Uploading..."
          : "Complete Putaway"}
      </button>
    </div>
  );
}
function InventoryPage({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
const [scannerOpen, setScannerOpen] =
  useState(false);

const [scanResult, setScanResult] =
  useState("");
  const filteredProducts = products.filter((product) => {
  const searchText = search.toLowerCase();

  return (
    String(product.name || "")
      .toLowerCase()
      .includes(searchText) ||

    String(product.description || "")
      .toLowerCase()
      .includes(searchText) ||

    String(product.type || "")
      .toLowerCase()
      .includes(searchText) ||

    String(product.batchNo || "")
      .toLowerCase()
      .includes(searchText) ||

    String(product.barcode || "")
      .toLowerCase()
      .includes(searchText) ||

    String(product.location || "")
      .toLowerCase()
      .includes(searchText)
  );
});
  return (
    <>
      <div style={sectionStyle}>
        <h2>Inventory Management</h2>

        <p style={{ color: "#6b7280" }}>
          Search and view complete warehouse product details.
        </p>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search product, description, barcode, batch or location..."
          style={{
            ...inputStyle,
            marginTop: "15px",
            marginBottom: 0,
            fontSize: "16px",
            padding: "15px",
          }}
        />
      </div>

      <div style={sectionStyle}>
        <h2>
          Inventory Products ({filteredProducts.length})
        </h2>

        {filteredProducts.length === 0 ? (
          <p style={{ color: "#6b7280" }}>
            No matching products found.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1200px",
              }}
            >
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th style={tableCellStyle}>Image</th>
                  <th style={tableCellStyle}>Product</th>
                  <th style={tableCellStyle}>Type</th>
                  <th style={tableCellStyle}>Quantity</th>
                  <th style={tableCellStyle}>Rate</th>
                  <th style={tableCellStyle}>Expiry</th>
                  <th style={tableCellStyle}>Batch No.</th>
                  <th style={tableCellStyle}>Barcode</th>
                  <th style={tableCellStyle}>Location</th>
                  <th style={tableCellStyle}>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                   <td style={tableCellStyle}>
  {product.image ? (
    <img
      src={product.image}
      alt={product.name}
      onClick={() => {
        window.open(product.image, "_blank");
      }}
      style={{
        width: "70px",
        height: "70px",
        objectFit: "cover",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        cursor: "pointer",
      }}
    />
  ) : (
    <span style={{ color: "#9ca3af" }}>
      No Image
    </span>
  )}
</td>
                    <td style={tableCellStyle}>
                      <b>{product.name}</b>

                      <br />

                      <small style={{ color: "#6b7280" }}>
                        {product.description || "No description"}
                      </small>
                    </td>

                    <td style={tableCellStyle}>
                      {product.type}
                    </td>

                    <td style={tableCellStyle}>
                      <b>{product.qty}</b>
                    </td>

                    <td style={tableCellStyle}>
                      ₹{product.rate}
                    </td>

                    <td style={tableCellStyle}>
                      {product.expiry}
                    </td>

                    <td style={tableCellStyle}>
                      {product.batchNo}
                    </td>

                    <td style={tableCellStyle}>
                      <b>{product.barcode}</b>
                    </td>

                    <td style={tableCellStyle}>
                      {product.location}
                    </td>

                    <td style={tableCellStyle}>
                      <span
                        style={{
                          background: "#fef3c7",
                          color: "#92400e",
                          padding: "6px 10px",
                          borderRadius: "20px",
                          fontWeight: "600",
                        }}
                      >
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
function Dashboard({ products, orders }) {
  const totalProducts = products.length;

  const totalQuantity = products.reduce(
    (total, product) =>
      total + product.qty,
    0
  );

  const pendingPutaway = products.filter(
    (product) =>
      product.status === "Putaway Pending"
  ).length;

  const completedPutaway = products.filter(
    (product) =>
      product.status === "Putaway Completed"
  ).length;
    const ordersPending = orders.filter(
    (order) =>
      order.status === "Order Placed"
  ).length;

  const pendingDispatch = orders.filter(
    (order) =>
      order.status === "Packed"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.status === "Delivered"
  ).length;

  return (
    <>
      <div style={cardGridStyle}>
        <StatCard
          title="Orders Pending"
          value={ordersPending}
          icon="📦"
          description="Orders waiting for processing"
        />

        <StatCard
          title="Pending Dispatch"
          value={pendingDispatch}
          icon="🚚"
          description="Ready to be dispatched"
        />

        <StatCard
          title="Delivered Orders"
        value={deliveredOrders}
          icon="✅"
          description="Successfully delivered"
        />

        <StatCard
          title="Putaway Pending"
          value={pendingPutaway}
          icon="📍"
          description="Products waiting for putaway"
        />

        <StatCard
          title="Total Products"
          value={totalProducts}
          icon="💊"
          description={`${totalQuantity} total units`}
        />

        <StatCard
          title="Expiry Near Alert"
          value="0"
          icon="⚠️"
          description="Products expiring soon"
        />
      </div>

      <div style={twoColumnStyle}>
        <div style={sectionStyle}>
          <h2>Warehouse Status</h2>

          <p>
            Putaway Progress:{" "}
            <b>
              {totalProducts > 0
                ? Math.round(
                    (completedPutaway /
                      totalProducts) *
                      100
                  )
                : 0}
              %
            </b>
          </p>

          <div
            style={{
              height: "12px",
              background: "#e5e7eb",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                width: `${
                  totalProducts > 0
                    ? Math.round(
                        (completedPutaway /
                          totalProducts) *
                          100
                      )
                    : 0
                }%`,
                height: "100%",
                background: "#2563eb",
                borderRadius: "10px",
              }}
            />
          </div>

          <p style={{ color: "#6b7280" }}>
            Warehouse is operating normally.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2>Staff Status</h2>

          <p>🟢 Active Staff: 1</p>
          <p>🟡 On Break: 0</p>
          <p>🔴 Offline: 0</p>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2>Order Performance</h2>

        <div style={performanceGridStyle}>
          {[
  [
    "Order Placed",
    orders.filter(
      (order) =>
        order.status === "Order Placed"
    ).length,
  ],

  [
    "Picking",
    orders.filter(
      (order) =>
        order.status === "Picking"
    ).length,
  ],

  [
    "Packed",
    orders.filter(
      (order) =>
        order.status === "Packed"
    ).length,
  ],

  [
    "Dispatched",
    orders.filter(
      (order) =>
        order.status === "Dispatched"
    ).length,
  ],

  [
    "In Transit",
    orders.filter(
      (order) =>
        order.status === "In Transit"
    ).length,
  ],

  [
    "Delivered",
    orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length,
  ],
].map(([title, value]) => (
            <div
              key={title}
              style={performanceBoxStyle}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#111827",
                  fontSize: "30px",
                }}
              >
                {value}
              </h2>

              <p>{title}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function PickerDashboard({
  products,
  saveProducts,
  orders,
  saveOrders,
}) {
  const [search, setSearch] = useState("");
  const [pickedProducts, setPickedProducts] = useState([]);
  const pendingOrders = orders.filter(
  (order) =>
    order.status === "Order Placed"
);

  const searchText = search.toLowerCase();

  const filteredProducts = products.filter((product) => {
    return (
      String(product.name || "")
        .toLowerCase()
        .includes(searchText) ||
      String(product.description || "")
        .toLowerCase()
        .includes(searchText) ||
      String(product.barcode || "")
        .toLowerCase()
        .includes(searchText) ||
      String(product.location || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  const handlePickProduct = async (product) => {
  if (pickedProducts.includes(product.id)) {
    alert("This product is already picked.");
    return;
  }

  const updatedProducts = products.map((item) =>
    item.id === product.id
      ? {
          ...item,
          status: "Picked",
          pickedAt: new Date().toLocaleString(),
        }
      : item
  );

  await saveProducts(updatedProducts);

  setPickedProducts([
    ...pickedProducts,
    product.id,
  ]);

  alert(
    `${product.name} marked as Picked successfully.`
  );
};

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background: "#111827",
          color: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>
          📦 Picker Dashboard
        </h2>

        <p
          style={{
            marginBottom: 0,
            color: "#d1d5db",
          }}
        >
          Pick products from warehouse
        </p>
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          boxShadow:
            "0 3px 10px rgba(0,0,0,0.08)",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search product, barcode or location..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "15px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
      </div>
<div
  style={{
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "25px",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.08)",
  }}
>
  <h2>📦 Orders Waiting for Picking</h2>

  {pendingOrders.length === 0 ? (
    <p style={{ color: "#16a34a" }}>
      ✅ No orders waiting for picking.
    </p>
  ) : (
    pendingOrders.map((order) => (
      <div
        key={order.id}
        style={{
          border: "1px solid #e5e7eb",
          padding: "18px",
          borderRadius: "10px",
          marginBottom: "15px",
        }}
      >
        <h3>
          Order ID: {order.orderId}
        </h3>

        <p>
          <b>Customer:</b>{" "}
          {order.customerName}
        </p>

        <p>
          <b>Address:</b>{" "}
          {order.customerAddress}
        </p>

        <h4>Products:</h4>

        {order.items?.map(
          (item, index) => (
            <p key={index}>
              📦 {item.name} × {item.qty}
            </p>
          )
        )}

        <button
          onClick={async () => {
  const updatedOrders = orders.map((item) =>
    item.id === order.id
      ? {
          ...item,
          status: "Picking",
        }
      : item
  );

  await saveOrders(updatedOrders);

  const orderProductIds = order.items
    ?.map((item) => item.productId)
    .filter(Boolean);

  const updatedProducts = products.map((product) =>
    orderProductIds.includes(String(product.id))
      ? {
          ...product,
          status: "Picked",
          pickedAt: new Date().toLocaleString(),
        }
      : product
  );

  await saveProducts(updatedProducts);

  alert(
    "Order picking ke liye start ho gaya aur products Packer portal me bhej diye gaye!"
  );
}}
          style={{
            width: "100%",
            padding: "13px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🛒 START PICKING
        </button>
      </div>
    ))
  )}
</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {filteredProducts.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              gridColumn: "1 / -1",
            }}
          >
            <h3>No products found</h3>

            <p
              style={{
                color: "#6b7280",
              }}
            >
              Search another product or barcode.
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isPicked =
              pickedProducts.includes(product.id);

            return (
              <div
                key={product.id}
                style={{
                  background: "white",
                  padding: "18px",
                  borderRadius: "12px",
                  boxShadow:
                    "0 3px 10px rgba(0,0,0,0.08)",
                  border: isPicked
                    ? "2px solid #16a34a"
                    : "1px solid #e5e7eb",
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "12px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "150px",
                      background: "#f3f4f6",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "12px",
                      color: "#9ca3af",
                    }}
                  >
                    No Product Image
                  </div>
                )}

                <h3
                  style={{
                    marginTop: 0,
                  }}
                >
                  {product.name}
                </h3>

                <p>
                  <b>Type:</b>{" "}
                  {product.type || "N/A"}
                </p>

                <p>
                  <b>Quantity:</b>{" "}
                  {product.qty}
                </p>

                <p>
                  <b>Barcode:</b>{" "}
                  {product.barcode}
                </p>

                <p>
                  <b>Location:</b>{" "}
                  {product.location ||
                    "Pending Putaway"}
                </p>

                {isPicked ? (
                  <button
                    disabled
                    style={{
                      width: "100%",
                      padding: "14px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#16a34a",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "15px",
                    }}
                  >
                    ✅ PICKED
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handlePickProduct(product)
                    }
                    style={{
                      width: "100%",
                      padding: "14px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#2563eb",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                  >
                    🛒 MARK AS PICKED
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ProductsPage({
  products,
  showProductForm,
  setShowProductForm,
  productForm,
  handleProductChange,
  addProduct,
  deleteProduct,
  editProduct,
  baskets,
}) {
  return (
    <>
      <div style={pageHeaderStyle}>
        <div>
          <h2>Product Management</h2>

          <p style={{ color: "#6b7280" }}>
            Add and manage warehouse products.
          </p>
        </div>

        <button
          onClick={() =>
            setShowProductForm(!showProductForm)
          }
          style={primaryButtonStyle}
        >
          + Add Product
        </button>
      </div>

      {showProductForm && (
        <form
          onSubmit={addProduct}
          style={sectionStyle}
        >
          <h2>Add New Product</h2>

          <div style={formGridStyle}>
            <input
              name="name"
              value={productForm.name}
              onChange={handleProductChange}
              placeholder="Product Name *"
              style={inputStyle}
            />

            <input
              name="description"
              value={productForm.description}
              onChange={handleProductChange}
              placeholder="Product Description"
              style={inputStyle}
            />

            <select
              name="type"
              value={productForm.type}
              onChange={handleProductChange}
              style={inputStyle}
            >
              <option value="">
                Select Product Type *
              </option>

              {PRODUCT_TYPES.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>

            <input
              name="rate"
              type="number"
              value={productForm.rate}
              onChange={handleProductChange}
              placeholder="Product Rate *"
              style={inputStyle}
            />

            <input
              name="qty"
              type="number"
              value={productForm.qty}
              onChange={handleProductChange}
              placeholder="Quantity *"
              style={inputStyle}
            />

            <input
              name="expiry"
              value={productForm.expiry}
              onChange={handleProductChange}
              placeholder="Expiry MM/YYYY *"
              style={inputStyle}
            />

            <input
              name="batchNo"
              value={productForm.batchNo}
              onChange={handleProductChange}
              placeholder="Batch Number *"
              style={inputStyle}
            />
            <select
  name="basketId"
  value={productForm.basketId}
  onChange={handleProductChange}
  style={inputStyle}
>
  <option value="">
    Select Basket *
  </option>

 <option value="ARSBKPP01">
  ARSBKPP01
</option>

<option value="ARSBKPP02">
  ARSBKPP02
</option>

<option value="ARSBKPP03">
  ARSBKPP03
</option>

<option value="ARSBKPP04">
  ARSBKPP04
</option>
</select>
            <select
  name="basketId"
  value={productForm.basketId || ""}
  onChange={handleProductChange}
  style={inputStyle}
>
  <option value="">
    Select Basket *
  </option>

  <option value="ARSBKPP01">
    ARSBKPP01
  </option>

  <option value="ARSBKPP02">
    ARSBKPP02
  </option>

  <option value="ARSBKPP03">
    ARSBKPP03
  </option>

  <option value="ARSBKPP04">
    ARSBKPP04
  </option>
</select>
           <select
  name="basketId"
  value={productForm.basketId || ""}
  onChange={handleProductChange}
  style={inputStyle}
>
  <option value="">
    Select Putaway Basket *
  </option>

  {baskets.map((basket) => (
    <option
      key={basket.id}
      value={basket.id}
    >
      {basket.id}
    </option>
  ))}
</select>
          </div>

          <div style={noticeStyle}>
            📍 Location will be assigned by Putaway staff.
          </div>

          <div
            style={{
              ...noticeStyle,
              background: "#eff6ff",
              color: "#1e40af",
            }}
          >
            🏷️ Barcode will be generated automatically.
          </div>

          <button
            type="submit"
            style={primaryButtonStyle}
          >
            Add Product
          </button>
        </form>
      )}

      <div style={sectionStyle}>
        <h2>
          Products ({products.length})
        </h2>

        {products.length === 0 ? (
          <p style={{ color: "#6b7280" }}>
            No products added yet.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  <th style={tableCellStyle}>
                    Product
                  </th>

                  <th style={tableCellStyle}>
                    Type
                  </th>

                  <th style={tableCellStyle}>
                    Qty
                  </th>

                  <th style={tableCellStyle}>
                    Expiry
                  </th>

                  <th style={tableCellStyle}>
                    Batch
                  </th>

                  <th style={tableCellStyle}>
                    Location
                  </th>

                  <th style={tableCellStyle}>
                    Barcode
                  </th>

                  <th style={tableCellStyle}>
                    Status
                  </th>

                  <th style={tableCellStyle}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td style={tableCellStyle}>
                      <b>{product.name}</b>

                      <br />

                      <small>
                        {product.description}
                      </small>
                    </td>

                    <td style={tableCellStyle}>
                      {product.type}
                    </td>

                    <td style={tableCellStyle}>
                      {product.qty}
                    </td>

                    <td style={tableCellStyle}>
                      {product.expiry}
                    </td>

                    <td style={tableCellStyle}>
                      {product.batchNo}
                    </td>

                    <td style={tableCellStyle}>
                      {product.location}
                    </td>

                    <td style={tableCellStyle}>
                      <b>
                        {product.barcode}
                      </b>
                    </td>

                    <td style={tableCellStyle}>
                      <span style={statusStyle}>
                        {product.status}
                      </span>
                    </td>

                    <td style={tableCellStyle}>
                      <button
                        onClick={() =>
                          editProduct(product)
                        }
                        style={{
                          ...primaryButtonStyle,
                          marginRight: "8px",
                          padding: "8px 12px",
                          background: "#2563eb",
                        }}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteProduct(product.id)
                        }
                        style={deleteButtonStyle}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function PackerDashboard({
  products,
  orders,
  saveOrders,
  saveProducts,
}) {
  const [search, setSearch] = useState("");

  // 👇 YAHAN paste karo
  const downloadBarcodePDF = (order) => {
    const barcodeValue =
      order.trackingBarcode ||
      order.trackingId;

    if (!barcodeValue) {
      alert("Tracking barcode available nahi hai.");
      return;
    }

    const canvas =
      document.createElement("canvas");

    JsBarcode(canvas, barcodeValue, {
      format: "CODE128",
      displayValue: true,
      fontSize: 18,
      height: 80,
      margin: 15,
    });

    const barcodeImage =
      canvas.toDataURL("image/png");

    const pdf = new jsPDF();

    pdf.setFontSize(18);

    pdf.text(
      "InkArtzo Shipment Tracking Barcode",
      20,
      25
    );

    pdf.setFontSize(14);

    pdf.text(
      `Order ID: ${order.orderId}`,
      20,
      40
    );

    pdf.text(
      `Tracking ID: ${barcodeValue}`,
      20,
      50
    );

    pdf.addImage(
      barcodeImage,
      "PNG",
      20,
      65,
      170,
      45
    );

    pdf.save(
      `${order.orderId}-tracking-barcode.pdf`
    );
  };

  // baaki tumhara code...
  

  const packingOrders = orders.filter(
    (order) =>
      order.status === "Picked" ||
      order.status === "Picking"
  );

  const filteredOrders = packingOrders.filter(
    (order) => {
      const searchText =
        search.toLowerCase();

      return (
        String(order.orderId || "")
          .toLowerCase()
          .includes(searchText) ||
        String(order.trackingId || "")
          .toLowerCase()
          .includes(searchText) ||
        String(order.customerName || "")
          .toLowerCase()
          .includes(searchText) ||
        String(order.customerMobile || "")
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  const packOrder = async (orderId) => {
  const trackingId =
    "TRK" + Date.now();

  const updatedOrders = orders.map(
    (order) => {
      if (order.id === orderId) {
        return {
          ...order,
          status: "Packed",
          trackingId: trackingId,
          trackingBarcode: trackingId,
          packedAt:
            new Date().toLocaleString(),
        };
      }

      return order;
    }
  );

  await saveOrders(updatedOrders);

  alert(
    `Order packed successfully!\n\nTracking ID: ${trackingId}`
  );
};

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, #111827, #374151)",
          color: "white",
          padding: "30px",
          borderRadius: "14px",
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "36px",
          }}
        >
          📦 Packer Dashboard
        </h1>

        <p
          style={{
            margin: "10px 0 0",
            color: "#d1d5db",
          }}
        >
          Pack orders picked by warehouse staff
        </p>
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
          boxShadow:
            "0 3px 10px rgba(0,0,0,0.06)",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search Order ID, Tracking ID, customer..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            padding: "15px",
            boxSizing: "border-box",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredOrders.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "50px",
              borderRadius: "12px",
              textAlign: "center",
              gridColumn: "1 / -1",
            }}
          >
            <div
              style={{
                fontSize: "60px",
              }}
            >
              📦
            </div>

            <h2>
              No orders ready for packing
            </h2>

            <p
              style={{
                color: "#6b7280",
              }}
            >
              Orders will appear here after
              Picker marks them as PICKED.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "22px",
                boxShadow:
                  "0 3px 12px rgba(0,0,0,0.08)",
                border:
                  "2px solid #2563eb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  📦 {order.orderId}
                </h2>

                <span
                  style={{
                    background: "#fef3c7",
                    color: "#92400e",
                    padding: "7px 12px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                >
                  {order.status}
                </span>
              </div>

              <hr />

              <p>
                <b>👤 Customer:</b>{" "}
                {order.customerName}
              </p>

              <p>
                <b>📱 Mobile:</b>{" "}
                {order.customerMobile}
              </p>

              <p>
                <b>📍 Address:</b>{" "}
                {order.customerAddress}
              </p>

              <p>
                <b>🕒 Order Date:</b>{" "}
                {order.createdAt}
              </p>

              <h3>
                📦 Order Items
              </h3>

              {order.items?.map(
                (item, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#f3f4f6",
                      padding: "12px",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <b>{item.name}</b>

                    <br />

                    Quantity: {item.qty}

                    <br />

                    Price: ₹{item.rate}
                  </div>
                )
              )}
<button
  onClick={() =>
    packOrder(order.id)
  }
  style={{
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  📦 PACK ORDER
</button>

{/* 👇 ISKE TURANT NEEche PASTE KARO */}

<button
  onClick={() =>
    downloadBarcodePDF(order)
  }
  style={{
    width: "100%",
    padding: "14px",
    marginTop: "10px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  📄 DOWNLOAD BARCODE PDF
</button>
              <button
                onClick={() =>
                  packOrder(order.id)
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  marginTop: "15px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                📦 PACK ORDER
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
function StatCard({
  title,
  value,
  icon,
  description,
}) {
  return (
    <div style={sectionStyle}>
      <div style={{ fontSize: "28px" }}>
        {icon}
      </div>

      <h3>{title}</h3>

      <h1 style={numberStyle}>
        {value}
      </h1>

      <p style={{ color: "#6b7280" }}>
        {description}
      </p>
    </div>
  );
}

const loginPageStyle = {
  minHeight: "100vh",
  background: "#f3f4f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const loginBoxStyle = {
  width: "100%",
  maxWidth: "420px",
  background: "white",
  borderRadius: "12px",
  padding: "40px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
};

const loginLogoStyle = {
  textAlign: "center",
  marginBottom: "30px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  marginBottom: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px",
};

const showPasswordButtonStyle = {
  position: "absolute",
  right: "10px",
  top: "10px",
  border: "none",
  background: "transparent",
  color: "#2563eb",
  cursor: "pointer",
};

const errorStyle = {
  color: "#dc2626",
};

const loginButtonStyle = {
  width: "100%",
  marginTop: "24px",
  padding: "14px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

const appStyle = {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  background: "#f3f4f6",
  fontFamily: "Arial, sans-serif",
};

const putawayAppStyle = {
  display: "flex",
  minHeight: "100vh",
  background: "#f3f4f6",
  fontFamily: "Arial, sans-serif",
};

const sidebarStyle = {
  width: "260px",
  background: "#111827",
  color: "white",
  padding: "20px 14px",
  boxSizing: "border-box",
};

const logoStyle = {
  fontSize: "26px",
  fontWeight: "bold",
  textAlign: "center",
  paddingBottom: "20px",
};

const adminPortalStyle = {
  textAlign: "center",
  color: "#9ca3af",
  fontSize: "12px",
};

const menuButtonStyle = {
  width: "100%",
  textAlign: "left",
  padding: "13px 15px",
  marginBottom: "6px",
  border: "none",
  borderRadius: "7px",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
};

const mainStyle = {
  flex: 1,
  minWidth: 0,
  minHeight: "100vh",
  padding: "30px",
  background: "#f3f4f6",
  boxSizing: "border-box",
  overflowX: "hidden",
};

const topBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
};

const cardGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "18px",
  marginBottom: "25px",
};

const twoColumnStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
  marginBottom: "25px",
};

const sectionStyle = {
  background: "white",
  padding: "22px",
  borderRadius: "10px",
  boxShadow:
    "0 3px 10px rgba(0,0,0,0.06)",
  marginBottom: "25px",
};

const performanceGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "15px",
};

const performanceBoxStyle = {
  background: "#f9fafb",
  padding: "20px",
  textAlign: "center",
  borderRadius: "8px",
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "15px",
};

const primaryButtonStyle = {
  padding: "12px 18px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: "600",
};

const pageHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const noticeStyle = {
  marginTop: "10px",
  marginBottom: "10px",
  padding: "14px",
  background: "#fef3c7",
  borderRadius: "8px",
  color: "#92400e",
  fontWeight: "600",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1100px",
};

const tableCellStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  textAlign: "left",
};

const statusStyle = {
  background: "#fef3c7",
  color: "#92400e",
  padding: "6px 10px",
  borderRadius: "20px",
  fontWeight: "600",
};

const deleteButtonStyle = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  cursor: "pointer",
};

const numberStyle = {
  margin: 0,
  color: "#111827",
  fontSize: "32px",
  fontWeight: "800",
};

const putawayCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "20px",
  marginBottom: "20px",
};

const putawayProductHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
};

const productImageStyle = {
  width: "150px",
  height: "150px",
  objectFit: "cover",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
};

const imagePlaceholderStyle = {
  width: "150px",
  height: "150px",
  background: "#f3f4f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  borderRadius: "10px",
  color: "#6b7280",
};

const qcButtonContainerStyle = {
  display: "flex",
  gap: "12px",
  marginBottom: "20px",
};

const qcButtonStyle = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: "600",
};
const invoiceTableCellStyle = {
  border: "1px solid #d1d5db",
  padding: "8px",
  textAlign: "left",
  fontSize: "13px",
};


function InvoicePage({ products }) {
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState(() => {
    const saved = localStorage.getItem("inkartzo_invoice_number");
    return saved ? Number(saved) : 100001;
  });

  const [invoiceItems, setInvoiceItems] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [savedInvoices, setSavedInvoices] = useState(() => {
    const saved = localStorage.getItem("inkartzo_saved_invoices");
    return saved ? JSON.parse(saved) : [];
  });

  const addItemToInvoice = () => {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    const product = products.find(
      (item) => String(item.id) === String(selectedProduct)
    );

    if (!product) return;

    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (qty > product.qty) {
      alert(`Only ${product.qty} units are available.`);
      return;
    }

    const existingItem = invoiceItems.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      const updatedItems = invoiceItems.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              quantity: item.quantity + qty,
              total: (item.quantity + qty) * item.rate,
            }
          : item
      );

      setInvoiceItems(updatedItems);
    } else {
      const newItem = {
        productId: product.id,
        name: product.name,
        type: product.type,
        quantity: qty,
        rate: product.rate,
        total: qty * product.rate,
      };

      setInvoiceItems([...invoiceItems, newItem]);
    }

    setSelectedProduct("");
    setQuantity(1);
  };

  const removeInvoiceItem = (productId) => {
    const updatedItems = invoiceItems.filter(
      (item) => item.productId !== productId
    );

    setInvoiceItems(updatedItems);
  };

  const invoiceTotal = invoiceItems.reduce(
    (total, item) => total + item.total,
    0
  );

  const createNewInvoice = () => {
    if (invoiceItems.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    if (!customerName.trim()) {
      alert("Please enter customer name.");
      return;
    }

    const newInvoice = {
      id: Date.now(),
      invoiceNumber: invoiceNumber,
      customerName: customerName,
      customerMobile: customerMobile,
      items: invoiceItems,
      total: invoiceTotal,
      date: new Date().toLocaleDateString(),
    };

    const updatedInvoices = [
      ...savedInvoices,
      newInvoice,
    ];

    setSavedInvoices(updatedInvoices);

    localStorage.setItem(
      "inkartzo_saved_invoices",
      JSON.stringify(updatedInvoices)
    );

    const nextInvoiceNumber = invoiceNumber + 1;

    setInvoiceNumber(nextInvoiceNumber);

    localStorage.setItem(
      "inkartzo_invoice_number",
      nextInvoiceNumber
    );

    alert(
      `Invoice INV-${invoiceNumber} saved permanently!`
    );

    setCustomerName("");
    setCustomerMobile("");
    setInvoiceItems([]);
    setSelectedProduct("");
    setQuantity(1);
  };

  const printInvoice = () => {
    if (invoiceItems.length === 0) {
      alert("Please add products before printing.");
      return;
    }

    window.print();
  };

  return (
    <div>
      <div className="no-print">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2>Invoice Management</h2>

            <p style={{ color: "#6b7280" }}>
              Create and permanently save customer invoices.
            </p>
          </div>

          <div
            style={{
              background: "#eff6ff",
              padding: "12px 18px",
              borderRadius: "8px",
              fontWeight: "700",
              color: "#1d4ed8",
            }}
          >
            Invoice No: INV-{invoiceNumber}
          </div>
        </div>

        <div style={sectionStyle}>
          <h3>Customer Details</h3>

          <div style={formGridStyle}>
            <input
              type="text"
              placeholder="Customer Name *"
              value={customerName}
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Customer Mobile"
              value={customerMobile}
              onChange={(e) =>
                setCustomerMobile(e.target.value)
              }
              style={inputStyle}
            />
          </div>
        </div>

        <div style={sectionStyle}>
          <h3>Add Products to Invoice</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 150px 150px",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <select
              value={selectedProduct}
              onChange={(e) =>
                setSelectedProduct(e.target.value)
              }
              style={inputStyle}
            >
              <option value="">
                Select Product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name} - ₹{product.rate}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              style={inputStyle}
              placeholder="Quantity"
            />

            <button
              onClick={addItemToInvoice}
              style={primaryButtonStyle}
            >
              + Add Product
            </button>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3>Invoice Products</h3>

          {invoiceItems.length === 0 ? (
            <p style={{ color: "#6b7280" }}>
              No products added to invoice.
            </p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f3f4f6",
                  }}
                >
                  <th style={tableCellStyle}>
                    Product
                  </th>

                  <th style={tableCellStyle}>
                    Type
                  </th>

                  <th style={tableCellStyle}>
                    Qty
                  </th>

                  <th style={tableCellStyle}>
                    Rate
                  </th>

                  <th style={tableCellStyle}>
                    Total
                  </th>

                  <th style={tableCellStyle}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {invoiceItems.map((item) => (
                  <tr key={item.productId}>
                    <td style={tableCellStyle}>
                      {item.name}
                    </td>

                    <td style={tableCellStyle}>
                      {item.type}
                    </td>

                    <td style={tableCellStyle}>
                      {item.quantity}
                    </td>

                    <td style={tableCellStyle}>
                      ₹{item.rate}
                    </td>

                    <td style={tableCellStyle}>
                      ₹{item.total}
                    </td>

                    <td style={tableCellStyle}>
                      <button
                        onClick={() =>
                          removeInvoiceItem(
                            item.productId
                          )
                        }
                        style={{
                          background: "#dc2626",
                          color: "white",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div
            style={{
              textAlign: "right",
              marginTop: "20px",
              fontSize: "22px",
              fontWeight: "800",
            }}
          >
            Grand Total: ₹{invoiceTotal}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "25px",
          }}
        >
          <button
            onClick={createNewInvoice}
            style={primaryButtonStyle}
          >
            💾 Save Invoice Permanently
          </button>

          <button
            onClick={printInvoice}
            style={{
              ...primaryButtonStyle,
              background: "#16a34a",
            }}
          >
            🖨️ Print Invoice
          </button>
        </div>
      </div>

      <div
        id="invoice-print"
        style={{
          background: "white",
          maxWidth: "900px",
          margin: "30px auto",
          padding: "25px",
          border: "2px solid #111",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            textAlign: "center",
            borderBottom: "2px solid #111",
            paddingBottom: "10px",
            marginBottom: "15px",
          }}
        >
          <h1 style={{ margin: 0 }}>
            InkArtzo
          </h1>

          <p style={{ margin: "5px 0" }}>
            Warehouse & Logistics Management
          </p>

          <h2 style={{ margin: "8px 0" }}>
            INVOICE
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
          }}
        >
          <div>
            <b>Customer Name:</b>{" "}
            {customerName || "________________"}
            <br />

            <b>Mobile:</b>{" "}
            {customerMobile || "________________"}
          </div>

          <div>
            <b>Invoice No:</b> INV-{invoiceNumber}
            <br />

            <b>Date:</b>{" "}
            {new Date().toLocaleDateString()}
          </div>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={invoiceTableCellStyle}>
                S.No
              </th>

              <th style={invoiceTableCellStyle}>
                Product
              </th>

              <th style={invoiceTableCellStyle}>
                Type
              </th>

              <th style={invoiceTableCellStyle}>
                Qty
              </th>

              <th style={invoiceTableCellStyle}>
                Rate
              </th>

              <th style={invoiceTableCellStyle}>
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {invoiceItems.map((item, index) => (
              <tr key={item.productId}>
                <td style={invoiceTableCellStyle}>
                  {index + 1}
                </td>

                <td style={invoiceTableCellStyle}>
                  {item.name}
                </td>

                <td style={invoiceTableCellStyle}>
                  {item.type}
                </td>

                <td style={invoiceTableCellStyle}>
                  {item.quantity}
                </td>

                <td style={invoiceTableCellStyle}>
                  ₹{item.rate}
                </td>

                <td style={invoiceTableCellStyle}>
                  ₹{item.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            textAlign: "right",
            marginTop: "20px",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Total Amount: ₹{invoiceTotal}
        </div>

        <div
          style={{
            marginTop: "35px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <b>Thank You!</b>
            <br />
            Visit Again
          </div>

          <div
            style={{
              textAlign: "center",
            }}
          >
            ______________________
            <br />
            Authorized Signature
          </div>
        </div>
      </div>

      <div className="no-print">
        <div style={sectionStyle}>
          <h3>Saved Invoices</h3>

          {savedInvoices.length === 0 ? (
            <p style={{ color: "#6b7280" }}>
              No saved invoices yet.
            </p>
          ) : (
            savedInvoices.map((invoice) => (
              <div
                key={invoice.id}
                style={{
                  padding: "14px",
                  borderBottom:
                    "1px solid #e5e7eb",
                }}
              >
                <b>
                  INV-{invoice.invoiceNumber}
                </b>

                {" - "}

                {invoice.customerName}

                {" - "}

                ₹{invoice.total}

                {" - "}

                {invoice.date}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
function numberToWords(number) {
  if (number === 0) return "Zero Rupees";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (number < 10) {
    return ones[number] + " Rupees";
  }

  if (number < 20) {
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    return teens[number - 10] + " Rupees";
  }

  if (number < 100) {
    return (
      tens[Math.floor(number / 10)] +
      " " +
      ones[number % 10] +
      " Rupees"
    );
  }

  if (number < 1000) {
    return (
      ones[Math.floor(number / 100)] +
      " Hundred " +
      numberToWords(number % 100)
    );
  }

  if (number < 100000) {
    return (
      numberToWords(Math.floor(number / 1000)) +
      " Thousand " +
      numberToWords(number % 1000)
    );
  }

  return number.toLocaleString("en-IN") + " Rupees";
}

const invoiceCellStyle = {
  border: "1px solid #111",
  padding: "8px",
  textAlign: "left",
  verticalAlign: "top",
};
const printStyle = document.createElement("style");

printStyle.innerHTML = `
@media print {
  @page {
    size: A5 portrait;
    margin: 0;
  }

  html,
  body {
    width: 148mm;
    height: 210mm;
    margin: 0;
    padding: 0;
    background: white;
  }

  body * {
    visibility: hidden;
  }

  #invoice-print,
  #invoice-print * {
    visibility: visible;
  }

  #invoice-print {
    position: absolute;
    left: 0;
    top: 0;

    width: 148mm;
    height: 210mm;
    max-height: 210mm;

    margin: 0;
    padding: 6mm;

    border: 2px solid #111;
    box-sizing: border-box;

    overflow: hidden;

    page-break-before: avoid;
    page-break-after: avoid;
    page-break-inside: avoid;

    font-size: 9px;
  }

  #invoice-print table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8px;
  }

  #invoice-print th,
  #invoice-print td {
    padding: 4px;
    line-height: 1.1;
  }

  #invoice-print h1 {
    font-size: 18px;
    margin: 2px 0;
  }

  #invoice-print h2 {
    font-size: 13px;
    margin: 2px 0;
  }

  #invoice-print p {
    margin: 3px 0;
  }

  .no-print {
    display: none !important;
  }
}
`;

document.head.appendChild(printStyle);
const shipperCardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  border: "1px solid #e5e7eb",
};

function ShipperDashboard({
  orders,
  saveOrders,
}) {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);

  const shipmentOrders = orders.filter(
    (order) =>
      order.status === "Packed" ||
      order.status === "RTD" ||
      order.status === "In Transit" ||
      order.status === "OFD" ||
      order.status === "Delivered"
  );

  const filteredOrders = shipmentOrders.filter(
    (order) => {
      const searchText = search.toLowerCase();

      return (
        String(order.orderId || "")
          .toLowerCase()
          .includes(searchText) ||
        String(order.trackingId || "")
          .toLowerCase()
          .includes(searchText) ||
        String(order.customerName || "")
          .toLowerCase()
          .includes(searchText) ||
        String(order.customerMobile || "")
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  const updateShipmentStatus = async (
    orderId,
    newStatus
  ) => {
    const updatedOrders = orders.map(
      (order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            statusUpdatedAt:
              new Date().toLocaleString(),
          };
        }

        return order;
      }
    );

    await saveOrders(updatedOrders);

    alert(
      `Shipment status updated to ${newStatus}`
    );
  };

  const getNextStatus = (status) => {
    if (status === "Packed") return "RTD";
    if (status === "RTD") return "In Transit";
    if (status === "In Transit") return "OFD";
    if (status === "OFD") return "Delivered";

    return null;
  };

  const trackingSteps = [
    "Order Placed",
    "Picked",
    "Packed",
    "RTD",
    "In Transit",
    "OFD",
    "Delivered",
  ];

  const statusOrder = {
    "Order Placed": 0,
    Picked: 1,
    Packed: 2,
    RTD: 3,
    "In Transit": 4,
    OFD: 5,
    Delivered: 6,
  };

  const startBarcodeScanner = async () => {
    setScannerOpen(true);

    setTimeout(async () => {
      const scanner =
        new Html5Qrcode("shipper-barcode-reader");

      try {
        await scanner.start(
          {
            facingMode: "environment",
          },
          {
            fps: 10,
            qrbox: {
              width: 300,
              height: 150,
            },
          },
          async (decodedText) => {
            console.log(
              "Barcode Scanned:",
              decodedText
            );

            await scanner.stop();

            setScannerOpen(false);

            const scannedOrder =
              orders.find(
                (order) =>
                  order.trackingId ===
                    decodedText ||
                  order.trackingBarcode ===
                    decodedText ||
                  order.orderId ===
                    decodedText
              );

            if (!scannedOrder) {
              alert(
                "❌ Order not found for this barcode."
              );
              return;
            }

            setSelectedOrder(scannedOrder);
          },
          (errorMessage) => {
            console.log(
              "Scanning...",
              errorMessage
            );
          }
        );
      } catch (error) {
        console.error(error);

        alert(
          "Camera start nahi ho paya. Browser camera permission check karo."
        );

        setScannerOpen(false);
      }
    }, 300);
  };

  const stopBarcodeScanner = async () => {
    setScannerOpen(false);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1100px",
        margin: "0 auto",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          background:
            "linear-gradient(135deg, #111827, #374151)",
          color: "white",
          padding: "30px 20px",
          borderRadius: "14px",
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <div style={{ fontSize: "50px" }}>
          🚚
        </div>

        <h1>
          Shipper Dashboard
        </h1>

        <p>
          Scan barcode and manage shipment
        </p>
      </div>

      {/* SCANNER */}

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
          boxShadow:
            "0 3px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h2>
          📷 Scan Shipment Barcode
        </h2>

        {!scannerOpen ? (
          <button
            onClick={startBarcodeScanner}
            style={{
              width: "100%",
              padding: "16px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "17px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            📷 OPEN CAMERA & SCAN BARCODE
          </button>
        ) : (
          <>
            <div
              id="shipper-barcode-reader"
              style={{
                width: "100%",
                marginTop: "15px",
              }}
            ></div>

            <button
              onClick={stopBarcodeScanner}
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "15px",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              ✕ CLOSE CAMERA
            </button>
          </>
        )}
      </div>

      {/* SEARCH */}

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
          boxShadow:
            "0 3px 10px rgba(0,0,0,0.08)",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search Order ID or Tracking ID..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "15px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
      </div>

      {/* ORDERS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredOrders.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3>
              No shipment orders found
            </h3>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const nextStatus =
              getNextStatus(order.status);

            return (
              <div
                key={order.id}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow:
                    "0 3px 10px rgba(0,0,0,0.08)",
                }}
              >
                <h2>
                  📦 Order #{order.orderId}
                </h2>

                <p>
                  <b>Customer:</b>{" "}
                  {order.customerName}
                </p>

                <p>
                  <b>Tracking ID:</b>
                  <br />
                  {order.trackingId ||
                    order.trackingBarcode ||
                    "Not Available"}
                </p>

                <p>
                  <b>Status:</b>
                </p>

                <div
                  style={{
                    background:
                      order.status ===
                      "Delivered"
                        ? "#dcfce7"
                        : "#dbeafe",
                    color:
                      order.status ===
                      "Delivered"
                        ? "#166534"
                        : "#1e40af",
                    padding: "10px",
                    borderRadius: "8px",
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: "15px",
                  }}
                >
                  {order.status}
                </div>

                {nextStatus && (
                  <button
                    onClick={() =>
                      updateShipmentStatus(
                        order.id,
                        nextStatus
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "13px",
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Mark {nextStatus}
                  </button>
                )}

                <button
                  onClick={() =>
                    setSelectedOrder(order)
                  }
                  style={{
                    width: "100%",
                    padding: "13px",
                    marginTop: "10px",
                    background: "#111827",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  📍 TRACK ORDER
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* TRACKING MODAL */}

      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "16px",
              padding: "25px",
            }}
          >
            <h2>
              📍 Track Order
            </h2>

            <p>
              <b>Order ID:</b>{" "}
              {selectedOrder.orderId}
            </p>

            <p>
              <b>Tracking ID:</b>{" "}
              {selectedOrder.trackingId}
            </p>

            <div
              style={{
                marginTop: "25px",
              }}
            >
              {trackingSteps.map(
                (step, index) => {
                  const currentStep =
                    statusOrder[
                      selectedOrder.status
                    ] ?? 0;

                  const completed =
                    index <= currentStep;

                  return (
                    <div
                      key={step}
                      style={{
                        display: "flex",
                        gap: "15px",
                        marginBottom: "18px",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background:
                            completed
                              ? "#16a34a"
                              : "#e5e7eb",
                          color: completed
                            ? "white"
                            : "#6b7280",
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "center",
                          fontWeight: "bold",
                        }}
                      >
                        {completed
                          ? "✓"
                          : index + 1}
                      </div>

                      <h3>
                        {step}
                      </h3>
                    </div>
                  );
                }
              )}
            </div>

            <button
              onClick={() =>
                setSelectedOrder(null)
              }
              style={{
                width: "100%",
                padding: "13px",
                background: "#111827",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
function CustomerDashboard({
  products,
  orders,
  saveOrders,
}) {
  const [search, setSearch] = useState("");

  const [cart, setCart] = useState([]);

  const [showCart, setShowCart] =
    useState(false);

  const [showTracking, setShowTracking] =
    useState(false);
const [selectedOrder, setSelectedOrder] =
  useState(null);
  const [trackingId, setTrackingId] =
    useState("");
const trackOrder = () => {
  const searchId = trackingId
    .trim()
    .toLowerCase();

  if (!searchId) {
    alert(
      "Please enter Order ID or Tracking ID."
    );
    return;
  }

  const foundOrder = orders.find(
    (order) =>
      String(order.orderId || "")
        .toLowerCase() === searchId ||
      String(order.trackingId || "")
        .toLowerCase() === searchId
  );

  if (!foundOrder) {
    alert("Order nahi mila.");

    setTrackedOrder(null);

    return;
  }

  setTrackedOrder(foundOrder);
};
  const [trackedOrder, setTrackedOrder] =
    useState(null);

  const [customerName, setCustomerName] =
    useState("");

  const [customerMobile, setCustomerMobile] =
    useState("");

  const [customerAddress, setCustomerAddress] =
    useState("");

  const trackingSteps = [
    "Order Placed",
    "Picked",
    "Packed",
    "RTD",
    "In Transit",
    "OFD",
    "Delivered",
  ];

  const statusOrder = {
    "Order Placed": 0,
    Picked: 1,
    Packed: 2,
    RTD: 3,
    "In Transit": 4,
    OFD: 5,
    Delivered: 6,
  };

  const availableProducts = products.filter(
    (product) =>
      Number(product.qty || 0) > 0 &&
      product.status !== "Putaway Pending"
  );

  const filteredProducts =
    availableProducts.filter((product) => {
      const searchText =
        search.toLowerCase().trim();

      return (
        (product.name || "")
          .toLowerCase()
          .includes(searchText) ||
        (product.description || "")
          .toLowerCase()
          .includes(searchText) ||
        (product.type || "")
          .toLowerCase()
          .includes(searchText) ||
        (product.barcode || "")
          .toLowerCase()
          .includes(searchText)
      );
    });

  const addToCart = (product) => {
    const alreadyAdded = cart.find(
      (item) => item.id === product.id
    );

    if (alreadyAdded) {
      alert(
        "This product is already in your cart."
      );
      return;
    }

    setCart([...cart, product]);

    setShowCart(true);
  };

  const removeFromCart = (productId) => {
    setCart(
      cart.filter(
        (item) => item.id !== productId
      )
    );
  };

  const cartTotal = cart.reduce(
    (total, product) =>
      total + Number(product.rate || 0),
    0
  );

const openOrderTracking = (order) => {
  setSelectedOrder(order);
};
  const createOrder = async () => {
    if (cart.length === 0) {
      alert("Please add a product to cart.");
      return;
    }

    if (!customerName.trim()) {
      alert("Please enter customer name.");
      return;
    }

    if (!customerMobile.trim()) {
      alert("Please enter mobile number.");
      return;
    }

    if (customerMobile.length < 10) {
      alert(
        "Please enter a valid mobile number."
      );
      return;
    }

    if (!customerAddress.trim()) {
      alert(
        "Please enter delivery address."
      );
      return;
    }

    const nextOrderNumber =
      orders.length + 100001;

    const orderId =
      "ARS" + nextOrderNumber;

    const newOrder = {
      id: Date.now(),

      orderId: orderId,

      trackingId: orderId,

      customerName:
        customerName.trim(),

      customerMobile:
        customerMobile.trim(),

      customerAddress:
        customerAddress.trim(),

      items: cart.map((product) => ({
        productId: product.id,

        name: product.name,

        qty: 1,

        rate: Number(
          product.rate || 0
        ),
      })),

      totalAmount: cartTotal,

      status: "Order Placed",

      createdAt:
        new Date().toLocaleString(),
    };

    try {
      await saveOrders([
        ...orders,
        newOrder,
      ]);

      setCart([]);

      setCustomerName("");

      setCustomerMobile("");

      setCustomerAddress("");

      setShowCart(false);

      alert(
        `Order placed successfully!\n\nOrder ID: ${orderId}\n\nTracking ID: ${orderId}`
      );
    } catch (error) {
      console.error(
        "Order creation error:",
        error
      );

      alert(
        "Order save nahi ho paya."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
      }}
    >

      {/* ================= HEADER ================= */}

      <div
        style={{
          background:
            "linear-gradient(135deg, #131921, #232f3e)",
          color: "white",
          padding: "22px 30px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "auto",
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "30px",
                }}
              >
                🛍️ InkArtzo
              </h1>

              <p
                style={{
                  margin:
                    "5px 0 0",
                  color: "#d1d5db",
                }}
              >
                Quality products delivered
                to your doorstep
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >

              <button
                onClick={() =>
                  setShowTracking(true)
                }
                style={{
                  padding:
                    "12px 18px",
                  background:
                    "#111827",
                  color: "white",
                  border: "1px solid #4b5563",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                📍 Track Order
              </button>

              <button
                onClick={() =>
                  setShowCart(true)
                }
                style={{
                  background:
                    "#ff9900",
                  color: "#111827",
                  border: "none",
                  borderRadius: "8px",
                  padding:
                    "12px 20px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                🛒 Cart ({cart.length})
              </button>

            </div>

          </div>

          {/* SEARCH */}

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <input
              type="text"
              placeholder="🔍 Search products, categories or barcode..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding:
                  "16px 20px",
                borderRadius: "8px",
                border: "none",
                outline: "none",
                fontSize: "16px",
              }}
            />
          </div>

        </div>
      </div>

      {/* ================= MAIN ================= */}

      <div
        style={{
          maxWidth: "1400px",
          margin: "auto",
          padding: "30px 20px",
        }}
      >

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "25px",
            boxShadow:
              "0 3px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            Today's Products
          </h2>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            {filteredProducts.length} products
            available
          </p>
        </div>

        {/* PRODUCT GRID */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "22px",
          }}
        >

          {filteredProducts.map(
            (product) => (

              <div
                key={product.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow:
                    "0 3px 12px rgba(0,0,0,0.08)",
                }}
              >

                {/* IMAGE */}

                <div
                  style={{
                    height: "230px",
                    background:
                      "#f9fafb",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                  }}
                >

                  {product.image ? (

                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit:
                          "contain",
                      }}
                    />

                  ) : (

                    <div
                      style={{
                        fontSize:
                          "60px",
                      }}
                    >
                      📦
                    </div>

                  )}

                </div>

                {/* DETAILS */}

                <div
                  style={{
                    padding: "18px",
                  }}
                >

                  <h3
                    style={{
                      margin:
                        "0 0 8px",
                      fontSize:
                        "20px",
                    }}
                  >
                    {product.name}
                  </h3>

                  <p
                    style={{
                      color:
                        "#6b7280",
                      minHeight:
                        "40px",
                    }}
                  >
                    {product.description ||
                      "Quality product"}
                  </p>

                  <p>
                    <b>Type:</b>{" "}
                    {product.type ||
                      "Product"}
                  </p>

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      marginTop:
                        "15px",
                    }}
                  >

                    <strong
                      style={{
                        fontSize:
                          "22px",
                        color:
                          "#b12704",
                      }}
                    >
                      ₹
                      {product.rate}
                    </strong>

                    <span
                      style={{
                        color:
                          "#16a34a",
                        fontSize:
                          "14px",
                        fontWeight:
                          "600",
                      }}
                    >
                      In Stock
                    </span>

                  </div>

                  <button
                    onClick={() =>
                      addToCart(product)
                    }
                    style={{
                      width: "100%",
                      marginTop:
                        "18px",
                      padding:
                        "13px",
                      background:
                        "#ff9900",
                      color:
                        "#111827",
                      border: "none",
                      borderRadius:
                        "8px",
                      fontWeight:
                        "700",
                      cursor:
                        "pointer",
                      fontSize:
                        "15px",
                    }}
                  >
                    🛒 Add to Cart
                  </button>

                </div>

              </div>

            )
          )}

        </div>

        {filteredProducts.length === 0 && (

          <div
            style={{
              background: "white",
              padding: "60px 20px",
              textAlign: "center",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                fontSize: "60px",
              }}
            >
              🔍
            </div>

            <h2>
              No products found
            </h2>

            <p>
              Try another search.
            </p>

          </div>

        )}

      </div>

      {/* ================= CART DRAWER ================= */}

      {showCart && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.55)",
            zIndex: 9999,
          }}
          onClick={() =>
            setShowCart(false)
          }
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              width:
                "min(480px, 100%)",
              background: "white",
              overflowY: "auto",
              padding: "25px",
              boxSizing:
                "border-box",
            }}
          >

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
              }}
            >

              <h2>
                🛒 Your Cart
              </h2>

              <button
                onClick={() =>
                  setShowCart(false)
                }
                style={{
                  border: "none",
                  background:
                    "#fee2e2",
                  color:
                    "#b91c1c",
                  borderRadius:
                    "50%",
                  width: "38px",
                  height: "38px",
                  fontSize:
                    "20px",
                  cursor:
                    "pointer",
                }}
              >
                ✕
              </button>

            </div>

            {cart.length === 0 ? (

              <div
                style={{
                  textAlign:
                    "center",
                  padding:
                    "70px 10px",
                }}
              >

                <div
                  style={{
                    fontSize:
                      "70px",
                  }}
                >
                  🛒
                </div>

                <h2>
                  Your cart is empty
                </h2>

                <p>
                  Add products to
                  continue.
                </p>

              </div>

            ) : (

              <>

                {cart.map(
                  (product) => (

                    <div
                      key={product.id}
                      style={{
                        display:
                          "flex",
                        gap: "12px",
                        alignItems:
                          "center",
                        padding:
                          "15px 0",
                        borderBottom:
                          "1px solid #e5e7eb",
                      }}
                    >

                      {product.image ? (

                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          style={{
                            width:
                              "70px",
                            height:
                              "70px",
                            objectFit:
                              "contain",
                          }}
                        />

                      ) : (

                        <div
                          style={{
                            fontSize:
                              "40px",
                          }}
                        >
                          📦
                        </div>

                      )}

                      <div
                        style={{
                          flex: 1,
                        }}
                      >

                        <b>
                          {product.name}
                        </b>

                        <p
                          style={{
                            margin:
                              "5px 0",
                          }}
                        >
                          ₹
                          {
                            product.rate
                          }
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(
                            product.id
                          )
                        }
                        style={{
                          background:
                            "#dc2626",
                          color:
                            "white",
                          border:
                            "none",
                          padding:
                            "8px 10px",
                          borderRadius:
                            "6px",
                          cursor:
                            "pointer",
                        }}
                      >
                        🗑️
                      </button>

                    </div>

                  )
                )}

                <div
                  style={{
                    marginTop:
                      "25px",
                    padding:
                      "18px",
                    background:
                      "#f3f4f6",
                    borderRadius:
                      "10px",
                  }}
                >
                  <h2>
                    Total: ₹
                    {cartTotal}
                  </h2>
                </div>

                <h3>
                  Delivery Details
                </h3>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={
                    customerName
                  }
                  onChange={(e) =>
                    setCustomerName(
                      e.target.value
                    )
                  }
                  style={
                    customerInputStyle
                  }
                />

                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={
                    customerMobile
                  }
                  onChange={(e) =>
                    setCustomerMobile(
                      e.target.value
                    )
                  }
                  style={
                    customerInputStyle
                  }
                />

                <textarea
                  placeholder="Complete Delivery Address"
                  value={
                    customerAddress
                  }
                  onChange={(e) =>
                    setCustomerAddress(
                      e.target.value
                    )
                  }
                  style={{
                    ...customerInputStyle,
                    minHeight:
                      "110px",
                    resize:
                      "vertical",
                  }}
                />

                <button
                  onClick={
                    createOrder
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "15px",
                    marginTop:
                      "15px",
                    background:
                      "#16a34a",
                    color:
                      "white",
                    border:
                      "none",
                    borderRadius:
                      "8px",
                    fontSize:
                      "16px",
                    fontWeight:
                      "700",
                    cursor:
                      "pointer",
                  }}
                >
                  🚚 Place Order
                </button>

              </>

            )}

          </div>

        </div>

      )}

      {/* ================= TRACK ORDER ================= */}

      {showTracking && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => {
            setShowTracking(false);
            setTrackedOrder(null);
            setTrackingId("");
          }}
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              background: "white",
              width: "100%",
              maxWidth: "650px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "16px",
              padding: "25px",
              boxSizing:
                "border-box",
            }}
          >

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
              }}
            >

              <h2>
                📍 Track Your Order
              </h2>

              <button
                onClick={() => {
                  setShowTracking(false);
                  setTrackedOrder(null);
                  setTrackingId("");
                }}
                style={{
                  border: "none",
                  background:
                    "#fee2e2",
                  color:
                    "#b91c1c",
                  fontSize:
                    "20px",
                  borderRadius:
                    "50%",
                  width: "38px",
                  height: "38px",
                  cursor:
                    "pointer",
                }}
              >
                ✕
              </button>

            </div>

            <input
              type="text"
              placeholder="Enter Order ID or Tracking ID"
              value={trackingId}
              onChange={(e) =>
                setTrackingId(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "15px",
                border:
                  "1px solid #d1d5db",
                borderRadius: "8px",
                boxSizing:
                  "border-box",
                fontSize: "16px",
              }}
            />

            <button
              onClick={trackOrder}
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "12px",
                background:
                  "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              🔍 Track Order
            </button>

            {trackedOrder && (

              <div
                style={{
                  marginTop: "25px",
                  padding: "20px",
                  background:
                    "#f9fafb",
                  borderRadius: "12px",
                }}
              >

                <h3>
                  Order:{" "}
                  {trackedOrder.orderId}
                </h3>

                <p>
                  <b>Customer:</b>{" "}
                  {
                    trackedOrder.customerName
                  }
                </p>

                <p>
                  <b>Order Date:</b>{" "}
                  {
                    trackedOrder.createdAt
                  }
                </p>

                <p>
                  <b>Current Status:</b>{" "}
                  {
                    trackedOrder.status
                  }
                </p>

                <hr />

                <h3>
                  📦 Order Tracking
                </h3>

                <div
                  style={{
                    marginTop:
                      "20px",
                  }}
                >

                  {trackingSteps.map(
                    (step, index) => {

                      const currentStep =
                        statusOrder[
                          trackedOrder
                            .status
                        ] ?? 0;

                      const completed =
                        index <=
                        currentStep;

                      return (

                        <div
                          key={step}
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "flex-start",
                            gap: "15px",
                            marginBottom:
                              "20px",
                          }}
                        >

                          <div
                            style={{
                              width:
                                "34px",
                              height:
                                "34px",
                              borderRadius:
                                "50%",
                              background:
                                completed
                                  ? "#16a34a"
                                  : "#e5e7eb",
                              color:
                                completed
                                  ? "white"
                                  : "#6b7280",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              fontWeight:
                                "bold",
                              flexShrink:
                                0,
                            }}
                          >
                            {completed
                              ? "✓"
                              : index + 1}
                          </div>

                          <div>

                            <h3
                              style={{
                                margin:
                                  "4px 0",
                                color:
                                  completed
                                    ? "#166534"
                                    : "#6b7280",
                              }}
                            >
                              {step}
                            </h3>

                            {completed && (

                              <p
                                style={{
                                  margin: 0,
                                  color:
                                    "#6b7280",
                                }}
                              >
                                Completed
                              </p>

                            )}

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>

                <hr />

                <h3>
                  📦 Order Items
                </h3>

                {trackedOrder.items?.map(
                  (item, index) => (

                    <div
                      key={index}
                      style={{
                        padding: "12px",
                        background:
                          "white",
                        borderRadius:
                          "8px",
                        marginBottom:
                          "8px",
                      }}
                    >

                      <b>
                        {item.name}
                      </b>

                      <br />

                      Quantity:{" "}
                      {item.qty}

                      <br />

                      Price: ₹
                      {item.rate}

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
}


/* ================= CUSTOMER INPUT STYLE ================= */

const customerInputStyle = {
  width: "100%",
  padding: "13px",
  marginBottom: "12px",
  boxSizing: "border-box",
  border:
    "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
  outline: "none",
};

export default App;