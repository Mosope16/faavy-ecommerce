export interface ShippingRateResult {
  rateInKobo: number;
  estimatedDays: string;
  providerName: string;
  serviceTier: string;
}

export interface CreateShipmentInput {
  orderId: string;
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  deliveryAddress: string;
  city: string;
  state: string;
  instructions?: string;
  itemsCount: number;
}

export interface CreateShipmentResult {
  trackingNumber: string;
  carrierName: string;
  waybillUrl?: string;
  status: "PENDING" | "DISPATCHED";
  estimatedDelivery?: Date;
}

export interface TrackingResult {
  trackingNumber: string;
  carrierName: string;
  currentStatus: string;
  events: Array<{
    timestamp: string;
    location: string;
    description: string;
  }>;
}

export interface ShippingProvider {
  name: string;
  isConfigured(): boolean;
  calculateRate(state: string, subtotalInKobo: number): Promise<ShippingRateResult>;
  createShipment(input: CreateShipmentInput): Promise<CreateShipmentResult>;
  trackShipment(trackingNumber: string): Promise<TrackingResult>;
}

// -------------------------------------------------------------
// MANUAL FULFILLMENT ADAPTER (Default Active Fallback)
// -------------------------------------------------------------
export class ManualFulfillmentAdapter implements ShippingProvider {
  name = "FAAVY Direct Dispatch & Regional Logistics";

  isConfigured(): boolean {
    return true; // Always operational without external third-party API keys
  }

  async calculateRate(
    state: string,
    subtotalInKobo: number
  ): Promise<ShippingRateResult> {
    // Complimentary shipping for orders over ₦100,000 (10,000,000 kobo)
    if (subtotalInKobo >= 10000000) {
      return {
        rateInKobo: 0,
        estimatedDays: "2 - 4 business days",
        providerName: "FAAVY Complimentary Executive Delivery",
        serviceTier: "Complimentary Nationwide Express",
      };
    }

    const normalizedState = state.trim().toLowerCase();

    // Zone 1: Ekiti State (Local home base: Oye-Ekiti)
    if (normalizedState.includes("ekiti")) {
      return {
        rateInKobo: 250000, // ₦2,500
        estimatedDays: "1 - 2 business days",
        providerName: "FAAVY Ekiti Regional Dispatch",
        serviceTier: "Intrastate Express",
      };
    }

    // Zone 2: Southwest hub (Lagos, Oyo, Ogun, Osun, Ondo)
    const southwest = ["lagos", "oyo", "ogun", "osun", "ondo"];
    if (southwest.some((s) => normalizedState.includes(s))) {
      return {
        rateInKobo: 350000, // ₦3,500
        estimatedDays: "2 - 3 business days",
        providerName: "FAAVY Southwest Courier Network",
        serviceTier: "Regional Priority",
      };
    }

    // Zone 3: Major hubs (Abuja FCT, Rivers, Edo, Delta)
    const hubs = ["abuja", "fct", "federal capital", "rivers", "edo", "delta"];
    if (hubs.some((s) => normalizedState.includes(s))) {
      return {
        rateInKobo: 450000, // ₦4,500
        estimatedDays: "3 - 4 business days",
        providerName: "FAAVY Interstate Express",
        serviceTier: "Interstate Courier",
      };
    }

    // Zone 4: Rest of Nigeria
    return {
      rateInKobo: 550000, // ₦5,500
      estimatedDays: "4 - 6 business days",
      providerName: "FAAVY Nationwide Dedicated Logistics",
      serviceTier: "Nationwide Standard",
    };
  }

  async createShipment(input: CreateShipmentInput): Promise<CreateShipmentResult> {
    // Generate clean internal tracking code: FAV-TRK-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = `FAV-TRK-${dateStr}-${randomSuffix}`;

    const estDays = input.state.toLowerCase().includes("ekiti") ? 2 : 4;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + estDays);

    return {
      trackingNumber,
      carrierName: "FAAVY Logistics Concierge",
      status: "PENDING",
      estimatedDelivery,
    };
  }

  async trackShipment(trackingNumber: string): Promise<TrackingResult> {
    return {
      trackingNumber,
      carrierName: "FAAVY Logistics Concierge",
      currentStatus: "In Dispatch Preparation",
      events: [
        {
          timestamp: new Date().toISOString(),
          location: "FAAVY Fulfillment House, Oye-Ekiti, Nigeria",
          description: "Order curated and packaged for dispatch.",
        },
      ],
    };
  }
}

// -------------------------------------------------------------
// SHIPBUBBLE ADAPTER BLUEPRINT
// -------------------------------------------------------------
export class ShipbubbleAdapter implements ShippingProvider {
  name = "Shipbubble Multi-Carrier API";

  isConfigured(): boolean {
    return Boolean(process.env.SHIPBUBBLE_API_KEY);
  }

  async calculateRate(
    state: string,
    subtotalInKobo: number
  ): Promise<ShippingRateResult> {
    if (!this.isConfigured()) {
      return new ManualFulfillmentAdapter().calculateRate(state, subtotalInKobo);
    }
    // External API invocation when live credentials are supplied by owner
    return new ManualFulfillmentAdapter().calculateRate(state, subtotalInKobo);
  }

  async createShipment(input: CreateShipmentInput): Promise<CreateShipmentResult> {
    if (!this.isConfigured()) {
      return new ManualFulfillmentAdapter().createShipment(input);
    }
    return new ManualFulfillmentAdapter().createShipment(input);
  }

  async trackShipment(trackingNumber: string): Promise<TrackingResult> {
    return new ManualFulfillmentAdapter().trackShipment(trackingNumber);
  }
}

// Default shipping service manager
export class ShippingManager {
  private activeProvider: ShippingProvider;

  constructor() {
    if (process.env.SHIPBUBBLE_API_KEY) {
      this.activeProvider = new ShipbubbleAdapter();
    } else {
      this.activeProvider = new ManualFulfillmentAdapter();
    }
  }

  getProvider(): ShippingProvider {
    return this.activeProvider;
  }
}

export const shippingService = new ShippingManager().getProvider();
