import { Schema, model, type HydratedDocument, type Model, type Types } from "mongoose";

export interface OrderItem {
  productId: Types.ObjectId;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  customerId: Types.ObjectId;
  vendorId: Types.ObjectId;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  customerContact: string;
  orderStatus: 'pending_payment' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'pending' | 'paid' | 'failed';
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderDocument = HydratedDocument<Order>;

const orderSchema = new Schema<Order>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        nameSnapshot: { type: String, required: true },
        priceSnapshot: { type: Number, required: true },
        quantity: { type: Number, required: true },
        lineTotal: { type: Number, required: true }
      }
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    customerContact: { type: String, required: true },
    orderStatus: {
      type: String,
      enum: ['pending_payment', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending_payment',
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'pending', 'paid', 'failed'],
      default: 'unpaid',
      index: true
    },
    paymentReference: { type: String, unique: true, sparse: true }
  },
  { timestamps: true, versionKey: false }
);

export const OrderModel: Model<Order> = model<Order>("Order", orderSchema);
