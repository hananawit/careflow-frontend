import { useState } from "react";
import { 
  DollarSign, 
  Plus, 
  Search, 
  Download, 
  Eye, 
  CreditCard,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Printer
} from "lucide-react";

const mockBills = [
  { id: "B001", patient: "Emma Johnson", date: "2026-01-09", amount: 2500, status: "paid", type: "OPD" },
  { id: "B002", patient: "Noah Williams", date: "2026-01-09", amount: 1800, status: "pending", type: "OPD" },
  { id: "B003", patient: "Olivia Brown", date: "2026-01-08", amount: 15000, status: "pending", type: "IPD" },
  { id: "B004", patient: "Liam Davis", date: "2026-01-08", amount: 3200, status: "paid", type: "OPD" },
  { id: "B005", patient: "Sophia Martinez", date: "2026-01-07", amount: 4500, status: "paid", type: "OPD" },
  { id: "B006", patient: "Ethan Anderson", date: "2026-01-07", amount: 1500, status: "pending", type: "OPD" },
];

export function Billing() {
  const [showGenerateBill, setShowGenerateBill] = useState(false);

  const totalRevenue = mockBills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = mockBills.filter(b => b.status === "paid").reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = mockBills.filter(b => b.status === "pending").reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Billing & Finance</h1>
          <p className="text-muted-foreground">Manage bills, payments, and financial records</p>
        </div>
        <button 
          onClick={() => setShowGenerateBill(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Generate Bill
        </button>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FinanceCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="primary"
          change="+12%"
        />
        <FinanceCard
          label="Collected"
          value={`₹${paidAmount.toLocaleString()}`}
          icon={CheckCircle}
          color="success"
          change="+8%"
        />
        <FinanceCard
          label="Pending"
          value={`₹${pendingAmount.toLocaleString()}`}
          icon={Clock}
          color="warning"
          change="-3%"
        />
        <FinanceCard
          label="Bills Today"
          value={mockBills.filter(b => b.date === "2026-01-09").length.toString()}
          icon={FileText}
          color="info"
          change="+5"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by bill ID, patient name..."
              className="w-full pl-10 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <select className="px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>All Status</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>
          <select className="px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>All Types</option>
            <option>OPD</option>
            <option>IPD</option>
          </select>
          <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Bill ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Patient Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-primary font-semibold">{bill.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{bill.patient}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">{bill.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      bill.type === "OPD" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-info/10 text-info"
                    }`}>
                      {bill.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">₹{bill.amount.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      bill.status === "paid" 
                        ? "bg-success/10 text-success" 
                        : "bg-warning/10 text-warning"
                    }`}>
                      {bill.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg text-foreground transition-colors" title="Print">
                        <Printer className="w-4 h-4" />
                      </button>
                      {bill.status === "pending" && (
                        <button className="p-2 hover:bg-success/10 rounded-lg text-success transition-colors" title="Mark Paid">
                          <CreditCard className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <PaymentMethodItem method="Cash" count={15} amount={18500} />
            <PaymentMethodItem method="Card" count={8} amount={12300} />
            <PaymentMethodItem method="UPI/Online" count={12} amount={15200} />
            <PaymentMethodItem method="Insurance" count={3} amount={25000} />
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Treatment Packages</h3>
          <div className="space-y-3">
            <PackageItem name="Regular Checkup" price={1500} />
            <PackageItem name="Cavity Filling" price={2500} />
            <PackageItem name="Teeth Cleaning" price={1800} />
            <PackageItem name="Braces (Monthly)" price={3500} />
            <PackageItem name="Root Canal" price={8000} />
          </div>
        </div>
      </div>

      {/* Generate Bill Modal */}
      {showGenerateBill && (
        <GenerateBillModal onClose={() => setShowGenerateBill(false)} />
      )}
    </div>
  );
}

function FinanceCard({ 
  label, 
  value, 
  icon: Icon, 
  color,
  change 
}: { 
  label: string; 
  value: string; 
  icon: React.ElementType; 
  color: string;
  change: string;
}) {
  const colorClasses: Record<string, string> = {
    primary: "from-primary/10 to-primary/5 text-primary",
    success: "from-success/10 to-success/5 text-success",
    warning: "from-warning/10 to-warning/5 text-warning",
    info: "from-info/10 to-info/5 text-info",
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-sm font-medium text-success">{change}</span>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function PaymentMethodItem({ method, count, amount }: { method: string; count: number; amount: number }) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground">{method}</p>
          <p className="text-sm text-muted-foreground">{count} transactions</p>
        </div>
      </div>
      <p className="font-semibold text-foreground">₹{amount.toLocaleString()}</p>
    </div>
  );
}

function PackageItem({ name, price }: { name: string; price: number }) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
      <p className="font-medium text-foreground">{name}</p>
      <p className="font-semibold text-primary">₹{price.toLocaleString()}</p>
    </div>
  );
}

function GenerateBillModal({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState([{ service: "", quantity: 1, price: 0 }]);

  const addItem = () => {
    setItems([...items, { service: "", quantity: 1, price: 0 }]);
  };

  const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Generate New Bill</h2>
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
              <label className="block text-sm font-medium text-foreground mb-2">Patient</label>
              <select className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Select patient...</option>
                <option>Emma Johnson (P001)</option>
                <option>Noah Williams (P002)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bill Type</label>
              <select className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>OPD</option>
                <option>IPD</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Bill Items</h3>
              <button 
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3">
                  <div className="col-span-6">
                    <select className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option>Select service...</option>
                      <option>Regular Checkup</option>
                      <option>Cavity Filling</option>
                      <option>Teeth Cleaning</option>
                      <option>X-Ray</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number" 
                      min="1"
                      value={item.quantity}
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Qty"
                    />
                  </div>
                  <div className="col-span-4">
                    <input 
                      type="number" 
                      value={item.price}
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Price"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Tax (5%)</span>
              <span className="font-semibold text-foreground">₹{(total * 0.05).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">₹{(total * 1.05).toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Payment Method</label>
            <select className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Cash</option>
              <option>Card</option>
              <option>UPI/Online</option>
              <option>Insurance</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
              Generate & Print Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
