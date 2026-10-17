"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import {
  cancelCourierShipment,
  createCourierShipment,
  isCourierCancelledStatus,
  orderToCourierRequest,
  trackCourierShipment,
} from "@/lib/courier";
import { getCurrencyContent } from "@/server/queries/content";
import type { FormState } from "@/lib/validations";

export async function refreshCourierStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().min(1).parse(formData.get("id"));
  const order = await db.order.findUnique({ where: { id } });
  if (!order?.courierConsignmentId) return;

  const tracked = await trackCourierShipment(order.courierConsignmentId, order.courierProvider);
  if ("error" in tracked) {
    console.error("[courier] refresh failed", order.number, tracked.error);
  } else {
    const status = tracked.status;
    const shipStatuses = ["In Transit", "Pickup", "Picked", "Assigned", "At Hub"];
    const delivered = /deliver/i.test(status);
    const nextOrderStatus =
      delivered && order.status !== "DELIVERED" && order.status !== "CANCELLED" && order.status !== "RETURNED"
        ? "DELIVERED"
        : shipStatuses.some((s) => status.toLowerCase().includes(s.toLowerCase())) &&
            ["CONFIRMED", "PROCESSING"].includes(order.status)
          ? "SHIPPED"
          : undefined;

    await db.order.update({
      where: { id },
      data: {
        courierStatus: status,
        courierLastSyncAt: new Date(),
        ...(nextOrderStatus ? { status: nextOrderStatus } : {}),
      },
    });
  }

  revalidatePath("/admin/courier");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/track");
}

export async function bookCourierForOrder(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = z.string().min(1).parse(formData.get("id"));
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) return { status: "error", message: "Order not found." };
  if (order.courierConsignmentId) {
    return { status: "error", message: "Courier already booked for this order." };
  }

  const money = await getCurrencyContent();
  const courier = await createCourierShipment(
    orderToCourierRequest({
      ...order,
      currency: money.code,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
    }),
  );

  if ("skipped" in courier) {
    return { status: "error", message: courier.reason };
  }
  if (!courier.ok) {
    return { status: "error", message: courier.error || "Courier booking failed." };
  }

  const noteBits = [
    order.fulfillmentNote?.trim() || null,
    courier.consignmentId ? `Pathao consignment ${courier.consignmentId}` : "Pathao shipment booked",
  ].filter(Boolean);

  await db.order.update({
    where: { id },
    data: {
      courierProvider: courier.provider,
      courierConsignmentId: courier.consignmentId ?? null,
      courierStatus: "Pending Pickup",
      courierBookedAt: new Date(),
      courierLastSyncAt: new Date(),
      fulfillmentNote: noteBits.join(" · "),
      status: order.status === "PENDING" ? "CONFIRMED" : order.status,
    },
  });

  revalidatePath("/admin/courier");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  return {
    status: "success",
    message: courier.consignmentId
      ? `Courier booked · ${courier.consignmentId}`
      : "Courier booked.",
  };
}

export async function cancelCourierForOrder(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = z.string().min(1).parse(formData.get("id"));
  const order = await db.order.findUnique({ where: { id } });
  if (!order) return { status: "error", message: "Order not found." };
  if (!order.courierConsignmentId) {
    return { status: "error", message: "No courier consignment to cancel." };
  }
  if (isCourierCancelledStatus(order.courierStatus)) {
    return { status: "error", message: "Courier shipment is already cancelled." };
  }

  const result = await cancelCourierShipment(order.courierConsignmentId, order.courierProvider);
  if (!result.ok) {
    return { status: "error", message: result.error || "Courier cancel failed." };
  }

  const status = result.status || "Cancelled";
  const noteBits = [
    order.fulfillmentNote?.trim() || null,
    `Pathao cancelled ${order.courierConsignmentId}`,
  ].filter(Boolean);

  await db.order.update({
    where: { id },
    data: {
      courierStatus: status,
      courierLastSyncAt: new Date(),
      fulfillmentNote: noteBits.join(" · "),
    },
  });

  revalidatePath("/admin/courier");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  revalidatePath("/track");
  return {
    status: "success",
    message: `Courier cancelled · ${order.courierConsignmentId}`,
  };
}
