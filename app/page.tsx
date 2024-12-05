"use client"

import React, { useState } from 'react'

import { Button, Card, CardContent, IconButton } from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import FormPopup from '@/components/FormPopup'

export default function FormBuilder() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const handleOpenForm = () => {
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
  }

  const handleViewExistingApps = () => {
    router.push('/existing-apps')
  }

  return (
    <div className="min-h-screen bg-sky-200 p-4">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">FormBuilder</h1>
        <IconButton size="large" edge="end" color="inherit" aria-label="account">
          <AccountCircle />
        </IconButton>
      </div>

      {/* Main Content */}
      <Card className="mx-auto max-w-md">
        <CardContent className="flex flex-col gap-4 p-6 items-center justify-center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            style={{ height: '48px', fontSize: '1.125rem', fontWeight: 500 }}
            onClick={handleOpenForm}
          >
            Create New App
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            fullWidth
            style={{ height: '48px', fontSize: '1.125rem', fontWeight: 500 }}
            onClick={handleViewExistingApps}
          >
            View Existing Apps
          </Button>
        </CardContent>
      </Card>

      <FormPopup app={null} open={isFormOpen} onClose={handleCloseForm} />
    </div>
  )
}

