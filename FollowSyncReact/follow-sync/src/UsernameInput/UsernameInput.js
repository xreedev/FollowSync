import { Button, FormField } from 'semantic-ui-react'
function UserNameInput() {
    return (
      <>
      <FormField>
      <label>First Name</label>
      <input placeholder='First Name' />
    </FormField>
    <Button type='submit'>Submit</Button>
    </>
    )}
export default UserNameInput;

