import React, { useState } from "react";
import { supabase } from "@/components/lib/supabaseClient";

interface RecordData {
  id: number;
  name: string;
  type: string;
  length: number;
  eid: string;
}

interface UpdateRecordFormProps {
  appCode: string;
  record: RecordData;
  onUpdate: () => void;
}

const UpdateRecordForm: React.FC<UpdateRecordFormProps> = ({
  appCode,
  record,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<RecordData>(record);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from(`app_${appCode}`)
      .update({
        name: formData.name,
        type: formData.type,
        length: formData.length,
        eid: formData.eid,
      })
      .eq("id", formData.id);

    setLoading(false);

    if (error) {
      console.error("Error updating record:", error);
    } else {
      onUpdate(); // Notify parent component about the update
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border rounded w-full px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Type</label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border rounded w-full px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Length</label>
        <input
          type="number"
          name="length"
          value={formData.length}
          onChange={handleChange}
          className="border rounded w-full px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium">EID</label>
        <input
          type="text"
          name="eid"
          value={formData.eid}
          onChange={handleChange}
          className="border rounded w-full px-3 py-2"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onUpdate}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </form>
  );
};

export default UpdateRecordForm;
