import { Package, AlertTriangle, TrendingDown } from "lucide-react";

const inventory = [
  { id: "I001", item: "Dental Gloves", category: "PPE", stock: 450, minStock: 200, unit: "Boxes", supplier: "MediSupply Co", status: "available" },
  { id: "I002", item: "Disposable Masks", category: "PPE", stock: 85, minStock: 100, unit: "Boxes", supplier: "SafeCare Ltd", status: "low" },
  { id: "I003", item: "Dental Mirrors", category: "Instruments", stock: 120, minStock: 50, unit: "Pieces", supplier: "DentalPro", status: "available" },
  { id: "I004", item: "Cotton Rolls", category: "Consumables", stock: 25, minStock: 50, unit: "Packs", supplier: "MediSupply Co", status: "critical" },
  { id: "I005", item: "Anesthetic Syringes", category: "Instruments", stock: 180, minStock: 100, unit: "Pieces", supplier: "DentalPro", status: "available" },
];

export function Inventory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Inventory & Procurement</h1>
        <p className="text-muted-foreground">Manage medical supplies and equipment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard label="Total Items" value="248" color="primary" icon={Package} />
        <StatsCard label="Low Stock" value="12" color="warning" icon={AlertTriangle} />
        <StatsCard label="Critical" value="3" color="destructive" icon={TrendingDown} />
        <StatsCard label="Value" value="₹2.5L" color="success" icon={Package} />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Item ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Item Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Supplier</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4"><span className="font-mono text-sm text-primary font-semibold">{item.id}</span></td>
                  <td className="px-6 py-4"><p className="font-medium text-foreground">{item.item}</p></td>
                  <td className="px-6 py-4"><span className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary">{item.category}</span></td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{item.stock} {item.unit}</p>
                      <p className="text-xs text-muted-foreground">Min: {item.minStock}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4"><p className="text-sm text-muted-foreground">{item.supplier}</p></td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      item.status === "available" ? "bg-success/10 text-success" : 
                      item.status === "low" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                    }`}>
                      {item.status === "available" ? "Available" : item.status === "low" ? "Low Stock" : "Critical"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, color, icon: Icon }: { label: string; value: string; color: string; icon: React.ElementType }) {
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
