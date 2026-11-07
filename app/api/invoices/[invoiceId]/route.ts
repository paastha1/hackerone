import { NextRequest, NextResponse } from "next/server"

type Invoice = {
  id: string
  organizationId: string
  customerEmail: string
  totalCents: number
}

const invoices: Invoice[] = [
  {
    id: "invoice_alpha",
    organizationId: "org_alpha",
    customerEmail: "alpha@example.test",
    totalCents: 12900,
  },
  {
    id: "invoice_beta",
    organizationId: "org_beta",
    customerEmail: "beta@example.test",
    totalCents: 24900,
  },
]

function requireUser(request: NextRequest) {
  const userId = request.headers.get("x-user-id")
  const organizationId = request.headers.get("x-organization-id")
  if (!userId || !organizationId) {
    return null
  }

  return { id: userId, organizationId }
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
  })
}
