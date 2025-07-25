"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui";

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Profil Pengguna
          </h1>
          <p className="text-text-description">
            Kelola informasi pribadi dan preferensi akun Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardBody className="text-center">
                <Avatar className="mx-auto mb-4 h-16 w-16">
                  <AvatarImage
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt="John Doe"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold text-text-primary">
                  John Doe
                </h3>
                <p className="text-text-metadata">Premium Member</p>
                <p className="text-sm text-text-description mt-2">
                  Bergabung sejak Januari 2024
                </p>
              </CardBody>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Informasi Pribadi
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-text-description">Nama</p>
                      <p className="font-medium">John Doe</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-description">Email</p>
                      <p className="font-medium">john.doe@email.com</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-description">Telepon</p>
                      <p className="font-medium">+62 812 3456 7890</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-description">Status</p>
                      <p className="font-medium">Premium Member</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-text-description">
                      Halaman profil lengkap akan tersedia setelah implementasi
                      form components selesai.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
