"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Box,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

interface Record {
  id: number
  name: string
  type: string
  length: string
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

export default function ExistingApps() {
  const [apps, setApps] = useState<AppData[]>([])
  const router = useRouter()

  useEffect(() => {
    const savedApps = localStorage.getItem('existingApps')
    if (savedApps) {
      setApps(JSON.parse(savedApps))
    }
  }, [])

  const handleEdit = (appCode: string) => {
    // For now, we'll just log the action. In a real app, you'd implement the edit functionality.
    console.log(`Editing app with code: ${appCode}`)
    // You could navigate to an edit page or open a modal here
    // router.push(`/edit-app/${appCode}`)
  }

  const handleDelete = (appCode: string) => {
    const updatedApps = apps.filter(app => app.appCode !== appCode)
    setApps(updatedApps)
    localStorage.setItem('existingApps', JSON.stringify(updatedApps))
  }

  return (
    <div className="min-h-screen bg-sky-200 p-4">
      <Typography variant="h4" component="h1" gutterBottom className="text-gray-800 mb-8">
        Existing Apps
      </Typography>
      <Grid container spacing={4}>
        {apps.map((app, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="bg-sky-100 shadow-lg">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" component="h2">
                    {app.appName}
                  </Typography>
                  <Box>
                    <IconButton
                      aria-label={`Edit ${app.appName}`}
                      onClick={() => handleEdit(app.appCode)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label={`Delete ${app.appName}`}
                      onClick={() => handleDelete(app.appCode)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary" paragraph>
                  <strong>App Code:</strong> {app.appCode}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  <strong>App Type:</strong> {app.appType}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  <strong>Approval Flow:</strong> {app.approvalFlow}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  <strong>Export Options:</strong> {app.exportOptions.join(", ")}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  <strong>Access Control:</strong> {app.expose.join(", ")}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  <strong>Description:</strong> {app.appdescription}
                </Typography>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                  >
                    <Typography>View Records</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Length</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {app.records.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>{record.name}</TableCell>
                              <TableCell>{record.type}</TableCell>
                              <TableCell>{record.length}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

