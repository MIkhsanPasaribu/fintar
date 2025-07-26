"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/kartu";
import { Button } from "@/components/ui/tombol";
import { Badge } from "@/components/ui/badge";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            ✨ Fintar Design System Test
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Design System{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Working
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Testing Tailwind v4, Radix UI components, and custom styling.
          </p>
        </div>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button size="lg">Large Button</Button>
              <Button size="sm">Small</Button>
            </div>

            {/* Custom Fintar Button Styles */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">
                Custom Fintar Buttons
              </h4>
              <div className="flex flex-wrap gap-4">
                <button className="btn-fintar-primary px-6 py-3 rounded-lg">
                  Primary Fintar
                </button>
                <button className="btn-fintar-secondary px-6 py-3 rounded-lg">
                  Secondary Fintar
                </button>
                <button className="btn-fintar-outline px-6 py-3 rounded-lg">
                  Outline Fintar
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle>Custom Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-description">
                This card uses custom styling with hover effects.
              </p>
            </CardContent>
          </Card>

          <Card className="financial-card">
            <CardHeader>
              <CardTitle>Financial Card</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="currency-display text-xl">Rp 1,250,000</div>
              <div className="positive-value">+12.5% ↗</div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Glass Effect</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Modern glassmorphism design</p>
            </CardContent>
          </Card>
        </div>

        {/* Color Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Color System Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary text-white p-4 rounded-lg text-center">
                Primary
              </div>
              <div className="bg-secondary-500 text-white p-4 rounded-lg text-center">
                Secondary
              </div>
              <div className="bg-accent-500 text-white p-4 rounded-lg text-center">
                Accent
              </div>
              <div className="bg-success text-white p-4 rounded-lg text-center">
                Success
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animation Test */}
        <Card>
          <CardHeader>
            <CardTitle>Animation Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="animate-fade-in bg-blue-100 p-4 rounded">
                Fade In Animation
              </div>
              <div className="animate-slide-up bg-green-100 p-4 rounded">
                Slide Up Animation
              </div>
              <div className="animate-bounce-in bg-purple-100 p-4 rounded">
                Bounce In Animation
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle>Typography Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h1 className="text-4xl font-bold text-text-primary">Heading 1</h1>
            <h2 className="text-3xl font-semibold text-text-secondary">
              Heading 2
            </h2>
            <h3 className="text-2xl font-medium text-text-body">Heading 3</h3>
            <p className="text-text-paragraph">
              This is paragraph text. Lorem ipsum dolor sit amet consectetur
              adipisicing elit.
            </p>
            <p className="text-text-description">
              This is description text with lighter color.
            </p>
            <p className="text-text-caption">
              This is caption text for small information.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
