import OrderModel from "../model/order.model.js";
import ProductModel from "../model/product.model.js";
import UserModel from "../model/user.model.js";

export async function createOrderController(request, response) {
  try {
    let order = new OrderModel({
      userId: request.body.userId,
      products: request.body.products,
      paymentId: request.body.paymentId,
      orderStatus: request.body.orderStatus,
      delivery_address: request.body.delivery_address,
      totalAmt: request.body.totalAmt,
    });

    if (!order) {
      response.status(500).json({
        error: true,
        success: false,
      });
    }

    for (let i = 0; i < request.body.products.length; i++) {
      await ProductModel.findByIdAndUpdate(
        request.body.products[i].productId,
        {
          countInStock: parseInt(
            request.body.products[i].countInStock -
              request.body.products[i].quantity
          ),
        },
        { new: true }
      );
    }

    order = await order.save();

    return response.status(200).json({
      message: "Order placed",
      error: false,
      success: true,
      order: order,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getOrders(request, response) {
  try {
    const orders = await OrderModel.find({ userId: request.userId }).populate(
      "userId delivery_address"
    );
    if (!orders) {
      response.status(500).json({
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      orders: orders,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getAllOrders(request, response) {
  try {
    const orders = await OrderModel.find().populate("userId delivery_address");
    if (!orders) {
      response.status(500).json({
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      orders: orders,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function editOrderController(request, response) {
  try {
    const { orderId, status } = request.body;
    const order = await OrderModel.findByIdAndUpdate(orderId, {
      orderStatus: status,
    });
    if (!order) {
      response.status(500).json({
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Status updated",
      error: false,
      success: true,
      order: order,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function countOrderController(request, response) {
  try {
    const count = await OrderModel.countDocuments();

    return response.status(200).json({
      error: false,
      success: true,
      count: count,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function totalSalesOrderController(req, res) {
  try {
    const currentYear = new Date().getFullYear();

    const sales = await OrderModel.aggregate([
      {
        $match: {
          orderStatus: "completed",
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalSales: { $sum: "$totalAmt" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const months = [
      "JAN","FEB","MAR","APR","MAY","JUN",
      "JUL","AUG","SEP","OCT","NOV","DEC"
    ];

    const monthlySales = months.map((month, index) => {
      const data = sales.find(s => s._id.month === index + 1);
      return {
        name: month,
        TotalSales: data ? data.totalSales : 0
      };
    });

    return res.status(200).json({
      success: true,
      error: false,
      totalSales: monthlySales
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message
    });
  }
}




export async function totalUsersOrderController(req, res) {
  try {
    const currentYear = new Date().getFullYear();
const year = 2025;
const count = await UserModel.countDocuments();
    const users = await UserModel.aggregate([
      {
        $match: {
          // createdAt: {
          //   $gte: new Date(`${currentYear}-01-01`),
          //   $lte: new Date(`${currentYear}-12-31`)
          // }
           createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalUsers: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const months = [
      "JAN","FEB","MAR","APR","MAY","JUN",
      "JUL","AUG","SEP","OCT","NOV","DEC"
    ];

    const monthlyUsers = months.map((month, index) => {
      const data = users.find(u => u._id.month === index + 1);
      return {
        name: month,
        TotalUsers: data ? data.totalUsers : 0
      };
    });

    return res.status(200).json({
      success: true,
      error: false,
      totalUsers: monthlyUsers,
      count: count
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message
    });
  }
}



