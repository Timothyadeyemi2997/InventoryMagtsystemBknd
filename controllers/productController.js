const Product = require("../models/Product");

// Create product
exports.createProduct = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty"});
    }
  

  const product = await Product.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json(product);
} 
catch (error) {
  res.status(500).json({ message: error.message});
}
};

// get all products with pagination
exports.getProducts = async (req, res) => {
  try {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  const keywordValue = req.query.keyword ? req.query.keyword.trim() : null;
  const keyword = keywordValue
    ? { name: { $regex: keywordValue, $options: "i" } }
    : {};


  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .populate("createdBy", "name email")
    .limit(limit)
    .skip(limit * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
} catch (error){ 
  res.status(500).json({ message: error.message});
}
};

// Get a single  product
exports.getProductById = async (req, res) => {
  try {
      const product = await Product.findById(req.params.id)
    .populate("createdBy", "name email");

  if (!product) {
    return res.status(404).json({ message: "Product Not found" });
  }
  res.json(product);
} 
catch (error) {
  res.status(500).json({ message: error.message});
}
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
      const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true}
  );  
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
} catch (error) {
  res.status(500).json({ message: error.message});
}
};

// Delete
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }  
  res.json({ message: "Deleted successfully" });
} catch (error) {
  res.status(500).json({ message: error.message});
}
};
