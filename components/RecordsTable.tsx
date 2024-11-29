"use client"

import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import { useRouter } from 'next/navigation'

interface Record {
  id: number
  name: string
  type: string
  length: string
}

export default function RecordsTable() {
  const [records, setRecords] = useState<Record[]>([
    { id: 1, name: 'EID', type: 'string', length: '20' },
    { id: 2, name: 'Name', type: 'string', length: '50' },
  ])
  const router = useRouter()

  useEffect(() => {
    const savedRecords = localStorage.getItem('currentAppRecords')
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords))
    }
  }, [])

  const addNewRow = () => {
    const newId = records.length + 1
    setRecords([...records, { id: newId, name: '', type: 'string', length: '' }])
  }

  const updateRecord = (id: number, field: keyof Record, value: string) => {
    setRecords(
      records.map((record) =>
        record.id === id ? { ...record, [field]: value } : record
      )
    )
  }

  const deleteRecord = (id: number) => {
    setRecords(records.filter((record) => record.id !== id))
  }

  const saveRecords = () => {
    const currentApp = JSON.parse(localStorage.getItem('currentApp') || '{}')
    currentApp.records = records
    
    const existingApps = JSON.parse(localStorage.getItem('existingApps') || '[]')
    const updatedApps = existingApps.map((app: any) => 
      app.appCode === currentApp.appCode ? currentApp : app
    )
    
    localStorage.setItem('existingApps', JSON.stringify(updatedApps))
    localStorage.removeItem('currentApp')
    localStorage.removeItem('currentAppRecords')
    
    router.push('/existing-apps')
  }

  return (
    <div className="p-4">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Record name</TableCell>
              <TableCell>Record type</TableCell>
              <TableCell>Record length</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <TextField
                    value={record.name}
                    onChange={(e) => updateRecord(record.id, 'name', e.target.value)}
                    placeholder="Enter record name"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={record.type}
                    onChange={(e) => updateRecord(record.id, 'type', e.target.value as string)}
                  >
                    <MenuItem value="string">String</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="boolean">Boolean</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <TextField
                    value={record.length}
                    onChange={(e) => updateRecord(record.id, 'length', e.target.value)}
                    placeholder="Enter length"
                    type="number"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => deleteRecord(record.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-between mt-4">
        <Button
          startIcon={<AddIcon />}
          onClick={addNewRow}
          variant="outlined"
        >
          Add Row
        </Button>
        <Button
          startIcon={<SaveIcon />}
          onClick={saveRecords}
          variant="contained"
          color="primary"
        >
          Save Records
        </Button>
      </div>
    </div>
  )
}

