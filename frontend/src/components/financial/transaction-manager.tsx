"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/kartu";
import { Button } from "@/components/ui/tombol";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Edit3,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
  Tag,
  DollarSign,
} from "lucide-react";

interface FinancialTransaction {
  id: string;
  type: "INCOME" | "EXPENSE" | "INVESTMENT" | "DEBT" | "ASSET" | "LIABILITY";
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  recurring: boolean;
  frequency?: string;
  tags: string[];
  metadata?: Record<string, unknown>;
}

interface TransactionManagerProps {
  transactions?: FinancialTransaction[];
  onAddTransaction?: (transaction: Omit<FinancialTransaction, "id">) => void;
  onUpdateTransaction?: (
    id: string,
    transaction: Partial<FinancialTransaction>
  ) => void;
  onDeleteTransaction?: (id: string) => void;
}

const mockTransactions: FinancialTransaction[] = [
  {
    id: "1",
    type: "INCOME",
    category: "Gaji",
    amount: 15000000,
    currency: "IDR",
    description: "Gaji bulanan",
    date: new Date("2024-01-01"),
    recurring: true,
    frequency: "monthly",
    tags: ["gaji", "utama"],
  },
  {
    id: "2",
    type: "EXPENSE",
    category: "Makanan",
    amount: 500000,
    currency: "IDR",
    description: "Groceries mingguan",
    date: new Date("2024-01-15"),
    recurring: true,
    frequency: "weekly",
    tags: ["makanan", "kebutuhan"],
  },
  {
    id: "3",
    type: "INVESTMENT",
    category: "Saham",
    amount: 2000000,
    currency: "IDR",
    description: "Pembelian saham BBCA",
    date: new Date("2024-01-10"),
    recurring: false,
    tags: ["saham", "investasi"],
  },
];

const TRANSACTION_TYPES = [
  { value: "INCOME", label: "Pendapatan", color: "text-success" },
  { value: "EXPENSE", label: "Pengeluaran", color: "text-danger" },
  { value: "INVESTMENT", label: "Investasi", color: "text-info" },
  { value: "DEBT", label: "Utang", color: "text-warning" },
  { value: "ASSET", label: "Aset", color: "text-success" },
  { value: "LIABILITY", label: "Kewajiban", color: "text-danger" },
];

const CATEGORIES = {
  INCOME: ["Gaji", "Bonus", "Freelance", "Bisnis", "Investasi", "Lainnya"],
  EXPENSE: [
    "Makanan",
    "Transportasi",
    "Hiburan",
    "Kesehatan",
    "Pendidikan",
    "Tagihan",
    "Lainnya",
  ],
  INVESTMENT: [
    "Saham",
    "Obligasi",
    "Reksadana",
    "Deposito",
    "Emas",
    "Properti",
    "Lainnya",
  ],
  DEBT: ["KPR", "KTA", "Kartu Kredit", "Pinjaman", "Lainnya"],
  ASSET: ["Kas", "Tabungan", "Deposito", "Properti", "Kendaraan", "Lainnya"],
  LIABILITY: ["Utang Usaha", "Utang Pajak", "Lainnya"],
};

export function TransactionManager({
  transactions = mockTransactions,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}: TransactionManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<FinancialTransaction | null>(null);

  const [newTransaction, setNewTransaction] = useState<
    Omit<FinancialTransaction, "id">
  >({
    type: "EXPENSE",
    category: "",
    amount: 0,
    currency: "IDR",
    description: "",
    date: new Date(),
    recurring: false,
    tags: [],
  });

  const formatCurrency = (amount: number, currency: string = "IDR") => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTypeInfo = (type: FinancialTransaction["type"]) => {
    return (
      TRANSACTION_TYPES.find((t) => t.value === type) || TRANSACTION_TYPES[0]
    );
  };

  const getTypeIcon = (type: FinancialTransaction["type"]) => {
    switch (type) {
      case "INCOME":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "EXPENSE":
        return <TrendingDown className="h-4 w-4 text-danger" />;
      case "INVESTMENT":
        return <TrendingUp className="h-4 w-4 text-info" />;
      default:
        return <DollarSign className="h-4 w-4 text-neutral-500" />;
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType = filterType === "ALL" || transaction.type === filterType;
    const matchesCategory =
      filterCategory === "ALL" || transaction.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const handleAddTransaction = () => {
    if (
      newTransaction.amount > 0 &&
      newTransaction.category &&
      newTransaction.description
    ) {
      onAddTransaction?.(newTransaction);
      setNewTransaction({
        type: "EXPENSE",
        category: "",
        amount: 0,
        currency: "IDR",
        description: "",
        date: new Date(),
        recurring: false,
        tags: [],
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateTransaction = () => {
    if (editingTransaction) {
      onUpdateTransaction?.(editingTransaction.id, editingTransaction);
      setEditingTransaction(null);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    onDeleteTransaction?.(id);
  };

  const TransactionForm = ({
    transaction,
    onChange,
    onSubmit,
    onCancel,
    submitLabel,
  }: {
    transaction: Omit<FinancialTransaction, "id"> | FinancialTransaction;
    onChange: (field: keyof FinancialTransaction, value: unknown) => void;
    onSubmit: () => void;
    onCancel: () => void;
    submitLabel: string;
  }) => (
    <Card className="p-6 mb-6">
      <h3 className="font-semibold text-text-primary mb-4">
        {submitLabel} Transaksi
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipe Transaksi</Label>
          <Select
            value={transaction.type}
            onValueChange={(value) => onChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select
            value={transaction.category}
            onValueChange={(value) => onChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES[transaction.type as keyof typeof CATEGORIES]?.map(
                (category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Jumlah</Label>
          <Input
            id="amount"
            type="number"
            value={transaction.amount}
            onChange={(e) =>
              onChange("amount", parseFloat(e.target.value) || 0)
            }
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Tanggal</Label>
          <Input
            id="date"
            type="date"
            value={transaction.date.toISOString().split("T")[0]}
            onChange={(e) => onChange("date", new Date(e.target.value))}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Input
            id="description"
            value={transaction.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Deskripsi transaksi"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
          <Input
            id="tags"
            value={transaction.tags.join(", ")}
            onChange={(e) =>
              onChange(
                "tags",
                e.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
              )
            }
            placeholder="contoh: makanan, kebutuhan"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <Button onClick={onSubmit}>{submitLabel}</Button>
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">
          Kelola Transaksi
        </h1>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Transaksi
        </Button>
      </div>

      {/* Add Transaction Form */}
      {showAddForm && (
        <TransactionForm
          transaction={newTransaction}
          onChange={(field, value) =>
            setNewTransaction((prev) => ({ ...prev, [field]: value }))
          }
          onSubmit={handleAddTransaction}
          onCancel={() => setShowAddForm(false)}
          submitLabel="Tambah"
        />
      )}

      {/* Edit Transaction Form */}
      {editingTransaction && (
        <TransactionForm
          transaction={editingTransaction}
          onChange={(field, value) =>
            setEditingTransaction((prev) =>
              prev ? { ...prev, [field]: value } : null
            )
          }
          onSubmit={handleUpdateTransaction}
          onCancel={() => setEditingTransaction(null)}
          submitLabel="Update"
        />
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Cari transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Tipe</SelectItem>
              {TRANSACTION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Kategori</SelectItem>
              {Array.from(new Set(transactions.map((t) => t.category))).map(
                (category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Transactions List */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Daftar Transaksi ({filteredTransactions.length})
          </h2>

          <div className="space-y-2">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-text-metadata">
                Tidak ada transaksi yang ditemukan
              </div>
            ) : (
              filteredTransactions.map((transaction) => {
                const typeInfo = getTypeInfo(transaction.type);

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-background-soft transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getTypeIcon(transaction.type)}

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-text-primary">
                            {transaction.description}
                          </h3>
                          <Badge variant="outline" className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                          <Badge variant="outline">
                            {transaction.category}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-text-metadata">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(transaction.date)}
                          </div>

                          {transaction.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {transaction.tags.slice(0, 2).join(", ")}
                              {transaction.tags.length > 2 &&
                                ` +${transaction.tags.length - 2}`}
                            </div>
                          )}

                          {transaction.recurring && (
                            <Badge variant="outline" className="text-xs">
                              Recurring
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        className={`text-lg font-semibold ${typeInfo.color}`}
                      >
                        {transaction.type === "EXPENSE" ? "-" : "+"}
                        {formatCurrency(
                          transaction.amount,
                          transaction.currency
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTransaction(transaction)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteTransaction(transaction.id)
                          }
                        >
                          <Trash2 className="h-4 w-4 text-danger" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
