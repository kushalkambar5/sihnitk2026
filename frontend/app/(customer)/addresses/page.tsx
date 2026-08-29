'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import UploadModal from '@/components/layout/UploadModal';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryService } from '@/services/delivery.service';
import { MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Address } from '@/types';

export default function AddressesPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: 'Hostel Block C',
    recipientName: 'Kushal Kambar',
    phone: '+91 9876543210',
    addressLine1: 'Room 304, Block C, NITK Campus',
    city: 'Surathkal',
    state: 'Karnataka',
    postalCode: '575025',
    country: 'India',
  });

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: deliveryService.getAddresses,
  });

  const addMutation = useMutation({
    mutationFn: deliveryService.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setShowAddForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deliveryService.deleteAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <UploadModal />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Saved Delivery Addresses</h1>
              <p className="text-xs text-zinc-400 mt-1">Manage locations for instant hostel or home document delivery.</p>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition"
            >
              <Plus className="h-4 w-4" /> Add Address
            </button>
          </div>

          {showAddForm && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white">New Delivery Location</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Label (e.g. Hostel Block C)"
                  value={newAddr.label}
                  onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none"
                />
                <input
                  type="text"
                  placeholder="Recipient Name"
                  value={newAddr.recipientName}
                  onChange={(e) => setNewAddr({ ...newAddr, recipientName: e.target.value })}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none"
                />
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={newAddr.addressLine1}
                  onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none"
                />
              </div>

              <button
                onClick={() => addMutation.mutate({ ...newAddr, isDefault: true })}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition"
              >
                Save Location
              </button>
            </div>
          )}

          {/* List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-white">{addr.label}</h4>
                    <button onClick={() => deleteMutation.mutate(addr.id)} className="text-zinc-500 hover:text-rose-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400">{addr.recipientName} • {addr.phone}</p>
                  <p className="text-xs text-zinc-500 mt-1">{addr.addressLine1}, {addr.city}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
