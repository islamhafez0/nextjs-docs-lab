"use server";
import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    message: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  const { customerId, status, amount } = validatedFields.data;

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Create Invoice",
    };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

async function editInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  const { customerId, status, amount } = validatedFields.data;

  const amountInCents = amount * 100;

  const [currentInvoice] = await sql`
    SELECT customer_id, amount, status
    FROM invoices
    WHERE id = ${id}
  `;

  const noChanges =
    currentInvoice.customer_id === customerId &&
    +currentInvoice.amount === amountInCents &&
    currentInvoice.status === status;

  if (noChanges) {
    return {
      message: "No changes detected.",
    };
  }

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    console.error(error);
    return {
      message: `Database Error: Failed to Edit Invoice ${id}`,
    };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

async function deleteInvoice(id: string) {
  try {
    await sql`
      DELETE from INVOICES WHERE id = ${id}
    `;
  } catch (error) {
    console.log(error);
    throw new Error(`Database Error: Failed to Delete Invoice ${id}`);
  }
  revalidatePath("/dashboard/invoices");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something Went Wrong!";
      }
    }
    throw error;
  }
}

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Team Management
export type TeamState = {
  errors?: {
    name?: string[];
    email?: string[];
    role_id?: string[];
  };
  message?: string | null;
};

const AddMemberSchema = z.object({
  name: z.string().min(1, { message: "Please enter a name." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  role_id: z.string().min(1, { message: "Please select a role." }),
});

async function addTeamMember(prevState: TeamState, formData: FormData) {
  const validatedFields = AddMemberSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role_id: formData.get("role_id"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Failed to add member.",
    };
  }

  const { name, email, role_id } = validatedFields.data;

  try {
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return {
        message: "A user with this email already exists.",
      };
    }

    // Create user without password (will be set on first sign-in)
    await sql`
      INSERT INTO users (name, email, password, role_id)
      VALUES (${name}, ${email}, '', ${role_id})
    `;
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to add team member.",
    };
  }

  revalidatePath("/dashboard/team");
  redirect("/dashboard/team");
}

async function updateUserRole(id: string, role_id: string) {
  try {
    await sql`
      UPDATE users SET role_id = ${role_id} WHERE id = ${id}
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Database Error: Failed to update role.");
  }
  revalidatePath("/dashboard/team");
}

async function removeTeamMember(id: string) {
  try {
    await sql`
      DELETE FROM users WHERE id = ${id}
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Database Error: Failed to remove team member.");
  }
  revalidatePath("/dashboard/team");
}

export { createInvoice, editInvoice, deleteInvoice, addTeamMember, updateUserRole, removeTeamMember };
