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
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import { useRouter } from 'next/navigation'
import ListSelectionModal from './ListSelectionModal'
import NewListModal from './NewListModal'
import { createClient } from '@supabase/supabase-js'

interface List {
  name: string
  items: string[]
}

interface Record {
  id: number
  name: string
  type: string
  length: string
  listItems?: string[] // Add this for list type records
}

interface AppData {
  appName: string
  appCode: string
  appType: string
  approvalFlow: string
  exportOptions: string[]
  expose: string[]
  appdescription: string
  records: Record[]
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const mapFieldTypeToSQL = (type: string, length: string) => {
  switch (type) {
    case 'string':
      return `VARCHAR(${length || '255'})`;
    case 'number':
      return 'INTEGER';
    case 'boolean':
      return 'BOOLEAN';
    case 'date':
      return 'TIMESTAMP';
    default:
      return 'TEXT'; // Fallback type
  }
}

export default function RecordsTable() {
  const [records, setRecords] = useState<Record[]>([
    { id: 1, name: 'EID', type: 'string', length: '20' },
    { id: 2, name: 'Name', type: 'string', length: '50' },
  ])
  const [openListModal, setOpenListModal] = useState(false)
  const [openNewListModal, setOpenNewListModal] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null)
  const [savedLists, setSavedLists] = useState<List[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load saved records
    const savedRecords = localStorage.getItem('currentAppRecords')
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords))
    }

    // Load saved lists
    const savedListsData = localStorage.getItem('savedLists')
    if (savedListsData) {
      setSavedLists(JSON.parse(savedListsData))
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

  const saveRecords = async () => {
    const currentApp = JSON.parse(localStorage.getItem('currentApp') || '{}')
    currentApp.records = records
    
    const existingApps = JSON.parse(localStorage.getItem('existingApps') || '[]')
    const updatedApps = existingApps.map((app: AppData) => 
      app.appCode === currentApp.appCode ? currentApp : app
    )
    
    localStorage.setItem('existingApps', JSON.stringify(updatedApps))
    localStorage.removeItem('currentApp')
    localStorage.removeItem('currentAppRecords')

    // Retrieve the app ID and other necessary data from the apps table
    const { data: appData, error: appError } = await supabase
      .from('apps')
      .select('id, app_name, app_code') // Fetch additional fields as needed
      .eq('app_code', currentApp.appCode)
      .single()
      
    console.log('appData', appData)
    if (appError) {
      console.error('Error fetching app data:', appError)
      return
    }

    const appId = appData.id; // Get the app ID
    const appName = appData.app_name; // Get the app name
    // const appType = appData.app_type; // Get the app type

    // Insert records into app_fields table
    for (const record of records) {
      const { error } = await supabase
        .from('app_fields')
        .insert({
          app_id: appId, // Use the retrieved app ID
          field_name: record.name,
          field_type: record.type,
          field_length: record.length,
          is_required: true // Assuming all fields are required
        })

      if (error) {
        console.error('Error inserting record into app_fields:', error)
        return
      }
    }

    // Create a new table in Supabase
    await createDynamicTable(currentApp.appCode, records, appName)

    router.push('/existing-apps')
  }

  const createDynamicTable = async (appCode: string, fields: Record[], appName: string, appType: string) => {
    let createTableSQL = `
      CREATE TABLE IF NOT EXISTS app_${appCode} (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        app_name VARCHAR(255) DEFAULT '${appName}',  -- Add app name
        app_type VARCHAR(255) DEFAULT '${appType}',  -- Add app type
    `;

    fields.forEach(field => {
      createTableSQL += `${field.name} ${mapFieldTypeToSQL(field.type, field.length)},`;
    });

    createTableSQL = createTableSQL.slice(0, -1) + ');'; // Remove the last comma and close the statement

    console.log('Executing SQL:', createTableSQL); // Log the SQL command for debugging

    const { error } = await supabase.rpc('execute_sql', { sql: createTableSQL });
    if (error) {
      console.error('Error creating dynamic table:', error);
      throw error; // Throw error to stop execution if table creation fails
    } else {
      console.log(`Table app_${appCode} created successfully.`); // Log success message
    }
  }

  const handleTypeChange = (id: number, value: string) => {
    if (value === 'lists') {
      setSelectedRecordId(id)
      setOpenListModal(true)
    } else {
      updateRecord(id, 'type', value)
    }
  }

  const handleListSelect = (listName: string, items: string[]) => {
    if (selectedRecordId !== null) {
      setRecords(records.map(record => 
        record.id === selectedRecordId 
          ? { ...record, type: `lists:${listName}`, listItems: items }
          : record
      ))
    }
    setOpenListModal(false)
  }

  const handleNewListSave = (listName: string, items: string[]) => {
    const newList = { name: listName, items }
    const updatedLists = [...savedLists, newList]
    setSavedLists(updatedLists)
    localStorage.setItem('savedLists', JSON.stringify(updatedLists))
    setOpenNewListModal(false)
    setOpenListModal(true)
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
                    value={record.type.startsWith('lists:') ? 'lists' : record.type}
                    onChange={(e) => handleTypeChange(record.id, e.target.value as string)}
                  >
                    <MenuItem value="string">String</MenuItem>
                    <MenuItem value="number">Number</MenuItem>
                    <MenuItem value="boolean">Boolean</MenuItem>
                    <MenuItem value="date">Date&Time</MenuItem>
                    <MenuItem value="lists">Lists</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {record.type !== 'date' && !record.type.startsWith('lists:') && (
                    <TextField
                      value={record.length}
                      onChange={(e) => updateRecord(record.id, 'length', e.target.value)}
                      placeholder="Enter length"
                      type="number"
                    />
                  )}
                  {record.type.startsWith('lists:') && (
                    <Typography>
                      {record.type.split(':')[1]} ({record.listItems?.length} items)
                    </Typography>
                  )}
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
      <ListSelectionModal
        open={openListModal}
        onClose={() => setOpenListModal(false)}
        onSelect={handleListSelect}
        onNewList={() => {
          setOpenListModal(false)
          setOpenNewListModal(true)
        }}
        savedLists={savedLists}
        onDeleteList={(listName) => {
          setSavedLists(savedLists.filter(list => list.name !== listName));
          localStorage.setItem('savedLists', JSON.stringify(savedLists.filter(list => list.name !== listName)));
        }}
      />
      <NewListModal
        open={openNewListModal}
        onClose={() => setOpenNewListModal(false)}
        onSave={handleNewListSave}
      />
    </div>
  )
}
