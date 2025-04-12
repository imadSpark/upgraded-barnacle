import { NextResponse } from 'next/server';

// Type definitions for the WhatsApp API request
interface WhatsAppButton {
  id: string;
  title: string;
}

interface WhatsAppMessagePayload {
  phone: string;
  message: string;
  header?: string;
  footer?: string;
  buttons?: WhatsAppButton[];
}

export async function POST(req: Request) {
  try {
    // Check if request is authorized
    const authHeader = req.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.phone || !body.orderDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { phone, orderDetails } = body;
    const { meal, quantity, formData, total } = orderDetails;

    // Construct WhatsApp message payload
    const payload: WhatsAppMessagePayload = {
      phone: phone,
      message: `Thank you for your order, ${formData.fullName}!\n\nOrder Details:\n${quantity}x ${meal.name}\nTotal: $${total}`,
      header: "Order Confirmation",
      footer: "Thank you for choosing our service!",
      buttons: [
        {
          id: "track_order",
          title: "Track Order"
        },
        {
          id: "contact_support",
          title: "Contact Support"
        }
      ]
    };

    // Call the WhatsApp API
    const response = await fetch(`${process.env.WHATSAPP_API_BASE_URL}/api/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Handle API response
    const data = await response.json();
    
    if (!response.ok) {
      console.error('WhatsApp API error:', data);
      return NextResponse.json(
        { error: 'Failed to send WhatsApp message', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 