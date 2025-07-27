"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Settings, ArrowUpDown, ArrowUp, ArrowDown, Eye, EyeOff, GripVertical, Search } from "lucide-react"

interface Column {
  id: string
  label: string
  visible: boolean
  sortable: boolean
  type?: "text" | "number" | "date" | "badge"
}

interface DataTableAdvancedProps {
  data: any[]
  columns: Column[]
  onSelectionChange: (selectedIds: number[]) => void
  selectedItems: number[]
  title: string
}

type SortConfig = {
  key: string | null
  direction: "asc" | "desc"
}

export function DataTableAdvanced({
  data,
  columns: initialColumns,
  onSelectionChange,
  selectedItems,
  title,
}: DataTableAdvancedProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "asc" })
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data

    // Apply search filter
    if (searchTerm) {
      filtered = data.filter((item) =>
        Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.key!]
        const bVal = b[sortConfig.key!]

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal
        }

        const aStr = String(aVal).toLowerCase()
        const bStr = String(bVal).toLowerCase()

        if (sortConfig.direction === "asc") {
          return aStr < bStr ? -1 : aStr > bStr ? 1 : 0
        } else {
          return aStr > bStr ? -1 : aStr < bStr ? 1 : 0
        }
      })
    }

    return filtered
  }, [data, searchTerm, sortConfig])

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = processedData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId)
    if (!column?.sortable) return

    setSortConfig((prev) => ({
      key: columnId,
      direction: prev.key === columnId && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleColumnReorder = (dragIndex: number, hoverIndex: number) => {
    const dragColumn = columns[dragIndex]
    const newColumns = [...columns]
    newColumns.splice(dragIndex, 1)
    newColumns.splice(hoverIndex, 0, dragColumn)
    setColumns(newColumns)
  }

  const toggleColumnVisibility = (columnId: string) => {
    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, visible: !col.visible } : col)))
  }

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(paginatedData.map((item) => item.id))
    }
  }

  const handleItemSelect = (id: number) => {
    const newSelection = selectedItems.includes(id)
      ? selectedItems.filter((item) => item !== id)
      : [...selectedItems, id]
    onSelectionChange(newSelection)
  }

  const exportToCSV = () => {
    const visibleColumns = columns.filter((col) => col.visible)
    const csvContent = [
      visibleColumns.map((col) => col.label).join(","),
      ...processedData.map((row) => visibleColumns.map((col) => row[col.id] || "").join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-data.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const renderCellValue = (value: any, column: Column) => {
    switch (column.type) {
      case "badge":
        return (
          <Badge variant="outline" className="border-white/20 text-white">
            {value}
          </Badge>
        )
      case "number":
        return typeof value === "number" ? value.toLocaleString() : value
      default:
        return value
    }
  }

  const getSortIcon = (columnId: string) => {
    if (sortConfig.key !== columnId) {
      return <ArrowUpDown className="w-3 h-3 opacity-50" />
    }
    return sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
  }

  const visibleColumns = columns.filter((col) => col.visible)

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-48 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            {/* Column Settings */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Columns
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-slate-900 border-white/20">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Manage Columns</h4>

                  {/* Column Visibility */}
                  <div className="space-y-2">
                    <h5 className="text-sm text-white/80">Visibility</h5>
                    {columns.map((column) => (
                      <div key={column.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={column.id}
                          checked={column.visible}
                          onCheckedChange={() => toggleColumnVisibility(column.id)}
                        />
                        <label htmlFor={column.id} className="text-sm text-white flex items-center gap-2">
                          {column.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {column.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Column Reordering */}
                  <div className="space-y-2">
                    <h5 className="text-sm text-white/80">Reorder Columns</h5>
                    <div className="space-y-1">
                      {columns.map((column, index) => (
                        <div
                          key={column.id}
                          className="flex items-center gap-2 p-2 bg-white/10 rounded text-white text-sm cursor-move"
                        >
                          <GripVertical className="w-3 h-3 text-white/50" />
                          {column.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Export */}
            <Button
              size="sm"
              onClick={exportToCSV}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Show</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-20 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-white/60">entries</span>
            </div>

            <div className="text-sm text-white/60">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, processedData.length)} of{" "}
              {processedData.length} entries
              {searchTerm && ` (filtered from ${data.length} total entries)`}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  {visibleColumns.map((column) => (
                    <TableHead
                      key={column.id}
                      className={`text-white/80 ${column.sortable ? "cursor-pointer hover:text-white" : ""}`}
                      onClick={() => column.sortable && handleSort(column.id)}
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.sortable && getSortIcon(column.id)}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleItemSelect(item.id)}
                      />
                    </TableCell>
                    {visibleColumns.map((column) => (
                      <TableCell key={column.id} className="text-white/90">
                        {renderCellValue(item[column.id], column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
                >
                  Previous
                </Button>
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={(currentPage) => setCurrentPage(pageNum)}
                      className={
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-green-500 to-blue-600 text-white"
                          : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                      }
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
