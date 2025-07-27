"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DataTableProps {
  data: any[]
  title?: string
}

export function DataTable({ data, title }: DataTableProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
        {title && (
          <CardHeader>
            <CardTitle className="text-white">{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center text-white/60 py-8">No data available</div>
        </CardContent>
      </Card>
    )
  }

  const columns = Object.keys(data[0])

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
      {title && (
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/20">
                {columns.map((column) => (
                  <TableHead key={column} className="text-white/80 capitalize">
                    {column.replace(/([A-Z])/g, " $1").trim()}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} className="border-white/10 hover:bg-white/5">
                  {columns.map((column) => (
                    <TableCell key={column} className="text-white/90">
                      {typeof row[column] === "number" ? row[column].toLocaleString() : String(row[column])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
