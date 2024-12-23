'use client'

import { useState } from 'react'
import {supabase} from "@/components/lib/supabaseClient"
import { mapFieldTypeToSQL } from '../utils/sqlTypeMapper'

export default function AppCreator() {
  const [appName, setAppName] = useState('')
  const [appCode, setAppCode] = useState('')
  const [appDescription, setAppDescription] = useState('')
  const [fields, setFields] = useState<Array<{ name: string; type: string; length: number }>>([])
  const [message, setMessage] = useState('')

  const handleAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Creating app...')

    try {
      // Step 1: Insert app metadata
      const { data: appData, error: appError } = await supabase
        .from('apps')
        .insert({
          app_code: appCode,
          app_name: appName,
          app_description: appDescription
        })
        .select()

      if (appError) throw appError

      const appId = appData[0].id

      // Step 2: Insert field metadata
      for (const field of fields) {
        const { error: fieldError } = await supabase
          .from('app_fields')
          .insert({
            app_id: appId,
            field_name: field.name,
            field_type: field.type,
            field_length: field.length,
            is_required: true
          })

        if (fieldError) throw fieldError
      }

      // Step 3: Dynamically create table
      await createDynamicTable(appCode, fields)

      setMessage('App created successfully!')
    } catch (error) {
      console.error('Error creating app:', error)
      setMessage('Error creating app. Please try again.')
    }
  }

  const createDynamicTable = async (appCode: string, fields: Array<{ name: string; type: string; length: number }>) => {
    let createTableSQL = `
      CREATE TABLE IF NOT EXISTS app_${appCode} (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
    `

    fields.forEach(field => {
      const sqlType = mapFieldTypeToSQL(field.type, field.length)
      createTableSQL += `${field.name} ${sqlType},`
    })

    createTableSQL = createTableSQL.slice(0, -1) + ');'

    const { error } = await supabase.rpc('execute_sql', { sql: createTableSQL })
    if (error) throw error
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleAppSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="App Name"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="App Code"
          value={appCode}
          onChange={(e) => setAppCode(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="App Description"
          value={appDescription}
          onChange={(e) => setAppDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Create App
        </button>
      </form>

      <div>
        <h2 className="text-xl font-bold mb-2">Add Fields</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.target as HTMLFormElement
            const name = (form.elements.namedItem('fieldName') as HTMLInputElement).value
            const type = (form.elements.namedItem('fieldType') as HTMLSelectElement).value
            const length = parseInt((form.elements.namedItem('fieldLength') as HTMLInputElement).value)
            setFields([...fields, { name, type, length }])
            form.reset()
          }}
          className="space-y-2"
        >
          <input type="text" name="fieldName" placeholder="Field Name" className="w-full p-2 border rounded" required />
          <select name="fieldType" className="w-full p-2 border rounded" required>
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="date">Date</option>
          </select>
          <input type="number" name="fieldLength" placeholder="Field Length" className="w-full p-2 border rounded" required />
          <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
            Add Field
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Fields</h2>
        <ul className="list-disc pl-5">
          {fields.map((field, index) => (
            <li key={index}>
              {field.name} ({field.type}, length: {field.length})
            </li>
          ))}
        </ul>
      </div>

      {message && <div className="mt-4 p-2 bg-gray-100 rounded">{message}</div>}
    </div>
  )
}