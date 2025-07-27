"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { ChevronDown, X, Search } from "lucide-react"

interface MultiSelectProps {
  options: string[]
  selected: string[]
  onSelectionChange: (selected: string[]) => void
  placeholder: string
  searchPlaceholder?: string
}

export function MultiSelect({
  options,
  selected,
  onSelectionChange,
  placeholder,
  searchPlaceholder = "Search...",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOptions = options.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleToggle = (option: string) => {
    const newSelected = selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]
    onSelectionChange(newSelected)
  }

  const handleRemove = (option: string) => {
    onSelectionChange(selected.filter((item) => item !== option))
  }

  const handleClearAll = () => {
    onSelectionChange([])
  }

  const handleSelectAll = () => {
    onSelectionChange(filteredOptions)
  }

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <span className="truncate">
              {selected.length === 0
                ? placeholder
                : selected.length === 1
                  ? selected[0]
                  : `${selected.length} selected`}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-slate-900 border-white/20" align="start">
          <div className="p-3 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSelectAll}
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Select All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearAll}
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Clear All
              </Button>
            </div>

            {/* Options */}
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredOptions.length === 0 ? (
                <div className="text-center text-white/60 py-4">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option}
                    className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded cursor-pointer"
                    onClick={() => handleToggle(option)}
                  >
                    <Checkbox checked={selected.includes(option)} />
                    <span className="text-white text-sm flex-1">{option}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected Items */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((item) => (
            <Badge key={item} variant="secondary" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
              {item}
              <button onClick={() => handleRemove(item)} className="ml-1 hover:bg-blue-500/40 rounded-full p-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
