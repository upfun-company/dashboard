"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

export interface FilterOption {
  id: string;
  name: string;
  options: string[];
  currentValue: string;
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterOption[];
  onFilterChange: (filterId: string, value: string) => void;
  onApplyFilters: () => void;
}

/**
 * Composant de dialogue pour les filtres de rapport
 */
const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  filters,
  onFilterChange,
  onApplyFilters,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres du rapport
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className="grid grid-cols-4 items-center gap-4"
            >
              <Label htmlFor={filter.id} className="text-right">
                {filter.name}
              </Label>
              <Select
                value={filter.currentValue}
                onValueChange={(value) => onFilterChange(filter.id, value)}
              >
                <SelectTrigger id={filter.id} className="col-span-3">
                  <SelectValue placeholder={`Sélectionner ${filter.name}`} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={onApplyFilters}>Appliquer les filtres</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
