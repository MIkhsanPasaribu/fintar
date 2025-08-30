/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/types";

interface FormFieldProps {
  label: string;
  field: keyof UserProfile;
  value: any;
  isEditing: boolean;
  onChange: (field: keyof UserProfile, value: any) => void;
  type?: "text" | "number" | "date" | "select" | "textarea";
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  displayValue?: string;
  rows?: number;
}

export function FormField({
  label,
  field,
  value,
  isEditing,
  onChange,
  type = "text",
  options = [],
  placeholder,
  displayValue,
  rows = 3,
}: FormFieldProps) {
  const handleChange = (newValue: any) => {
    if (type === "number") {
      onChange(field, newValue ? parseFloat(newValue) : undefined);
    } else {
      onChange(field, newValue);
    }
  };

  const getDisplayValue = () => {
    if (displayValue) return displayValue;
    if (value === undefined || value === null || value === "")
      return "Belum diisi";

    if (type === "select" && options.length > 0) {
      const option = options.find((opt) => opt.value === value);
      return option ? option.label : value;
    }

    if (type === "date" && value) {
      return new Date(value).toLocaleDateString("id-ID");
    }

    return value.toString();
  };

  if (!isEditing) {
    return (
      <div>
        <Label>{label}</Label>
        <p className="text-text-primary mt-1">{getDisplayValue()}</p>
      </div>
    );
  }

  switch (type) {
    case "select":
      return (
        <div>
          <Label htmlFor={field}>{label}</Label>
          <Select value={value || ""} onValueChange={handleChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case "textarea":
      return (
        <div>
          <Label htmlFor={field}>{label}</Label>
          <Textarea
            id={field}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
          />
        </div>
      );

    case "date":
      return (
        <div>
          <Label htmlFor={field}>{label}</Label>
          <Input
            id={field}
            type="date"
            value={value ? value.split("T")[0] : ""}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
      );

    case "number":
      return (
        <div>
          <Label htmlFor={field}>{label}</Label>
          <Input
            id={field}
            type="number"
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            min={field === "dependents" ? "0" : undefined}
          />
        </div>
      );

    default:
      return (
        <div>
          <Label htmlFor={field}>{label}</Label>
          <Input
            id={field}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
          />
        </div>
      );
  }
}
