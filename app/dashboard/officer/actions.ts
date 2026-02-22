"use server";

import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateComplaintStatus(complaintId: string, status: Status, notes?: string) {
  await prisma.complaint.update({
    where: { id: complaintId },
    data: { 
      status,
      notes,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/dashboard/officer");
  revalidatePath("/dashboard/admin");
}
