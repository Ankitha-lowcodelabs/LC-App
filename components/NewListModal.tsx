"use client"

import React, { useState } from 'react'
import {
  Modal,
  Box,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

interface NewListModalProps {
  open: boolean
  onClose: () => void
  onSave: (listName: string, items: string[]) => void
}

const NewListModal: React.FC<NewListModalProps> = ({ open, onClose, onSave }) => {
  const [listName, setListName] = useState('Untitled list')
  const [items, setItems] = useState<string[]>([''])

  const handleAddItem = () => {
    setItems([...items, ''])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleItemChange = (index: number, value: string) => {
    const newItems = items.map((item, i) => (i === index ? value : item))
    setItems(newItems)
  }

  const handleSave = () => {
    const validItems = items.filter(item => item.trim() !== '')
    if (listName.trim() && validItems.length > 0) {
      onSave(listName.trim(), validItems)
      setListName('Untitled list')
      setItems([''])
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <TextField
          fullWidth
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          sx={{ mb: 3 }}
          variant="standard"
        />
        
        <List sx={{ width: '100%', mb: 2 }}>
          {items.map((item, index) => (
            <ListItem
              key={index}
              sx={{ px: 0 }}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveItem(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <TextField
                fullWidth
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder="Enter list item"
                variant="outlined"
                size="small"
              />
            </ListItem>
          ))}
        </List>

        <Button
          startIcon={<AddIcon />}
          onClick={handleAddItem}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        >
          Add Item
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default NewListModal

