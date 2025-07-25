/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Badge, Button } from "@/components/ui";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import TransactionForm from "@/components/forms/transaction-form";

interface RecentTransactionsProps {
  transactions: Transaction[];
  onAddTransaction?: (transaction: any) => void;
  onEditTransaction?: (id: string, transaction: any) => void;
  onDeleteTransaction?: (id: string) => void;
}

const PlusIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export default function RecentTransactions({
  transactions,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
}: RecentTransactionsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "income":
        return "↗";
      case "expense":
        return "↙";
      case "investment":
        return "📈";
      default:
        return "💰";
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "income":
        return "text-[#00C853]";
      case "expense":
        return "text-[#D32F2F]";
      case "investment":
        return "text-[#FFB800]";
      default:
        return "text-[#78909C]";
    }
  };

  const getCategoryLabel = (category?: string) => {
    const categoryLabels: Record<string, string> = {
      SALARY: "Gaji",
      FREELANCE: "Freelance",
      FOOD: "Makanan",
      TRANSPORTATION: "Transportasi",
      UTILITIES: "Utilitas",
      RENT: "Sewa",
      STOCKS: "Saham",
      MUTUAL_FUND: "Reksadana",
      CREDIT_CARD: "Kartu Kredit",
      // Add more category mappings as needed
    };
    return categoryLabels[category || ""] || category || "Lainnya";
  };

  const handleAddTransaction = async (data: any) => {
    if (onAddTransaction) {
      await onAddTransaction(data);
    }
    setIsFormOpen(false);
  };

  const handleEditTransaction = async (data: any) => {
    if (editingTransaction && onEditTransaction) {
      await onEditTransaction(editingTransaction.id, data);
    }
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction({
      ...transaction,
      date: transaction.date.split("T")[0], // Convert to YYYY-MM-DD format
    });
  };

  const handleDelete = async (id: string) => {
    if (
      onDeleteTransaction &&
      confirm("Yakin ingin menghapus transaksi ini?")
    ) {
      await onDeleteTransaction(id);
    }
  };

  return (
    <>
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">
              Transaksi Terbaru
            </h2>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFormOpen(true)}
                icon={<PlusIcon />}
              >
                Tambah
              </Button>
              <Button variant="ghost" size="sm">
                Lihat Semua
              </Button>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-medium text-[#0A1628] mb-2">
                Belum ada transaksi
              </h3>
              <p className="text-[#546E7A] mb-4">
                Mulai catat transaksi keuangan Anda untuk analisis yang lebih baik
              </p>
              <Button onClick={() => setIsFormOpen(true)} icon={<PlusIcon />}>
                Tambah Transaksi Pertama
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between py-3 border-b border-neutral-200 last:border-b-0 group"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center bg-[#F8F9FA] ${getTransactionColor(
                        transaction.type
                      )}`}
                    >
                      <span className="text-lg">
                        {getTransactionIcon(transaction.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-text-primary truncate">
                          {transaction.description}
                        </p>
                        {transaction.category && (
                          <Badge variant="secondary" size="sm">
                            {getCategoryLabel(transaction.category)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-text-metadata">
                        {formatDate(new Date(transaction.date))}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div
                      className={`font-semibold text-right ${
                        transaction.amount > 0 ? "text-[#00C853]" : "text-[#D32F2F]"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </div>

                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="p-1 text-[#78909C] hover:text-[#0052CC] rounded"
                        title="Edit transaksi"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-1 text-[#78909C] hover:text-[#D32F2F] rounded"
                        title="Hapus transaksi"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add Transaction Form */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTransaction}
      />

      {/* Edit Transaction Form */}
      <TransactionForm
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSubmit={handleEditTransaction}
        initialData={editingTransaction}
      />
    </>
  );
}

