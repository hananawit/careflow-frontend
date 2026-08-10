import { useState } from "react";
import { 
  Pill, 
  Plus, 
  Search, 
  AlertTriangle,
  Package,
  TrendingDown,
  Calendar,
  FileText,
  Eye,
  Edit
} from "lucide-react";

const mockMedicines = [
  { id: "M001", name: "Amoxicillin Syrup", category: "Antibiotic", stock: 45, minStock: 20, price: 120, expiry: "2026-08-15", status: "available" },
  { id: "M002", name: "Ibuprofen (Pediatric)", category: "Pain Relief", stock: 12, minStock: 15, price: 85, expiry: "2026-06-20", status: "low" },
  { id: "M003", name: "Fluoride Gel", category: "Dental Care", stock: 8, minStock: 10, price: 250, expiry: "2026-12-10", status: "low" },
  { id: "M004", name: "Local Anesthetic", category: "Anesthetic", stock: 28, minStock: 15, price: 450, expiry: "2027-03-25", status: "available" },
  { id: "M005", name: "Vitamin D Drops", category: "Supplement", stock: 35, minStock: 20, price: 180, expiry: "2026-11-30", status: "available" },
  { id: "M006", name: "Chlorhexidine Mouthwash", category: "Dental Care", stock: 5, minStock: 12, price: 95, expiry: "2026-04-15", status: "critical" },
  { id: "M007", name: "Paracetamol Syrup", category: "Pain Relief", stock: 52, minStock: 25, price: 65, expiry: "2026-09-18", status: "available" },
];

export function Pharmacy() {
  const [showAddMedicine, setShowAddMedicine] = useState(false);

  const lowStockCount = mockMedicines.filter(m => m.stock <= m.minStock).length;
  const criticalStockCount = mockMedicines.filter(m => m.status === "critical").length;
  const totalValue = mockMedicines.reduce((sum, m) => sum + (m.stock * m.price), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Pharmacy Management</h1>
          <p className="text-muted-foreground">Manage medicines, inventory, and prescriptions</p>
        </div>
        <button 
          onClick={() => setShowAddMedicine(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Medicine
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <PharmacyCard
          label="Total Medicines"
          value={mockMedicines.length.toString()}
          icon={Pill}
          color="primary"
        />
        <PharmacyCard
          label="Low Stock Alert"
          value={lowStockCount.toString()}
          icon={AlertTriangle}
          color="warning"
        />
        <PharmacyCard
          label="Critical Stock"
          value={criticalStockCount.toString()}
          icon={TrendingDown}
          color="destructive"
        />
        <PharmacyCard
          label="Inventory Value"
          value={`₹${(totalValue / 1000).toFixed(1)}K`}
          icon={Package}
          color="success"
        />
      </div>

      {/* Alerts */}
      {lowStockCount > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">Stock Alert</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {lowStockCount} medicine(s) are running low on stock. Please reorder soon.
              </p>
              <div className="flex flex-wrap gap-2">
                {mockMedicines
                  .filter(m => m.stock <= m.minStock)
                  .map(m => (
                    <span key={m.id} className="px-3 py-1 bg-warning/20 text-warning rounded-lg text-sm font-medium">
                      {m.name}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search medicines by name, ID, category..."
              className="w-full pl-10 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <select className="px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>All Categories</option>
            <option>Antibiotic</option>
            <option>Pain Relief</option>
            <option>Dental Care</option>
            <option>Anesthetic</option>
            <option>Supplement</option>
          </select>
          <select className="px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>All Status</option>
            <option>Available</option>
            <option>Low Stock</option>
            <option>Critical</option>
          </select>
        </div>
      </div>

      {/* Medicine Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Medicine ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Expiry Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockMedicines.map((medicine) => (
                <tr key={medicine.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-primary font-semibold">{medicine.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{medicine.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary">
                      {medicine.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{medicine.stock} units</p>
                      <p className="text-xs text-muted-foreground">Min: {medicine.minStock}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">₹{medicine.price}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">{medicine.expiry}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      medicine.status === "available"
                        ? "bg-success/10 text-success"
                        : medicine.status === "low"
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive"
                    }`}>
                      {medicine.status === "available" ? "Available" : medicine.status === "low" ? "Low Stock" : "Critical"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg text-foreground transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Recent Prescriptions</h3>
          <div className="space-y-3">
            <PrescriptionItem 
              patient="Emma Johnson" 
              medicine="Amoxicillin Syrup" 
              quantity="1 bottle" 
              date="2026-01-09"
            />
            <PrescriptionItem 
              patient="Noah Williams" 
              medicine="Ibuprofen (Pediatric)" 
              quantity="1 strip" 
              date="2026-01-09"
            />
            <PrescriptionItem 
              patient="Olivia Brown" 
              medicine="Fluoride Gel" 
              quantity="1 tube" 
              date="2026-01-08"
            />
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Expiring Soon</h3>
          <div className="space-y-3">
            <ExpiringItem 
              name="Chlorhexidine Mouthwash" 
              expiry="2026-04-15" 
              daysLeft={96}
            />
            <ExpiringItem 
              name="Ibuprofen (Pediatric)" 
              expiry="2026-06-20" 
              daysLeft={162}
            />
            <ExpiringItem 
              name="Amoxicillin Syrup" 
              expiry="2026-08-15" 
              daysLeft={218}
            />
          </div>
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showAddMedicine && (
        <AddMedicineModal onClose={() => setShowAddMedicine(false)} />
      )}
    </div>
  );
}

function PharmacyCard({ 
  label, 
  value, 
  icon: Icon, 
  color 
}: { 
  label: string; 
  value: string; 
  icon: React.ElementType; 
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    primary: "from-primary/10 to-primary/5 text-primary",
    success: "from-success/10 to-success/5 text-success",
    warning: "from-warning/10 to-warning/5 text-warning",
    destructive: "from-destructive/10 to-destructive/5 text-destructive",
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} w-fit mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function PrescriptionItem({ 
  patient, 
  medicine, 
  quantity, 
  date 
}: { 
  patient: string; 
  medicine: string; 
  quantity: string; 
  date: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
      <FileText className="w-5 h-5 text-primary mt-1" />
      <div className="flex-1">
        <p className="font-medium text-foreground">{patient}</p>
        <p className="text-sm text-muted-foreground">{medicine} - {quantity}</p>
        <p className="text-xs text-muted-foreground mt-1">{date}</p>
      </div>
    </div>
  );
}

function ExpiringItem({ name, expiry, daysLeft }: { name: string; expiry: string; daysLeft: number }) {
  const isUrgent = daysLeft < 120;
  
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border ${
      isUrgent ? "bg-warning/10 border-warning/20" : "bg-muted/30 border-border"
    }`}>
      <Calendar className={`w-5 h-5 mt-1 ${isUrgent ? "text-warning" : "text-primary"}`} />
      <div className="flex-1">
        <p className="font-medium text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">Expires: {expiry}</p>
        <p className={`text-xs mt-1 ${isUrgent ? "text-warning" : "text-muted-foreground"}`}>
          {daysLeft} days left
        </p>
      </div>
    </div>
  );
}

function AddMedicineModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Add New Medicine</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Medicine Name</label>
              <input
                type="text"
                placeholder="Enter medicine name"
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Select category...</option>
                <option>Antibiotic</option>
                <option>Pain Relief</option>
                <option>Dental Care</option>
                <option>Anesthetic</option>
                <option>Supplement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Stock Quantity</label>
              <input
                type="number"
                placeholder="Enter quantity"
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Minimum Stock</label>
              <input
                type="number"
                placeholder="Enter minimum stock"
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Price per Unit</label>
              <input
                type="number"
                placeholder="Enter price"
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Expiry Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                rows={3}
                placeholder="Enter medicine description, dosage instructions, etc."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
              Add Medicine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
