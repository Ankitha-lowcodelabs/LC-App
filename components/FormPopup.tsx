"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  FormGroup,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface FormPopupProps {
  open: boolean
  onClose: () => void
}

export default function FormPopup({ open, onClose }: FormPopupProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    appName: '',
    appCode: '',
    appType: '',
    approvalFlow: '',
    exportOptions: [] as string[],
    expose: [] as string[],
    appdescription: '',
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target
    if (type === 'checkbox') {
      const updatedArray = checked
        ? [...formData[name as keyof typeof formData] as string[], value]
        : (formData[name as keyof typeof formData] as string[]).filter((item) => item !== value)
      setFormData((prev) => ({ ...prev, [name]: updatedArray }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const existingApps = JSON.parse(localStorage.getItem('existingApps') || '[]')
    const newApp = {
      ...formData,
      records: [] // This will be populated in the RecordsTable component
    }
    existingApps.push(newApp)
    localStorage.setItem('existingApps', JSON.stringify(existingApps))
    localStorage.setItem('currentApp', JSON.stringify(newApp))
    router.push('/records')
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Create New App
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="App Name"
            name="appName"
            value={formData.appName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="App Code"
            name="appCode"
            value={formData.appCode}
            onChange={handleChange}
            required
          />
          
          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">1. Record Management</FormLabel>
            <RadioGroup
              name="appType"
              value={formData.appType}
              onChange={handleChange}
              row
            >
              <FormControlLabel value="Simple Form" control={<Radio />} label="Simple Form" />
              <FormControlLabel value="Form with table" control={<Radio />} label="Form with Table" />
              <FormControlLabel value="section with form and table" control={<Radio />} label="Section with Form and Table" />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">2. Approval Flow</FormLabel>
            <RadioGroup
              name="approvalFlow"
              value={formData.approvalFlow}
              onChange={handleChange}
              row
            >
              <FormControlLabel value="linearflow" control={<Radio />} label="Linear Flow" />
              <FormControlLabel value="parallelflow" control={<Radio />} label="Parallel Flow" />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">3. Able to Export</FormLabel>
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox checked={formData.exportOptions.includes('pdf')} onChange={handleChange} name="exportOptions" value="pdf" />}
                label="PDF"
              />
              <FormControlLabel
                control={<Checkbox checked={formData.exportOptions.includes('word')} onChange={handleChange} name="exportOptions" value="word" />}
                label="Word"
              />
              <FormControlLabel
                control={<Checkbox checked={formData.exportOptions.includes('excel')} onChange={handleChange} name="exportOptions" value="excel" />}
                label="Excel"
              />
            </FormGroup>
          </FormControl>

          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">4. Need to expose data via service</FormLabel>
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox checked={formData.expose.includes('create')} onChange={handleChange} name="expose" value="create" />}
                label="Create"
              />
              <FormControlLabel
                control={<Checkbox checked={formData.expose.includes('read')} onChange={handleChange} name="expose" value="read" />}
                label="Read"
              />
              <FormControlLabel
                control={<Checkbox checked={formData.expose.includes('delete')} onChange={handleChange} name="expose" value="delete" />}
                label="Delete"
              />
              <FormControlLabel
                control={<Checkbox checked={formData.expose.includes('update')} onChange={handleChange} name="expose" value="update" />}
                label="Update"
              />
            </FormGroup>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="App Description"
            name="appdescription"
            value={formData.appdescription}
            onChange={handleChange}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Let's create app
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

