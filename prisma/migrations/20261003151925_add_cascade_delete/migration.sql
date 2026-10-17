-- DropForeignKey
ALTER TABLE "public"."rice_order_items" DROP CONSTRAINT "rice_order_items_orderId_fkey";

-- AddForeignKey
ALTER TABLE "rice_order_items" ADD CONSTRAINT "rice_order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "rice_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
