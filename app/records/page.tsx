"use client"

import React from 'react'
import RecordsTable from '@/components/RecordsTable'

export default function RecordsPage() {
  return (
    <div className="min-h-screen bg-sky-200 p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Records</h1>
      <RecordsTable />
    </div>
  )
}

