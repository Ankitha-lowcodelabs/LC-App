"use client"

import React from 'react'
import {
  Modal,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';

interface List {
  name: string
  items: string[]
}

interface ListSelectionModalProps {
  open: boolean
  onClose: () => void
  onSelect: (listName: string, items: string[]) => void
  onNewList: () => void
  savedLists: List[]
  onDeleteList: (listName: string) => void
}

const ListSelectionModal: React.FC<ListSelectionModalProps> = ({
  open,
  onClose,
  onSelect,
  onNewList,
  savedLists,
  onDeleteList,
}) => {
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
        <Typography variant="h6" component="h2" gutterBottom>
          Choose Lists
        </Typography>

        <List sx={{ mb: 2 }}>
          {savedLists.map((list, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => onSelect(list.name, list.items)}>
                <ListItemText 
                  primary={list.name}
                  secondary={`${list.items.length} items`}
                />
                <DeleteIcon 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteList(list.name);
                  }}
                  sx={{ cursor: 'pointer', ml: 1 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button onClick={onNewList} variant="contained">
            + New
          </Button>
          <Button onClick={onClose} variant="contained">
            Select
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default ListSelectionModal

