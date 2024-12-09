export function mapFieldTypeToSQL(fieldType: string, fieldLength: number): string {
  switch (fieldType.toLowerCase()) {
    case 'string':
      return `VARCHAR(${fieldLength})`
    case 'number':
      return 'NUMERIC'
    case 'boolean':
      return 'BOOLEAN'
    case 'date':
      return 'DATE'
    default:
      return 'TEXT'
  }
}

