'use client';

import React, { useState } from 'react';
import {
  Boxes,
  Layers,
  Truck,
  CheckCircle,
  PlusCircle,
  ShoppingCart,
  CheckCircle2,
  X,
  Search,
  PackageCheck,
} from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';

interface InventoryItem {
  materialId: string;
  name: string;
  category: string;
  currentStockNum: number;
  unit: string;
  consumedToday: string;
  reorderLevel: string;
  status: 'Adequate' | 'Reorder Soon' | 'Reorder Dispatched';
  depotLocation: string;
  supplier: string;
}

export function MaterialInventoryView() {
  const [selectedSku, setSelectedSku] = useState<string>('MAT-ASP-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Form states
  const [reorderQty, setReorderQty] = useState<number>(20);
  const [deliveryQty, setDeliveryQty] = useState<number>(10);
  const [deliveryChallan, setDeliveryChallan] = useState('');

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      materialId: 'MAT-ASP-01',
      name: 'Bituminous Hot Mix (VG-30)',
      category: 'Asphalt / Binder',
      currentStockNum: 48.5,
      unit: 'MT',
      consumedToday: '12.4 MT',
      reorderLevel: '20.0 MT',
      status: 'Adequate',
      depotLocation: 'Okhla Yard Batching Plant #2',
      supplier: 'Indian Oil Bitumen Corp',
    },
    {
      materialId: 'MAT-AGG-02',
      name: 'Graded Aggregate (10mm - 20mm)',
      category: 'Aggregates',
      currentStockNum: 34.0,
      unit: 'MT',
      consumedToday: '8.2 MT',
      reorderLevel: '15.0 MT',
      status: 'Adequate',
      depotLocation: 'Bawana Aggregate Depot',
      supplier: 'Delhi Quarry Aggregates',
    },
    {
      materialId: 'MAT-PRM-03',
      name: 'Bitumen Emulsion Prime Coat (SS-1)',
      category: 'Primer / Tack',
      currentStockNum: 1200,
      unit: 'Liters',
      consumedToday: '350 Liters',
      reorderLevel: '500 Liters',
      status: 'Adequate',
      depotLocation: 'Okhla Chemical Silo 4',
      supplier: 'Tikona Bitumen Ltd',
    },
    {
      materialId: 'MAT-COL-04',
      name: 'Cold Mix Patching Compound (Bagged)',
      category: 'Emergency Fill',
      currentStockNum: 18,
      unit: 'Bags',
      consumedToday: '6 Bags',
      reorderLevel: '25 Bags',
      status: 'Reorder Soon',
      depotLocation: 'Central Emergency Locker B',
      supplier: 'RoadCare Infrastructure',
    },
  ]);

  const showToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 4000);
  };

  const activeItem = inventory.find((i) => i.materialId === selectedSku) || inventory[0];

  const handleConfirmReorder = () => {
    if (!activeItem) return;
    setInventory((prev) =>
      prev.map((i) =>
        i.materialId === activeItem.materialId ? { ...i, status: 'Reorder Dispatched' } : i
      )
    );
    showToast(`Reorder requisition PO-${Math.floor(1000 + Math.random() * 9000)} sent to ${activeItem.supplier}.`);
    setIsReorderModalOpen(false);
  };

  const handleConfirmDelivery = () => {
    if (!activeItem) return;
    setInventory((prev) =>
      prev.map((i) => {
        if (i.materialId !== activeItem.materialId) return i;
        const newStock = i.currentStockNum + Number(deliveryQty);
        return {
          ...i,
          currentStockNum: newStock,
          status: 'Adequate',
        };
      })
    );
    showToast(`Stock delivery of ${deliveryQty} ${activeItem.unit} logged successfully.`);
    setIsDeliveryModalOpen(false);
    setDeliveryChallan('');
  };

  const filteredInventory = inventory.filter((i) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      i.name.toLowerCase().includes(q) ||
      i.materialId.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      i.supplier.toLowerCase().includes(q)
    );
  });

  const columns: Column<InventoryItem>[] = [
    {
      key: 'materialId',
      header: 'Item SKU',
      render: (i) => <span className="font-mono text-xs text-[#8BBB92] font-semibold">{i.materialId}</span>,
    },
    { key: 'name', header: 'Material Name' },
    {
      key: 'category',
      header: 'Category',
      render: (i) => <span className="font-mono text-xs text-[#8BBB92]">{i.category}</span>,
    },
    {
      key: 'currentStockNum',
      header: 'Available Stock',
      align: 'right',
      render: (i) => (
        <span className="font-mono font-bold text-[#f0fdf4]">
          {i.currentStockNum} {i.unit}
        </span>
      ),
    },
    {
      key: 'consumedToday',
      header: 'Used Today',
      align: 'right',
      render: (i) => <span className="font-mono text-[#8BBB92]">{i.consumedToday}</span>,
    },
    {
      key: 'status',
      header: 'Inventory State',
      align: 'center',
      render: (i) => (
        <span
          className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-mono font-medium ${
            i.status === 'Adequate'
              ? 'border-[#2A835F] bg-[#12544F] text-[#8BBB92] font-semibold'
              : i.status === 'Reorder Dispatched'
              ? 'border-cyan-800/40 bg-cyan-950/40 text-cyan-300 font-bold'
              : 'border-amber-800/40 bg-amber-950/40 text-amber-400 font-bold'
          }`}
        >
          {i.status}
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-3 sm:gap-4 overflow-y-auto p-3 sm:p-5 bg-[#092328] text-[#f0fdf4]">
      {/* Toast Notification Banner */}
      {activeToast && (
        <div className="flex items-center justify-between rounded-lg border border-[#2A835F] bg-[#12544F] px-4 py-2 font-mono text-xs text-[#f0fdf4] shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#8BBB92]" />
            <span>{activeToast}</span>
          </div>
        </div>
      )}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 shrink-0">
        <MetricCard
          label="Asphalt Stock on Yard"
          value="48.5 MT"
          caption="Ready for batching & dispatch"
          change="Optimal"
          changeType="positive"
          icon={<Layers className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Material Consumed (Today)"
          value="12.4 MT"
          caption="Used across 3 pothole repairs"
          change="3 Sites Filled"
          changeType="neutral"
          icon={<Boxes className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Active Compaction Rollers"
          value="2 / 2"
          unit="Units"
          caption="8-tonne tandem vibratory rollers"
          change="Deployed"
          changeType="positive"
          icon={<Truck className="h-4 w-4 text-[#8BBB92]" />}
        />
        <MetricCard
          label="Yard Reorder Status"
          value={String(inventory.filter((i) => i.status !== 'Adequate').length)}
          unit="Items"
          caption="Stock below reorder threshold"
          change="Monitored"
          changeType="neutral"
          icon={<CheckCircle className="h-4 w-4 text-amber-400" />}
        />
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 rounded-lg border border-[#12544F] bg-[#0d3137] px-3.5 py-1.5 shrink-0">
        <Search className="h-4 w-4 text-[#8BBB92] shrink-0" />
        <input
          type="text"
          placeholder="Search materials, SKUs, suppliers, depots..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs font-mono text-[#f0fdf4] outline-none placeholder:text-[#5b9076]"
        />
      </div>

      {/* Main Full-Height Content Stack */}
      <div className="flex flex-1 flex-col gap-3 sm:gap-4">
        {/* Main Table Card */}
        <div className="w-full rounded-xl border border-[#12544F] bg-[#0d3137] p-3 sm:p-4 shadow-sm">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <h3 className="text-sm font-semibold text-[#f0fdf4]">
                Field Contractor Material & Heavy Machinery Inventory
              </h3>
              <p className="text-xs text-[#8BBB92]">
                Real-time consumption tracking linked to completed road repair work orders
              </p>
            </div>
            <span className="self-start sm:self-auto rounded border border-[#12544F] bg-[#12544F]/50 px-2.5 py-1 text-xs font-mono text-[#8BBB92]">
              Shree Balaji Depot Log
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <DataTable<InventoryItem>
              columns={columns}
              data={filteredInventory}
              keyExtractor={(i) => i.materialId}
              onRowClick={(i) => setSelectedSku(i.materialId)}
            />
          </div>
        </div>

        {/* Selected SKU Requisition Strip */}
        {activeItem && (
          <div className="w-full rounded-xl border border-[#1d6d63] bg-[#0d3137] p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#12544F] border border-[#2A835F] text-[#8BBB92] shrink-0">
                <Boxes className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-[#f0fdf4]">
                    {activeItem.materialId}
                  </span>
                  <span className="text-xs text-[#8BBB92]">· {activeItem.name}</span>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${
                      activeItem.status === 'Adequate'
                        ? 'border-[#2A835F] bg-[#12544F] text-[#8BBB92]'
                        : activeItem.status === 'Reorder Dispatched'
                        ? 'border-cyan-800/40 bg-cyan-950/40 text-cyan-300'
                        : 'border-amber-800/40 bg-amber-950/40 text-amber-400'
                    }`}
                  >
                    {activeItem.status}
                  </span>
                </div>
                <p className="text-xs text-[#8BBB92]">
                  Depot: <span className="text-[#f0fdf4] font-medium">{activeItem.depotLocation}</span> · Stock:{' '}
                  <span className="text-emerald-400 font-mono font-bold">
                    {activeItem.currentStockNum} {activeItem.unit}
                  </span>{' '}
                  (Reorder threshold: &lt;{activeItem.reorderLevel})
                </p>
                <p className="text-[11px] font-mono text-[#5b9076]">
                  Primary Supplier: <span className="text-[#8BBB92]">{activeItem.supplier}</span> · Consumption Today:{' '}
                  {activeItem.consumedToday}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsReorderModalOpen(true)}
                className="bg-[#8BBB92] text-[#092328] font-bold hover:bg-[#f0fdf4] text-xs"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Reorder Batch Requisition</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsDeliveryModalOpen(true)}
                className="bg-[#12544F] text-[#f0fdf4] border-[#2A835F] hover:bg-[#2A835F] text-xs font-semibold"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Log Stock Delivery</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Reorder Modal */}
      {isReorderModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#12544F] bg-[#092328] p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#12544F] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-[#8BBB92]" />
                <span className="font-bold text-[#f0fdf4] text-sm">Purchase Order: {activeItem.name}</span>
              </div>
              <button onClick={() => setIsReorderModalOpen(false)} className="text-[#8BBB92] hover:text-[#f0fdf4]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded border border-[#12544F] bg-[#0d3137] p-2.5 space-y-1">
                <p className="text-[#8BBB92]">Supplier: <span className="text-[#f0fdf4] font-bold">{activeItem.supplier}</span></p>
                <p className="text-[#8BBB92]">Target Yard: <span className="text-[#f0fdf4]">{activeItem.depotLocation}</span></p>
              </div>

              <div>
                <label className="block text-[11px] text-[#8BBB92] mb-1">Reorder Quantity ({activeItem.unit}) *</label>
                <input
                  type="number"
                  value={reorderQty}
                  onChange={(e) => setReorderQty(Number(e.target.value))}
                  className="w-full rounded border border-[#12544F] bg-[#0d3137] px-3 py-2 text-[#f0fdf4] outline-none font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#12544F]">
                <Button variant="secondary" size="sm" onClick={() => setIsReorderModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleConfirmReorder} className="bg-[#2A835F] text-[#f0fdf4] hover:bg-[#12544F]">
                  Transmit Purchase Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Delivery Modal */}
      {isDeliveryModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#12544F] bg-[#092328] p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#12544F] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-[#f0fdf4] text-sm">Log Yard Intake Delivery</span>
              </div>
              <button onClick={() => setIsDeliveryModalOpen(false)} className="text-[#8BBB92] hover:text-[#f0fdf4]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#8BBB92] mb-1">Delivery Challan / Invoice # *</label>
                <input
                  type="text"
                  placeholder="e.g. IOCL-CHL-99410"
                  value={deliveryChallan}
                  onChange={(e) => setDeliveryChallan(e.target.value)}
                  className="w-full rounded border border-[#12544F] bg-[#0d3137] px-3 py-2 text-[#f0fdf4] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#8BBB92] mb-1">Delivered Quantity ({activeItem.unit}) *</label>
                <input
                  type="number"
                  value={deliveryQty}
                  onChange={(e) => setDeliveryQty(Number(e.target.value))}
                  className="w-full rounded border border-[#12544F] bg-[#0d3137] px-3 py-2 text-[#f0fdf4] outline-none font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#12544F]">
                <Button variant="secondary" size="sm" onClick={() => setIsDeliveryModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleConfirmDelivery} className="bg-[#2A835F] text-[#f0fdf4] hover:bg-[#12544F]">
                  Update Stock Inventory
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
