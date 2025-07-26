"use client";

import React from "react";
import { EducationOverview } from "@/components/education";
import { FinancialOverview, TransactionManager } from "@/components/financial";
import { UserProfileForm, ConsultationBookingForm } from "@/components/forms";
import { Card } from "@/components/ui/kartu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ComponentsShowcase() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Fintar Components Showcase
        </h1>
        <p className="text-text-description">
          Demonstrasi komponen-komponen yang telah dibuat sesuai dengan sistem
          backend dan database
        </p>
      </div>

      <Tabs defaultValue="education" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="education" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Education Components</h2>
            <p className="text-text-description mb-4">
              Komponen untuk pembelajaran dan edukasi keuangan yang sesuai
              dengan database schema.
            </p>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Education Overview</h3>
                <EducationOverview />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Financial Components</h2>
            <p className="text-text-description mb-4">
              Komponen untuk manajemen keuangan yang sesuai dengan FinancialData
              model di database.
            </p>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Financial Overview</h3>
                <FinancialOverview />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Transaction Manager
                </h3>
                <TransactionManager />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Form Components</h2>
            <p className="text-text-description mb-4">
              Komponen form yang sesuai dengan User dan Consultation model di
              database.
            </p>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">User Profile Form</h3>
                <UserProfileForm
                  onSubmit={(data) => console.log("Profile data:", data)}
                  onCancel={() => console.log("Profile cancelled")}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Consultation Booking Form
                </h3>
                <ConsultationBookingForm
                  consultants={[
                    {
                      id: "1",
                      firstName: "John",
                      lastName: "Doe",
                      specialization: ["Financial Planning", "Investment"],
                      experience: 5,
                      rating: 4.8,
                      hourlyRate: 500000,
                      availability: {},
                      bio: "Experienced financial consultant with 5 years in the industry.",
                    },
                  ]}
                  onSubmit={(data) => console.log("Booking data:", data)}
                  onCancel={() => console.log("Booking cancelled")}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Component Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4">
                <h3 className="font-semibold text-text-primary mb-2">
                  Education Components
                </h3>
                <ul className="text-sm text-text-description space-y-1">
                  <li>• EducationOverview - Ringkasan pembelajaran</li>
                  <li>• LearningModule - Modul pembelajaran interaktif</li>
                </ul>
                <p className="text-xs text-text-metadata mt-2">
                  Sesuai dengan struktur pembelajaran dan progress tracking
                </p>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-text-primary mb-2">
                  Financial Components
                </h3>
                <ul className="text-sm text-text-description space-y-1">
                  <li>• FinancialOverview - Dashboard keuangan</li>
                  <li>• TransactionManager - Kelola transaksi</li>
                </ul>
                <p className="text-xs text-text-metadata mt-2">
                  Sesuai dengan FinancialData model dan enum types
                </p>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-text-primary mb-2">
                  Form Components
                </h3>
                <ul className="text-sm text-text-description space-y-1">
                  <li>• UserProfileForm - Form profil pengguna lengkap</li>
                  <li>• ConsultationBookingForm - Form booking konsultasi</li>
                </ul>
                <p className="text-xs text-text-metadata mt-2">
                  Sesuai dengan User, UserProfile, dan Consultation models
                </p>
              </Card>
            </div>

            <div className="mt-6 p-4 bg-background-soft rounded-lg">
              <h4 className="font-medium text-text-primary mb-2">
                Teknologi yang Digunakan:
              </h4>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded">
                  Radix UI
                </span>
                <span className="px-2 py-1 bg-secondary-100 text-secondary-800 rounded">
                  Tailwind CSS
                </span>
                <span className="px-2 py-1 bg-accent-100 text-accent-800 rounded">
                  TypeScript
                </span>
                <span className="px-2 py-1 bg-success-100 text-success-800 rounded">
                  React
                </span>
                <span className="px-2 py-1 bg-info-100 text-info-800 rounded">
                  Next.js
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 border border-neutral-200 rounded-lg">
              <h4 className="font-medium text-text-primary mb-2">
                Database Schema Compliance:
              </h4>
              <ul className="text-sm text-text-description space-y-1">
                <li>✅ User model (firstName, lastName, email, phone, etc.)</li>
                <li>
                  ✅ UserProfile model (dateOfBirth, gender, occupation, etc.)
                </li>
                <li>
                  ✅ FinancialData model (type, category, amount, currency,
                  etc.)
                </li>
                <li>
                  ✅ Consultation model (type, scheduledAt, duration, etc.)
                </li>
                <li>
                  ✅ Enums (UserRole, Gender, FinancialType, ConsultationType,
                  etc.)
                </li>
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
