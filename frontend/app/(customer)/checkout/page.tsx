'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import UploadModal from '@/components/layout/UploadModal';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useCheckoutStore } from '@/stores/checkout.store';
import { useQuery, useMutation } from '@tanstack/react-query';
import { shopsService } from '@/services/shops.service';
import { deliveryService } from '@/services/delivery.service';
import { ordersService } from '@/services/orders.service';
import { paymentsService } from '@/services/payments.service';
import {
  CheckCircle2,
  Store,
  Sliders,
  Truck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  MapPin,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { FulfillmentType, Shop, Address } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    shop,
    setShop,
    document: selectedDoc,
    documentVersion,
    configuration,
    fulfillmentType,
    setFulfillmentType,
    estimatedPrice,
    resetCheckout,
  } = useCheckoutStore();

  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'CASH'>('RAZORPAY');
  const [submitting, setSubmitting] = useState(false);

  const { data: shops = [] } = useQuery({
    queryKey: ['shops'],
    queryFn: () => shopsService.listShops(),
  });

  const { data: addresses = [] } = useQuery({
    queryKey: ['addresses'],
    queryFn: deliveryService.getAddresses,
  });

  const createOrderMutation = useMutation({
    mutationFn: ordersService.createOrder,
  });

  const handleCompleteOrder = async () => {
    if (!shop) {
      alert('Please select a print shop');
      return;
    }
    setSubmitting(true);

    try {
      const order = await createOrderMutation.mutateAsync({
        shopId: shop.id,
        fulfillmentType,
        items: [
          {
            documentVersionId: documentVersion?.id || '00000000-0000-0000-0000-000000000000',
            quantity: configuration.copies,
            configuration,
          },
        ],
      });

      if (paymentMethod === 'RAZORPAY') {
        // Mock Razorpay payment verification
        await paymentsService.verifyPayment({
          razorpay_order_id: `rzp_order_${order.id.slice(0, 8)}`,
          razorpay_payment_id: `rzp_pay_${Date.now()}`,
          razorpay_signature: 'valid_mock_signature',
        });
      }

      resetCheckout();
      router.push(`/orders/${order.id}`);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to place order. Redirecting to orders history...');
      router.push('/orders');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <UploadModal />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          {/* Checkout Stepper Progress */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
              {[
                { number: 1, label: 'Select Shop', icon: Store },
                { number: 2, label: 'Print Config', icon: Sliders },
                { number: 3, label: 'Fulfillment', icon: Truck },
                { number: 4, label: 'Payment', icon: CreditCard },
              ].map((s) => {
                const Icon = s.icon;
                const active = step === s.number;
                const completed = step > s.number;
                return (
                  <button
                    key={s.number}
                    onClick={() => setStep(s.number)}
                    className={`p-3 rounded-2xl border transition flex flex-col items-center gap-1.5 ${
                      active
                        ? 'border-indigo-500 bg-indigo-600/20 text-white'
                        : completed
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-500'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 1: Select Print Shop */}
          {step === 1 && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
              <h2 className="text-lg font-bold text-white">Step 1: Select Nearby Print Shop</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shops.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setShop(s)}
                    className={`cursor-pointer rounded-2xl border p-5 transition ${
                      shop?.id === s.id
                        ? 'border-indigo-500 bg-indigo-950/20 shadow-lg'
                        : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-white">{s.name}</h4>
                        <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                          {s.address}
                        </p>
                      </div>
                      {shop?.id === s.id && <CheckCircle2 className="h-5 w-5 text-indigo-400" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={!shop}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition"
                >
                  Continue to Config <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Confirm Print Config */}
          {step === 2 && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
              <h2 className="text-lg font-bold text-white">Step 2: Review Job Configuration</h2>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Document Name:</span>
                  <span className="font-bold text-white">{selectedDoc?.name || 'Uploaded File.pdf'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Copies:</span>
                  <span className="font-bold text-white">{configuration.copies}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Color Mode:</span>
                  <span className="font-bold text-white">{configuration.colorMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Paper Size:</span>
                  <span className="font-bold text-white">{configuration.paperSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Binding:</span>
                  <span className="font-bold text-white">{configuration.bindingType}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-800 pt-3 text-sm">
                  <span className="font-bold text-white">Total Cost:</span>
                  <span className="font-extrabold text-indigo-400">₹{estimatedPrice?.totalPrice || 24}.00</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 rounded-xl border border-zinc-800 px-5 py-2.5 text-xs font-semibold text-zinc-400 hover:bg-zinc-800 transition"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
                >
                  Fulfillment Options <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Fulfillment Selection */}
          {step === 3 && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
              <h2 className="text-lg font-bold text-white">Step 3: Select Fulfillment Method</h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFulfillmentType('PICKUP')}
                  className={`p-5 rounded-2xl border text-left transition ${
                    fulfillmentType === 'PICKUP'
                      ? 'border-indigo-500 bg-indigo-950/20 shadow-lg'
                      : 'border-zinc-800 bg-zinc-950'
                  }`}
                >
                  <h4 className="text-sm font-bold text-white">● Self Pickup with QR Code</h4>
                  <p className="text-xs text-zinc-400 mt-1">Free • Skip the queue at shop counter</p>
                </button>

                <button
                  onClick={() => setFulfillmentType('DELIVERY')}
                  className={`p-5 rounded-2xl border text-left transition ${
                    fulfillmentType === 'DELIVERY'
                      ? 'border-indigo-500 bg-indigo-950/20 shadow-lg'
                      : 'border-zinc-800 bg-zinc-950'
                  }`}
                >
                  <h4 className="text-sm font-bold text-white">○ Hostel / Home Delivery</h4>
                  <p className="text-xs text-zinc-400 mt-1">+₹20 • Delivered directly to your door</p>
                </button>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 rounded-xl border border-zinc-800 px-5 py-2.5 text-xs font-semibold text-zinc-400 hover:bg-zinc-800 transition"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
                >
                  Proceed to Payment <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment */}
          {step === 4 && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
              <h2 className="text-lg font-bold text-white">Step 4: Select Payment Method</h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`p-5 rounded-2xl border text-left transition ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-indigo-500 bg-indigo-950/20 shadow-lg'
                      : 'border-zinc-800 bg-zinc-950'
                  }`}
                >
                  <h4 className="text-sm font-bold text-white">Razorpay Online Payment</h4>
                  <p className="text-xs text-zinc-400 mt-1">UPI, Cards, NetBanking</p>
                </button>

                <button
                  onClick={() => setPaymentMethod('CASH')}
                  className={`p-5 rounded-2xl border text-left transition ${
                    paymentMethod === 'CASH'
                      ? 'border-indigo-500 bg-indigo-950/20 shadow-lg'
                      : 'border-zinc-800 bg-zinc-950'
                  }`}
                >
                  <h4 className="text-sm font-bold text-white">Pay at Counter / Cash</h4>
                  <p className="text-xs text-zinc-400 mt-1">Pay when picking up document</p>
                </button>
              </div>

              <div className="rounded-2xl bg-indigo-950/30 border border-indigo-500/30 p-5 flex justify-between items-center">
                <div>
                  <span className="text-xs text-indigo-300 block">Total Payable</span>
                  <span className="text-2xl font-extrabold text-white">₹{estimatedPrice?.totalPrice || 24}.00</span>
                </div>

                <button
                  onClick={handleCompleteOrder}
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-400 transition"
                >
                  {submitting ? 'Processing Order...' : 'Confirm & Pay Order'}
                  <CheckCircle2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
