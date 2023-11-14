import mongoose from "mongoose";
import { setSchemaOptions } from "../lib/mongoose-custom-plugins";

mongoose.plugin(setSchemaOptions);

/* Import the models after setting schema options by a mongoose plugin */
import Bakery from "./bakery.model";
import Order from "./order.model";
import Product from "./product.model";
import User from "./user.model";

export { Bakery, Order, Product, User };
