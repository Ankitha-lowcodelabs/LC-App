import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { supabase } from '@/lib/supabaseClient';

interface UpdateRecordFormProps {
  appCode: string;
  record: { id: number; name: string; type: string; length: number; eid: string };
  onUpdate: () => void;
}

const UpdateRecordForm: React.FC<UpdateRecordFormProps> = ({ appCode, record, onUpdate }) => {
  const [formData, setFormData] = useState(record);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Update the record in Supabase
    const { error } = await supabase
      .from(`app_${appCode}`)
      .update({ eid: formData.eid, name: formData.name })
      .eq('id', record.id); // Assuming 'id' is the primary key

    if (error) {
      console.error('Error updating record:', error);
    } else {
      onUpdate(); // Call the onUpdate function to refresh the records
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField name="eid" label="EID" value={formData.eid} onChange={handleChange} required />
      <TextField name="name" label="Name" value={formData.name} onChange={handleChange} required />
      <Button type="submit" variant="contained" color="primary">Save Changes</Button>
    </form>
  );
};

export default UpdateRecordForm; 