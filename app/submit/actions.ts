"use server";

import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function submitComplaint(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const ward = parseInt(formData.get("ward") as string, 10);
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;

  const complaint = await prisma.complaint.create({
    data: {
      name,
      phone,
      ward,
      category,
      description,
      imageUrl: imageUrl || null,
      status: Status.OPEN,
    },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/officer");

  redirect(`/submit/success?id=${complaint.complaintId}`);
}
