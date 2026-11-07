import { NextRequest, NextResponse } from "next/server"

type Invoice = {
  id: string
  ownerId: string
  customerEmail: string
  totalCents: number
}

const invoices: Invoice[] = [
  {
    id: "invoice_alpha",
    ownerId: "user_alpha",
    customerEmail: "alpha@example.test",
    totalCents: 12900,
  },
  {
    id: "invoice_beta",
    ownerId: "user_beta",
    customerEmail: "beta@example.test",
    totalCents: 24900,
  },
]

function requireUser(request: NextRequest) {
  const userId = request.headers.get("x-lab-user-id")

  if (!userId) {
    return null
  }

  return { id: userId }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ invoiceId: string }> },
) {
  const user = requireUser(request)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { invoiceId } = await context.params
  const invoice = invoices.find((candidate) => candidate.id === invoiceId)

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
  }

  return NextResponse.json({
    invoice,
    requestedBy: user.id,
    labNotice: "All records returned by this endpoint are synthetic.",
  })
}
